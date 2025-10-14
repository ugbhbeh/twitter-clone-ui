import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function SuggestedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  const fetchSuggestedUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/all-unfollowed-users");
      const usersWithFollow = res.data.map(u => ({ ...u, isFollowing: false }));
      setUsers(usersWithFollow);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    try {
      const userIndex = users.findIndex(u => u.id === targetUserId);
      if (userIndex === -1) return;

      const isFollowing = users[userIndex].isFollowing;

      if (isFollowing) {
        await api.delete(`/users/${targetUserId}/unfollow`);
      } else {
        await api.post(`/users/${targetUserId}/follow`);
      }

      setUsers(prev =>
        prev.map((u, idx) =>
          idx === userIndex ? { ...u, isFollowing: !isFollowing } : u
        )
      );
    } catch (err) {
      console.error("Follow/unfollow failed", err.response?.data || err);
    }
  };

  if (loading) return <div className="text-center text-accent">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (users.length === 0) return <div className="text-accent text-center">No users to follow</div>;

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
  key={user.id}
  className="card-social p-4 mb-3 bg-surface rounded-lg shadow flex items-center justify-between flex-wrap sm:flex-nowrap"
>
  <div className="flex items-center gap-4 flex-shrink-0">
    <Link to={`/profile/${user.id}`}>
      <img
        src={user.profileImage || "/default-profile.png"}
        alt={user.username}
        className="w-10 h-10 rounded-full object-cover border border-accent/20"
      />
    </Link>
    <div className="flex flex-col">
      <Link
        to={`/profile/${user.id}`}
        className="font-medium text-secondary hover:text-primary"
      >
        {user.username}
      </Link>
      <span className="text-sm text-accent">
        Followers: {user.followerCount || 0}
      </span>
    </div>
  </div>

  <button
    onClick={() => handleFollowToggle(user.id)}
    className="ml-4 px-4 py-1 rounded-md text-white font-semibold whitespace-nowrap flex-shrink-0 bg-primary hover:bg-primary/90"
  >
    {user.isFollowing ? "Following" : "Follow"}
  </button>
</div>
      ))}
    </div>
  );
}
