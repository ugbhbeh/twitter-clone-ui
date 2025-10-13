import { useCallback, useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AuthContext from "../services/AuthContext";

export default function PostView() {
  const { Id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dropdownRef = useRef(null);

  /** Fetch post with comments */
  const fetchPost = useCallback(async () => {
    try {
      const res = await api.get(`/posts/${Id}`);
      setPost(res.data);
      setPostContent(res.data.content);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error loading post");
    }
  }, [Id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  /** Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  /** Add new comment */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/comments/${Id}`, { content: newComment });
      setNewComment("");
      fetchPost();
    } catch (err) {
      setError(err.response?.data?.error || "Error adding comment");
    }
  };

  /** Edit post */
  const handleSavePost = async () => {
    if (!postContent.trim()) return;
    try {
      await api.put(`/posts/${post.id}`, { content: postContent });
      setEditingPost(false);
      fetchPost();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update post");
    }
  };
  const handleCancelEdit = () => {
    setPostContent(post.content);
    setEditingPost(false);
  };

  /** Delete post */
  const handleDeletePost = async () => {
    try {
      await api.delete(`/posts/${post.id}`);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete post");
    }
  };

  /** Edit comment */
  const handleEditComment = async (commentId, newContent) => {
    try {
      await api.put(`/comments/${commentId}`, { content: newContent });
      setEditingComment(null);
      fetchPost();
    } catch (err) {
      setError(err.response?.data?.error || "Error updating comment");
    }
  };

  /** Delete comment */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      fetchPost();
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting comment");
    }
  };

  /** Like/dislike post */
  const handlePostLike = async () => {
    try {
      await api.post(`/posts/${post.id}/like`);
      fetchPost();
    } catch (err) {
      setError(err.response?.data?.error || "Error liking post");
    }
  };

  const handlePostDislike = async () => {
    try {
      await api.post(`/posts/${post.id}/dislike`);
      fetchPost();
    } catch (err) {
      setError(err.response?.data?.error || "Error disliking post");
    }
  };

  /** Like/dislike comment */
  const handleLike = async (commentId) => {
    try {
      await api.post(`/comments/${commentId}/like`);
      fetchPost();
    } catch (err) {
      setError(err.response?.data?.error || "Error liking comment");
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await api.post(`/comments/${commentId}/dislike`);
      fetchPost();
    } catch (err) {
      setError(err.response?.data?.error || "Error disliking comment");
    }
  };

  if (!post) return <div className="text-center py-20">Loading post...</div>;

  return (
   <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
  {error && <div className="text-red-500">{error}</div>}

  {/* Post */}
  <article className="bg-surface rounded-lg shadow-md p-6 space-y-4">
    {editingPost ? (
      <>
        <textarea
          className="w-full border border-accent/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-secondary placeholder:text-accent"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          rows={6}
        />
        <div className="flex gap-2 justify-end">
          {["Save", "Cancel"].map((label) => (
            <button
              key={label}
              className={`px-4 py-1 rounded-md ${
                label === "Save"
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-accent/20 text-secondary hover:bg-accent/30"
              }`}
              onClick={label === "Save" ? handleSavePost : handleCancelEdit}
            >
              {label}
            </button>
          ))}
        </div>
      </>
    ) : (
      <>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.profileImage || "/default-profile.png"}
              alt={post.author?.username}
              className="w-12 h-12 rounded-full object-cover border border-accent/30"
            />
            <div className="flex flex-col">
              <Link
                to={`/profile/${post.author?.id}`}
                className="font-semibold text-secondary hover:text-primary"
              >
                {post.author?.username || "Unknown"}
              </Link>
              <span className="text-sm text-accent">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {isLoggedIn && userId === post.authorId && (
            <div ref={dropdownRef} className="relative inline-block">
              <button
                className="text-xl p-1 hover:bg-accent/20 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen((prev) => !prev);
                }}
              >
                ⋮
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-surface border border-accent/30 rounded-md shadow-lg z-50 flex flex-col">
                  {[
                    { label: "Edit", action: () => setEditingPost(true) },
                    { label: "Delete", action: () => setShowDeleteModal(true), danger: true },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      className={`px-4 py-2 text-left hover:bg-${btn.danger ? "red-500 text-white" : "accent/20"}`}
                      onClick={() => {
                        setDropdownOpen(false);
                        btn.action();
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-secondary whitespace-pre-wrap">{post.content}</p>

        <div className="flex gap-4 items-center text-sm text-accent">
          <button onClick={handlePostLike} className="flex items-center gap-1 hover:text-primary">
            👍 {post.likeCount || 0}
          </button>
          <button onClick={handlePostDislike} className="flex items-center gap-1 hover:text-red-500">
            👎 {post.dislikeCount || 0}
          </button>
        </div>
      </>
    )}
  </article>

  {/* Comments */}
  <section className="space-y-4">
    <form onSubmit={handleAddComment} className="space-y-2">
      <textarea
        className="w-full border border-accent/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-secondary placeholder:text-accent"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        required
      />
      <div className="flex justify-end">
        <button type="submit" className="bg-primary text-white px-4 py-1 rounded-md hover:bg-primary/90">
          Add Comment
        </button>
      </div>
    </form>

    {post.comments.length === 0 ? (
      <p className="text-accent">No comments yet.</p>
    ) : (
      <ul className="space-y-2">
        {post.comments.map((comment) => (
          <li key={comment.id} className="bg-surface p-4 rounded-lg shadow-sm flex gap-3">
            <img
              src={comment.author?.profileImage || "/default-profile.png"}
              alt={comment.author?.username}
              className="w-10 h-10 rounded-full object-cover border border-accent/20"
            />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-secondary">{comment.author?.username}</span>
                <span className="text-xs text-accent">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-secondary">{comment.content}</p>
              <div className="flex gap-4 text-sm text-accent">
                <button onClick={() => handleLike(comment.id)} className="flex items-center gap-1 hover:text-primary">
                  👍 {comment._count?.likes || 0}
                </button>
                <button onClick={() => handleDislike(comment.id)} className="flex items-center gap-1 hover:text-red-500">
                  👎 {comment._count?.dislikes || 0}
                </button>
                {isLoggedIn && userId === comment.authorId && (
                  <>
                    {["Edit", "Delete"].map((label) => (
                      <button
                        key={label}
                        className={`text-sm text-accent hover:text-${label === "Delete" ? "red-500" : "primary"}`}
                        onClick={() => (label === "Edit" ? setEditingComment(comment.id) : handleDeleteComment(comment.id))}
                      >
                        {label}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>

  {/* Delete Modal */}
  {showDeleteModal && (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-surface p-6 rounded-lg shadow-md w-80 text-center space-y-4">
        <p className="text-secondary">Are you sure you want to delete this post?</p>
        <div className="flex justify-center gap-4">
          <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600" onClick={handleDeletePost}>
            Yes, Delete
          </button>
          <button className="bg-accent/20 text-secondary px-4 py-1 rounded-md hover:bg-accent/30" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Edit Comment Modal */}
  {editingComment && (
    <div className="bg-surface p-6 rounded-lg shadow-md w-80 text-center space-y-4">
      <h3 className="text-lg font-semibold text-secondary">Edit Comment</h3>
      <textarea
        className="w-full border border-accent/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-secondary placeholder:text-accent"
        rows={4}
        value={post.comments.find(c => c.id === editingComment)?.content || ""}
        onChange={(e) => {
          const updatedComment = e.target.value;
          setPost((prev) => ({
            ...prev,
            comments: prev.comments.map(c => c.id === editingComment ? { ...c, content: updatedComment } : c),
          }));
        }}
      />
      <div className="flex justify-center gap-4">
        <button
          className="bg-primary text-white px-4 py-1 rounded-md hover:bg-primary/90"
          onClick={() => {
            const comment = post.comments.find(c => c.id === editingComment);
            handleEditComment(comment.id, comment.content);
          }}
        >
          Save
        </button>
        <button className="bg-accent/20 text-secondary px-4 py-1 rounded-md hover:bg-accent/30" onClick={() => setEditingComment(null)}>
          Cancel
        </button>
      </div>
    </div>
  )}
</div>

  
  );}
  




 