import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function SuggestedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingState, setFollowingState] = useState({}); 

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users/all-unfollowed-users");
      setUsers(data);
      const initialState = {};
      data.forEach(user => {
        initialState[user.id] = false; 
      });
      setFollowingState(initialState);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch suggested users:", error);
      setLoading(false);
    }
  };

  fetchUsers();
}, []);

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

  if (loading) return <p>Loading suggested users...</p>;

  return (
    <div className="space-y-4">
  {!loading &&
    users.map(user => (
      <div
        key={user.id}
        className="card-social p-3 mb-3 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
          <Link to={`/profile/${user.id}`} className="flex-shrink-0">
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt={`${user.username}'s profile`}
              className="w-10 h-10 rounded-full object-cover border border-accent/30"
            />
          </Link>

          <div className="flex flex-col min-w-0 overflow-hidden">
            <Link
              to={`/profile/${user.id}`}
              className="font-medium text-secondary hover:text-primary truncate"
            >
              {user.username}
            </Link>
            <span className="text-sm text-accent truncate">
              {user.followerCount} follower{user.followerCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <button
          onClick={() => toggleFollow(user.id)}
          className={`px-3 py-1 rounded-md text-white font-semibold whitespace-nowrap flex-shrink-0 ${
            followingState[user.id] ? "bg-primary hover:bg-primary/90" : "bg-primary hover:bg-primary/90"
          }`}
        >
          {followingState[user.id] ? "Followed" : "Follow"}
        </button>
      </div>
    ))}
</div>

  );
}
