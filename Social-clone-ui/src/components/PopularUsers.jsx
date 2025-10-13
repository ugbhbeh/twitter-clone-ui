import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function PopularUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);

  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.get(`/users/most-followed?limit=${limit}`);
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

  return (
    <div className="space-y-4">
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

      {loading && <div>Loading users...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {!loading &&
        !error &&
        users.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-4 bg-surface rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Link to={`/profile/${user.id}`} className="mr-4">
              <img
                src={user.profileImage || "/default-profile.png"}
                alt={`${user.username}'s profile`}
                className="w-12 h-12 rounded-full object-cover border border-accent/30"
              />
            </Link>
            <div className="flex-1">
              <Link
                to={`/profile/${user.id}`}
                className="font-semibold text-secondary hover:text-primary"
              >
                {user.username}
              </Link>
              <div className="text-sm text-accent">
                Followers: {user.followerCount ?? 0}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
