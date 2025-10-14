import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function PopularUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);

  // Fetch popular users
  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const currentUserId = localStorage.getItem("userId"); // optional
      const response = await api.get("/users/most-followed", {
        params: {
          limit,
          ...(currentUserId ? { userId: currentUserId } : {}),
        },
      });

      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [limit]);

  // Handle follow/unfollow
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

      // Update local state to reflect new follow status
      setUsers(prev =>
        prev.map((u, idx) =>
          idx === userIndex ? { ...u, isFollowing: !isFollowing } : u
        )
      );
    } catch (err) {
      console.error("Follow/unfollow failed", err.response?.data || err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with limit selector */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-secondary">Popular Users</h2>
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

      {/* Loading / error / empty states */}
      {loading && <div>Loading users...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {/* User list */}
      {!loading &&
        !error &&
        users.map(user => (
          <div
            key={user.id}
            className="card-social p-3 mb-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
              <Link to={`/profile/${user.id}`} className="flex-shrink-0">
                <img
                  src={user.profileImage || "/default-profile.png"}
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
              onClick={() => handleFollowToggle(user.id)}
              className={`px-3 py-1 rounded-md text-white font-semibold whitespace-nowrap flex-shrink-0 ${
                user.isFollowing ? "bg-gray-400 cursor-default" : "bg-primary hover:bg-primary/90"
              }`}
              disabled={user.isFollowing} // optional: disable button if already following
            >
              {user.isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        ))}
    </div>
  );
}
