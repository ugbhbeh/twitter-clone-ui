import { useEffect, useState } from "react";
import api from "../api/api";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setError('');
      setLoading(true);
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        setError('Failed to fetch posts. Please try again.');
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };

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
          <div key={post.id}>
            <h3>{post.author?.username || 'Unknown Author'}</h3>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
   
  );
}

 //<div>
      //{posts.length === 0 ? (
       // <p>No posts available.</p>
      //) : (
        //posts.map(post => (
         // <div key={post.id}>
         // <h3>{post.author?.username || 'Unknown Author'}</h3>
        //  <p>{post.content}</p>
         //  <small>{new Date(post.createdAt).toLocaleString()}</small>
         // </div>
      //  ))
    //  )}
    //</div>