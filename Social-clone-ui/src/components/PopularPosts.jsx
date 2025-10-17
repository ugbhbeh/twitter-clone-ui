import { useEffect, useState } from "react";
import api from "../services/api";
import SidebarPostCard from "./SidebarPostcard"

export default function PopularPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);

  const fetchPosts = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.get(`/posts/popular?limit=${limit}`);
      setPosts(res.data.map(p => ({
        ...p,
        likedByUser: p.likedByUser ?? false,
        dislikedByUser: p.dislikedByUser ?? false,
      })));
    } catch (err) {
      setError("Failed to fetch posts. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [limit]);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-secondary">Popular Posts</h2>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border border-accent/40 rounded-md px-2 py-1 text-sm bg-surface text-secondary focus:outline-none"
        >
          {[5, 10, 15, 20, 25].map((n) => (
            <option key={n} value={n}>Top {n}</option>
          ))}
        </select>
      </div>

      {loading && <div>Loading posts...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && posts.length === 0 && <p>No posts available.</p>}

      {!loading && !error && posts.map((post) => (
        <SidebarPostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
          onDislike={() => handleDislike(post.id)}
        />
      ))}
    </div>
  );
}
