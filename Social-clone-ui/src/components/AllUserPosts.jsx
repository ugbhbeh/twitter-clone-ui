import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "./PostCard";

export default function UserPosts({ userId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  async function fetchPosts() {
    try {
      const res = await api.get(`/users/${userId}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch user posts", err);
    }
  }

  if (!posts.length)
    return <p className="text-accent text-center">No posts yet.</p>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
