import { useEffect, useState } from "react";
import PostCard2 from "./PostCard2";
import api from "../services/api";

export default function UserPosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${userId}/posts`);
      setPosts(res.data.map(p => ({
        ...p,
        likedByUser: p.likedByUser ?? false,
        dislikedByUser: p.dislikedByUser ?? false,
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const updatePostState = (postId, updateFn) => {
    setPosts(prev => prev.map(p => (p.id === postId ? updateFn(p) : p)));
  };

  const handleLike = async (postId) => {
    updatePostState(postId, (p) => {
      const alreadyLiked = p.likedByUser;
      const alreadyDisliked = p.dislikedByUser;

      return {
        ...p,
        likedByUser: !alreadyLiked,
        dislikedByUser: false,
        _count: {
          ...p._count,
          likes: alreadyLiked ? Math.max((p._count?.likes ?? 1) - 1, 0) : (p._count?.likes ?? 0) + 1,
          dislikes: alreadyDisliked ? Math.max((p._count?.dislikes ?? 1) - 1, 0) : (p._count?.dislikes ?? 0)
        }
      };
    });

    try {
      await api.post(`/posts/${postId}/like`);
    } catch {
      // rollback
      updatePostState(postId, (p) => ({
        ...p,
        likedByUser: p.likedByUser ? false : true,
        dislikedByUser: p.dislikedByUser,
        _count: {
          ...p._count,
          likes: p.likedByUser ? Math.max((p._count?.likes ?? 1) - 1, 0) : (p._count?.likes ?? 0) + 1,
          dislikes: p.dislikedByUser ? (p._count?.dislikes ?? 0) : (p._count?.dislikes ?? 0)
        }
      }));
    }
  };

  const handleDislike = async (postId) => {
    updatePostState(postId, (p) => {
      const alreadyDisliked = p.dislikedByUser;
      const alreadyLiked = p.likedByUser;

      return {
        ...p,
        dislikedByUser: !alreadyDisliked,
        likedByUser: false,
        _count: {
          ...p._count,
          dislikes: alreadyDisliked ? Math.max((p._count?.dislikes ?? 1) - 1, 0) : (p._count?.dislikes ?? 0) + 1,
          likes: alreadyLiked ? Math.max((p._count?.likes ?? 1) - 1, 0) : (p._count?.likes ?? 0)
        }
      };
    });

    try {
      await api.post(`/posts/${postId}/dislike`);
    } catch {
      // rollback
      updatePostState(postId, (p) => ({
        ...p,
        dislikedByUser: p.dislikedByUser ? false : true,
        likedByUser: p.likedByUser,
        _count: {
          ...p._count,
          dislikes: p.dislikedByUser ? Math.max((p._count?.dislikes ?? 1) - 1, 0) : (p._count?.dislikes ?? 0) + 1,
          likes: p.likedByUser ? (p._count?.likes ?? 0) : (p._count?.likes ?? 0)
        }
      }));
    }
  };

  if (loading) return <div className="text-center py-6">Loading posts...</div>;
  if (!posts.length) return <div className="text-center py-6">No posts yet</div>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard2
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
          onDislike={() => handleDislike(post.id)}
        />
      ))}
    </div>
  );
}
