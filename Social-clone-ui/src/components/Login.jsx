import { useState, useContext } from "react";   
import { useNavigate } from "react-router-dom"; 
import { Link } from 'react-router-dom';
import api from "../services/api";
import  AuthContext  from "../services/AuthContext";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', {
                email,
                password
            });

            if (response.data.token && response.data.userId) {
                 login(response.data.userId, response.data.token);
                navigate('/')
            }
        } catch (error) {
            console.log('Login failed', error)

        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background">
            <div className="card-social w-full max-w-md p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-center text-secondary mb-8">Welcome Back</h2>
                    <div className="space-y-4">
                        <div>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="input-social bg-surface text-secondary border border-accent/30 focus:border-primary placeholder:text-accent"
                                required
                            />
                        </div>
                        <div>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="input-social bg-surface text-secondary border border-accent/30 focus:border-primary placeholder:text-accent"
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