import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import AuthContext from "../services/AuthContext";
import PostCard from "./PostCard";

export default function PostFeed() {
  const { isLoggedIn } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [followedPosts, setFollowedPosts] = useState([]);
  const [generalPosts, setGeneralPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followingState, setFollowingState] = useState({});
  const [loadingFollows, setLoadingFollows] = useState({});

  const fetchPosts = async () => {
    setError('');
    setLoading(true);
    try {
      if (isLoggedIn) {
        const response = await api.get('/posts/custom-feed');
        setFollowedPosts(response.data.followedPosts);
        setGeneralPosts(response.data.generalPosts);
        initFollowingState([...response.data.followedPosts, ...response.data.generalPosts]);
      } else {
        const response = await api.get('/posts');
        setPosts(response.data);
        initFollowingState(response.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  const initFollowingState = (allPosts) => {
    const state = {};
    allPosts.forEach(post => {
      if (post.author?.id) state[post.author.id] = post.author.isFollowing || false;
    });
    setFollowingState(state);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const updatePostState = (postId, updateFn) => {
    const apply = arr => arr.map(p => p.id === postId ? updateFn(p) : p);
    setFollowedPosts(prev => apply(prev));
    setGeneralPosts(prev => apply(prev));
    setPosts(prev => apply(prev));
  };

  const toggleFollow = async (userId) => {
    if (loadingFollows[userId]) return;

    const currentlyFollowing = followingState[userId];
    setFollowingState(prev => ({ ...prev, [userId]: !currentlyFollowing }));
    setLoadingFollows(prev => ({ ...prev, [userId]: true }));

    try {
      if (currentlyFollowing) {
        await api.delete(`/users/${userId}/unfollow`);
      } else {
        await api.post(`/users/${userId}/follow`);
      }
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
      setFollowingState(prev => ({ ...prev, [userId]: currentlyFollowing }));
    } finally {
      setLoadingFollows(prev => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    }
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
          likes: alreadyLiked ? Math.max((p._count?.likes ?? 1) - 1, 0) : (p._count?.likes ?? 0) + 1,
          dislikes: alreadyDisliked ? Math.max((p._count?.dislikes ?? 1) - 1, 0) : (p._count?.dislikes ?? 0),
        }
      };
    });

    try {
      await api.post(`/posts/${postId}/like`);
    } catch {
      updatePostState(postId, p => ({ ...p, likedByUser: !p.likedByUser }));
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
          dislikes: alreadyDisliked ? Math.max((p._count?.dislikes ?? 1) - 1, 0) : (p._count?.dislikes ?? 0) + 1,
          likes: alreadyLiked ? Math.max((p._count?.likes ?? 1) - 1, 0) : (p._count?.likes ?? 0),
        }
      };
    });

    try {
      await api.post(`/posts/${postId}/dislike`);
    } catch {
      updatePostState(postId, p => ({ ...p, dislikedByUser: !p.dislikedByUser }));
    }
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  const renderPosts = (arr) =>
    arr.map(post => (
      <PostCard
        key={post.id}
        post={post}
        onLike={handleLike}
        onDislike={handleDislike}
        toggleFollow={toggleFollow}
        isFollowing={followingState[post.author?.id] || false}
      />
    ));

  if (isLoggedIn) {
    return (
      <div>
        {followedPosts.length > 0 && (
          <>
            <h2>From People You Follow</h2>
            {renderPosts(followedPosts)}
            <hr/>
          </>
        )}
        <h2>Other Posts</h2>
        {generalPosts.length === 0 ? <p>No other posts found.</p> : renderPosts(generalPosts)}
      </div>
    );
  }

  return <div>{posts.length === 0 ? <p>No posts available.</p> : renderPosts(posts)}</div>;
}
