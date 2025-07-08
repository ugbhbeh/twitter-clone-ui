import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentCard from "../components/CommentCard";
import api from "../api/api";

export default function PostView() {
    const {Id} = useParams();
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [error, setError] = useState("");

    const fetchPostWithComments = useCallback(async () => {
        try {
            const res = await api.get(`/posts/${Id}`);
            setPost(res.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.error || "Error loading page");
        }
    }, [Id]
)

    useEffect(() => {
        fetchPostWithComments();
    }, [fetchPostWithComments]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/comments/${Id}`, {
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

    const handleLike = async (commentId) => {
      try {
        await api.post(`/comments/${commentId}/like`);
        fetchPostWithComments();
      } catch (err) {
        console.log("Failed to like comment", err)
      }
      
    };

    const handleDislike = async (commentId) => {
      try {
        await api.post(`/comments/${commentId}/dislike`)
        fetchPostWithComments();
      } catch (err) {
        console.log("Failed to dislike comment", err)
      }
      
    };

    if(!post) return <div>Loading ...</div>
        return (
    <div className="post-grid">
      {error && <div className="error-message">{error}</div>}

      <article>
        <h1>{post.title}</h1>
        <div>
          By {post.author?.username || "Unknown"} •{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <p>{post.content}</p>
      </article>

      <section className="comments-section">
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            required
          />
          <button type="submit">
            Add Comment
          </button>
        </form>

        <h3>Comments</h3>
        {post.comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul>
            {post.comments.map((comment) => (
  <li key={comment.id}>
    <CommentCard
      comment={comment}
      isEditing={editingComment === comment.id}
      onEdit={(newContent) => handleEditComment(comment.id, newContent)}
      onDelete={() => handleDeleteComment(comment.id)}
      onStartEdit={() => setEditingComment(comment.id)}
      onCancelEdit={() => setEditingComment(null)}
      onLike={() => handleLike(comment.id)}
      onDislike={() => handleDislike(comment.id)}
    />
  </li>
))}

             
          </ul>
        )}
      </section>
    </div>
    )
}