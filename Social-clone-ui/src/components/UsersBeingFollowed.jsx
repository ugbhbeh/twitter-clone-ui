import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function UsersBeingFollowed() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { userId: targetUserId } = useParams(); // The user whose profile we’re viewing
  const currentUserId = localStorage.getItem("userId"); // Logged-in user

  const fetchUsers = async () => {
    setError("");
    setLoading(true);

    try {
      // Decide which profile’s following list to fetch
      const effectiveUserId = targetUserId || currentUserId;

      const response = await api.get(`/users/${effectiveUserId}/following`);
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch following users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [targetUserId]);

  const handleFollowToggle = async (targetUserId) => {
    try {
      const userIndex = users.findIndex((u) => u.id === targetUserId);
      if (userIndex === -1) return;

      const isFollowing = users[userIndex].isFollowing;

      if (isFollowing) {
        await api.post(`/follow/unfollow/${targetUserId}`);
      } else {
        await api.post(`/follow/${targetUserId}`);
      }

      // Optimistically update UI
      setUsers((prev) =>
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
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-secondary">Following</h2>
      </div>

      {loading && <div>Loading users...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && users.length === 0 && (
        <p>No users found.</p>
      )}

      {!loading &&
        !error &&
        users.map((user) => (
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
                  {user.followerCount} follower
                  {user.followerCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {user.id !== currentUserId && (
              <button
                onClick={() => handleFollowToggle(user.id)}
                className={`px-3 py-1 rounded-md text-white font-semibold whitespace-nowrap flex-shrink-0 ${
                  user.isFollowing
                    ? "bg-primary/80 hover:bg-primary/90"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
