import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function MostFollowedUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setError('');
      setLoading(true);
      try {
        const response = await api.get('/users/most-followed');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (users.length === 0) return <p>No users found.</p>;

  return (
    <div className="flex flex-col gap-3">
      {users.map(user => (
        <div key={user.id} className="flex items-center gap-3 bg-surface rounded-lg shadow p-2 hover:shadow-md transition-shadow">
          <Link to={`/profile/${user.id}`} className="flex-shrink-0">
            <img 
              src={user.profileImage || '/default-profile.png'} 
              alt={`${user.username}'s profile`} 
              className="w-10 h-10 rounded-full object-cover border border-accent/20"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/profile/${user.id}`} className="font-medium text-secondary hover:text-primary truncate">
              {user.username}
            </Link>
            <div className="text-xs text-accent truncate">
              Followers: {user.followerCount ?? 0}
            </div>
          </div>
        </div>
      ))}
      <Link to="/explore?section=users" className="block text-primary text-sm mt-2 hover:underline">View All Users</Link>
    </div>
  );
}
