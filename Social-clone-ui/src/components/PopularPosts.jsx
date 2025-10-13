import { useEffect, useState } from "react";
import api from "../services/api";
import SidebarPostCard from "./SidebarPostcard";

export default function PopularPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);

  const fetchPosts = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.get(`/posts/popular?limit=${limit}`);
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts", err);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [limit]);

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
            <option key={n} value={n}>
              Top {n}
            </option>
          ))}
        </select>
      </div>

      {loading && <div>Loading posts...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && posts.length === 0 && <p>No posts available.</p>}

      {!loading && !error && posts.map((post) => (
        <SidebarPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
