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
    try {
      const currentlyFollowing = followingState[userId];
      if (currentlyFollowing) {
        await api.delete(`/users/${userId}/unfollow`);
      } else {
        await api.post(`/users/${userId}/follow`);
      }

      setFollowingState(prev => ({
        ...prev,
        [userId]: !currentlyFollowing
      }));
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
    }
  };

  if (loading) return <p>Loading suggested users...</p>;

  return (
    <div className="space-y-4">
      {users.map(user => (
        <div
          key={user.id}
          className="flex items-center justify-between p-3 border rounded-md shadow-sm"
        >
          <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-500">
                {user.followerCount} follower{user.followerCount !== 1 ? "s" : ""}
              </p>
            </div>
          </Link>
          <button
            className={`px-4 py-1 rounded ${
              followingState[user.id] ? "bg-blue-500 text-white" : "bg-blue-500 text-white"
            }`}
            onClick={() => toggleFollow(user.id)}
          >
            {followingState[user.id] ? "Followed" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
}
