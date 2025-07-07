import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function PostView() {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [error, setError] = useState("");

    const fetchPostWithComments = async () => {
        try {
            const res = await api.get(`/posts/${postId}`);
            setPost(res.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.error || "Error loading page");
        }
    };

    useEffect(() => {
        fetchPostWithComments();
    }, [postId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/comments/${postId}`, {
                content: newComment,
            });
            setNewComment("");
            fetchPostWithComments();
        } catch (err) {
            setError(err.response?.data?.error || "Error adding comment")
        }
    };

    const handleEditComment = async (commentId, newContent) => {
        try {
            await api.put(`/comments/${commentId}`, {content: newContent});
            setEditingComment(null);
            fetchPostWithComments();
        } catch (err) {
            setError(err.response?.data?.error || "Error updating comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if(window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await api.delete(`/comments/${commentId}`);
                fetchPostWithComments();
            } catch (err) {
                setError(err.response?.data.error || "Error deleting comment");
            }
        }
    };

    if(!post) return <div>Loading ...</div>
        return (
    <div className="post-grid">
      {error && <div className="error-message">{error}</div>}

      <article className="post-card fade-in">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="text-secondary mb-4">
          By {post.author?.username || "Unknown"} •{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <p className="mb-6">{post.content}</p>
      </article>

      <section className="comments-section">
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            required
          />
          <button type="submit" className="primary mt-2">
            Add Comment
          </button>
        </form>

        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        {post.comments.length === 0 ? (
          <p className="text-secondary">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {post.comments.map((comment) => (
              <li key={comment.id} className="comment fade-in">
                {editingComment === comment.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditComment(comment.id, e.target.content.value);
                    }}
                  >
                    <textarea
                      name="content"
                      defaultValue={comment.content}
                      rows="2"
                      required
                    />
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="primary">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingComment(null)}
                        className="danger"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.author?.username || "Unknown"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingComment(comment.id)}
                          className="text-sm text-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-sm text-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p>{comment.content}</p>
                    <small className="text-secondary">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </small>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
    )
}