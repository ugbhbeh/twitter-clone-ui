import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import SidebarPostCard from "./SidebarPostcard"

export default function MostPopularPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await api.get('/posts/popular');
      setPosts(response.data.map(p => ({
        ...p,
        likedByUser: p.likedByUser ?? false,
        dislikedByUser: p.dislikedByUser ?? false
      })));
    } catch (error) {
      setError('Failed to fetch posts. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div className="flex flex-col gap-3">
      {posts.length === 0 ? (
        <p className="text-accent">No posts available.</p>
      ) : (
        posts.map(post => (
          <SidebarPostCard
            key={post.id}
            post={post}
            onLike={() => handleLike(post.id)}
            onDislike={() => handleDislike(post.id)}
          />
        ))
      )}
      <Link to="/explore?section=users" className="block text-primary text-sm mt-2 hover:underline">
        View All Posts
      </Link>
    </div>
  );
}
