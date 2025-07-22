import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function PopularUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setError('');
      setLoading(true);
      try {
        const response = await api.get('/users/most-followed?limit=25');
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
    <div className="space-y-4">
      {users.map(user => (
        <div key={user.id} className="card-social flex items-center p-4 bg-surface rounded-lg shadow hover:shadow-md transition-shadow">
          <Link to={`/profile/${user.id}`} className="mr-4">
            <img 
              src={user.profileImage || '/default-profile.png'} 
              alt={`${user.username}'s profile`} 
              className="w-12 h-12 rounded-full object-cover border border-accent/30"
            />
          </Link>
          <div className="flex-1">
            <Link to={`/profile/${user.id}`} className="font-semibold text-secondary hover:text-primary">
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
