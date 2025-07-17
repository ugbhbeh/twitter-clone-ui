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
    <div>
      {users.map(user => (
        <div key={user.id} >
          <Link to={`/profile/${user.id}`}>
            <img 
              src={user.profileImage || '/default-profile.png'} 
              alt={`${user.username}'s profile`} 
            />
          </Link>
          <div>
            <Link to={`/profile/${user.id}`}>
              {user.username}
            </Link>
            <div>
              Followers: {user.followerCount ?? 0}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
