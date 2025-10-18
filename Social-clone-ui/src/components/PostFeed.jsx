import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import AuthContext from "../services/AuthContext";
import PostCard from "./PostCard";

export default function PostFeed() {
  const { isLoggedIn } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [followedPosts, setFollowedPosts] = useState([]);
  const [generalPosts, setGeneralPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [followingState, setFollowingState] = useState({});

  const fetchPosts = async () => {
    setError('');
    setLoading(true);
    try {
      if (isLoggedIn) {
        const response = await api.get('/posts/custom-feed');
        setFollowedPosts(response.data.followedPosts);
        setGeneralPosts(response.data.generalPosts);
      } else {
        const response = await api.get('/posts');
        setPosts(response.data);
      }
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

const updatePostState = (postId, updateFn) => {
  const apply = (arr) => arr.map(p => (p.id === postId ? updateFn(p) : p));
  setFollowedPosts(prev => apply(prev));
  setGeneralPosts(prev => apply(prev));
  setPosts(prev => apply(prev));
};

const toggleFollow = async (userId) => {
  const currentlyFollowing = followingState[userId] ?? false;

 
  setFollowingState(prev => ({
    ...prev,
    [userId]: !currentlyFollowing
  }));

  try {
    if (currentlyFollowing) {
      await api.delete(`/users/${userId}/unfollow`);
    } else {
      await api.post(`/users/${userId}/follow`);
    }
  } catch (err) {
    console.error("Follow/unfollow failed:", err);

    setFollowingState(prev => ({
      ...prev,
      [userId]: currentlyFollowing
    }));
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
        likes: p.likedByUser
          ? Math.max((p._count?.likes ?? 1) - 1, 0)
          : (p._count?.likes ?? 0) + 1,
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
        dislikes: p.dislikedByUser
          ? Math.max((p._count?.dislikes ?? 1) - 1, 0)
          : (p._count?.dislikes ?? 0) + 1,
        likes: p.likedByUser ? (p._count?.likes ?? 0) : (p._count?.likes ?? 0)
      }
    }));
  }
};

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
                onFollowToggle={toggleFollow}
                isFollowing={followingState[post.author?.id] ?? post.author?.isFollowing}
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