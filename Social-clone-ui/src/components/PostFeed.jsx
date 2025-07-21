import { useEffect, useState, useContext } from "react";
import PostCard from "./PostCard";
import api from "../services/api";
import AuthContext from "../services/AuthContext";

export default function PostFeed() {
  const {isLoggedIn} = useContext(AuthContext)
  const [posts, setPosts] = useState([]);
  const [followedPosts, setFollowedPosts] = useState([])
  const [generalPosts, setGeneralPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
      setError('');
      setLoading(true);

      try {
        if(isLoggedIn) {
          const response = await api.get('/posts/custom-feed');
          setFollowedPosts(response.data.followedPosts);
          setGeneralPosts(response.data.generalPosts)
        } else {
        
        const response = await api.get('/posts');
        setPosts(response.data);
      }} catch (error) {
        setError('Failed to fetch posts. Please try again.');
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      } 
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      fetchPosts();
      
    } catch (err) {
      console.error("Failed to like post", err)
    }
  };

  const handleDislike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/dislike`);
      fetchPosts();
    } catch (err){
      console.log("Failed to dislike post", err)
    }
  }

  if (loading) return <div>Loading posts...</div>;

  if (error) return <div style={{color: 'red'}}>{error}</div>;

  if (isLoggedIn) {
    return (
      <div>
        {followedPosts.length > 0 && (
          <>
            <h2>From People You Follow</h2>
            {followedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onDislike={handleDislike}
              />
            ))}
            <hr/>
          </>
        )}

        <h2>Other Posts</h2>
        {generalPosts.length === 0 ? (
          <p>No other posts found.</p>
        ) : (
          generalPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          ))
        )}
      </div>
    );
  }

  // For non-logged-in users
  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))
      )}
    </div>
  );
}