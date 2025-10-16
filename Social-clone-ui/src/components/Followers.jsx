import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";


export default function Followers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null); 

  const { userId: targetUserId } = useParams(); 
  const currentUserId = localStorage.getItem("userId"); 

  const fetchUsers = async () => {
    setError("");
    setLoading(true);

    try {
      const effectiveUserId = targetUserId || currentUserId;
      const response = await api.get(`/users/${effectiveUserId}/followers`);
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch followers. Please try again.");
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
        await api.delete(`/users/${targetUserId}/unfollow`);
      } else {
        await api.post(`/users/${targetUserId}/follow`);
      }

      setUsers((prev) =>
        prev.map((u, idx) =>
          idx === userIndex ? { ...u, isFollowing: !isFollowing } : u
        )
      );
    } catch (err) {
      console.error("Follow/unfollow failed", err.response?.data || err);
    }
  };

const handleRemoveFollower = async (followerId) => {
  try {
    await api.delete(`/users/${followerId}/remove-follower`);
    setUsers((prev) => prev.filter((u) => u.id !== followerId));
    setMenuOpen(null);
  } catch (err) {
    console.error("Failed to remove follower", err.response?.data || err);
  }
};


  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-secondary">Followers</h2>
      </div>

      {loading && <div>Loading users...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && users.length === 0 && (
        <p>No followers found.</p>
      )}

      {!loading &&
        !error &&
        users.map((user) => (
          <div
            key={user.id}
            className="card-social p-3 mb-3 flex items-center justify-between gap-3 relative"
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

            {/* Follow toggle */}
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

            {/* Dropdown menu for removing followers (only for your own profile) */}
            {targetUserId === currentUserId && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() =>
                    setMenuOpen(menuOpen === user.id ? null : user.id)
                  }
                  className="p-2 hover:bg-accent/20 rounded-full"
                >
                  <div className="w-5 h-5 text-secondary" />
                </button>

                {menuOpen === user.id && (
                  <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-accent/20 w-36 z-10">
                    <button
                      onClick={() => handleRemoveFollower(user.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-accent/10"
                    >
                      Remove Follower
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
