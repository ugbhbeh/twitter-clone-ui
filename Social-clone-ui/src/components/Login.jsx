import { useState, useContext } from "react";   
import { useNavigate } from "react-router-dom"; 
import { Link } from 'react-router-dom';
import api from "../services/api";
import AuthContext from "../services/AuthContext";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data.token && response.data.userId) {
        login(response.data.userId, response.data.token);
        navigate('/');
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password.");
      console.error(err);
    }
  };

  // Input classes with conditional error styling
  const inputClass = (field) =>
    `input-social bg-surface text-secondary border ${
      error && (!field || field === "email") ? "border-red-500" : "border-accent/30"
    } focus:border-primary placeholder:text-accent`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="card-social-auth w-full max-w-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-secondary mb-4">Welcome Back</h2>

          {error && <p className="text-red-500 text-center mb-2">{error}</p>}

          <div className="space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={inputClass("email")}
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={inputClass("password")}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>

          <p className="text-center text-accent mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary/90">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
