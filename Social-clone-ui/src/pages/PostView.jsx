import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import CommentCard from "../components/CommentCard";

export default function PostView() {
  const { Id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState("");

  /** Fetch post with comments */
  const fetchPost = useCallback(async () => {
    try {
      const res = await api.get(`/posts/${Id}`);
      setPost(res.data);
      setPostContent(res.data.content);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error loading post");
    }
  }, [Id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  /** Post actions */
  const handleSavePost = async () => {
    if (!postContent.trim()) return;
    try {
      await api.put(`/posts/${post.id}`, { content: postContent });
      setEditingPost(false);
      fetchPost();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update post");
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/posts/${post.id}`);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to delete post");
    }
  };

  const handlePostLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      fetchPost();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error liking post");
    }
  };

  const handlePostDislike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/dislike`);
      fetchPost();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error disliking post");
    }
  };

  /** Toggle follow for post author */
  const toggleFollow = async () => {
    if (!post || !post.author) return;
    const authorId = post.author.id;
    const currentlyFollowing = post.author.isFollowing;

    // Optimistically update
    setPost((prev) => ({
      ...prev,
      author: { ...prev.author, isFollowing: !currentlyFollowing },
    }));

    try {
      if (currentlyFollowing) {
        await api.delete(`/users/${authorId}/unfollow`);
      } else {
        await api.post(`/users/${authorId}/follow`);
      }
    } catch (err) {
      console.error("Follow/unfollow failed", err);
      // revert on error
      setPost((prev) => ({
        ...prev,
        author: { ...prev.author, isFollowing: currentlyFollowing },
      }));
    }
  };

  /** Comment actions */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/comments/${Id}`, { content: newComment });
      setNewComment("");
      fetchPost();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error adding comment");
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await api.put(`/comments/${commentId}`, { content: newContent });
      setEditingComment(null);
      fetchPost();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error updating comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      fetchPost();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error deleting comment");
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await api.post(`/comments/${commentId}/like`);
      fetchPost();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error liking comment");
    }
  };

  const handleDislikeComment = async (commentId) => {
    try {
      await api.post(`/comments/${commentId}/dislike`);
      fetchPost();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error disliking comment");
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {error && <div className="text-red-500">{error}</div>}

      {/* Post */}
      <PostCard
        post={post}
        postContent={postContent}
        setPostContent={setPostContent}
        isEditing={editingPost}
        onEdit={handleSavePost}
        onDelete={handleDeletePost}
        onLike={handlePostLike}
        onDislike={handlePostDislike}
        onCancelEdit={() => setEditingPost(false)}
        toggleFollow={toggleFollow}
        isFollowing={post.author?.isFollowing}
      />

      {/* New Comment Form */}
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
          <button
            type="submit"
            className="bg-primary text-white px-4 py-1 rounded-md hover:bg-primary/90"
          >
            Add Comment
          </button>
        </div>
      </form>

      {/* Comments */}
      <section className="space-y-2">
        {post.comments.length === 0 ? (
          <p className="text-accent">No comments yet.</p>
        ) : (
          post.comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              isEditing={editingComment === comment.id}
              onStartEdit={() => setEditingComment(comment.id)}
              onCancelEdit={() => setEditingComment(null)}
              onEdit={(newContent) => handleEditComment(comment.id, newContent)}
              onDelete={() => handleDeleteComment(comment.id)}
              onLike={handleLikeComment}
              onDislike={handleDislikeComment}
            />
          ))
        )}
      </section>
    </div>
  );
}
