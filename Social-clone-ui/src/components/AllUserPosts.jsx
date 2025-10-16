import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import api from "../services/api";

export default function UserPosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${userId}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const toggleLike = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const action = post.isLiked ? "dislike" : "like";
      await api.post(`/posts/${postId}/${action}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-6">Loading posts...</div>;
  if (!posts.length) return <div className="text-center py-6">No posts yet</div>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />
      ))}
    </div>
  );
}
