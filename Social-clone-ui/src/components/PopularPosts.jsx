import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import SidebarPostCard from "./SidebarPostcard";

export default function PopularPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
      setError('');
      setLoading(true);
      try {
        const response = await api.get('/posts/popular?limit=25');
        setPosts(response.data);
      } catch (error) {
        setError('Failed to fetch posts. Please try again.');
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };
  
  useEffect(() => {
    fetchPosts();
  }, []);

   if (loading) return <div>Loading posts...</div>;
  
    if (error) return <div style={{color: 'red'}}>{error}</div>;
  
    return (
      <div>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
              posts.map(post => (
                < SidebarPostCard key={post.id} post={post} />
        ))
      )}
      </div>   
    );
}