import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentCard from "../components/CommentCard";
import api from "../api/api";

export default function PostView() {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dropdownRef = useRef(null);
  

  const fetchPostWithComments = useCallback(async () => {
    try {
      const res = await api.get(`/posts/${Id}`);
      setPost(res.data);
      setPostContent(res.data.content);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error loading page");
    }
  }, [Id]);

  useEffect(() => {
    fetchPostWithComments();
  }, [fetchPostWithComments]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/comments/${Id}`, { content: newComment });
      setNewComment("");
      fetchPostWithComments();
    } catch (err) {
      setError(err.response?.data?.error || "Error adding comment");
    }
  };

  const handleEditPost = () => {
    setEditingPost(true);
    setDropdownOpen(false);
  };

  const handleSavePost = async () => {
    try {
      await api.put(`/posts/${post.id}`, { content: postContent });
      setEditingPost(false);
      fetchPostWithComments();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update post");
    }
  };

  const handleCancelEdit = () => {
    setPostContent(post.content);
    setEditingPost(false);
  };

  const handleDeletePost = async () => {
    try {
       setShowDeleteModal(false);
      await api.delete(`/posts/${post.id}`);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete post");
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await api.put(`/comments/${commentId}`, { content: newContent });
      setEditingComment(null);
      fetchPostWithComments();
    } catch (err) {
      setError(err.response?.data?.error || "Error updating comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/comments/${commentId}`);
        fetchPostWithComments();
      } catch (err) {
        setError(err.response?.data?.error || "Error deleting comment");
      }
    }
  };

  const handleLike = async (commentId) => {
    try {
      await api.post(`/comments/${commentId}/like`);
      fetchPostWithComments();
    } catch (err) {
      console.log("Failed to like comment", err);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await api.post(`/comments/${commentId}/dislike`);
      fetchPostWithComments();
    } catch (err) {
      console.log("Failed to dislike comment", err);
    }
  };

  if (!post) return <div>Loading ...</div>;

  return (
    <div>
      {error && <div>{error}</div>}

      <article>
        {editingPost ? (
          <>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows="6"
            />
            <div>
              <button onClick={handleSavePost}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h1>{post.title}</h1>
            <div>
              By {post.author?.username || "Unknown"} •{" "}
              {new Date(post.createdAt).toLocaleDateString()}
               
                <div
                  ref={dropdownRef}
                  style={{ display: "inline-block", marginLeft: "10px" }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen((prev) => !prev);
                    }}
                  >
                    ⋮
                  </button>
                  {dropdownOpen && (
                    <div>
                      <button onClick={handleEditPost}>Edit</button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              
            </div>
            <p>{post.content}</p>
          </>
        )}
      </article>

      <section>
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            required
          />
          <button type="submit">Add Comment</button>
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
                  onEdit={(newContent) =>
                    handleEditComment(comment.id, newContent)
                  }
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

      {showDeleteModal && (
        <div>
          <div>
            <p>Are you sure you want to delete this post?</p>
            <button onClick={handleDeletePost}>Yes, Delete</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
