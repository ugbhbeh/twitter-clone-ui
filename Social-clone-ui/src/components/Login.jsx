import { useState } from "react";   
import { usenavigate } from "react-router-dom"; 
import axios, { Axios } from "axios";
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = usenavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:8080/users/login', {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/')
            }
        } catch (error) {
            console.log('Login failed', error)

        }
    };

    return (
        <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            <p> Don't have an account? <Link to="/signup">Sign up</Link> </p>
            </form>
            </div>
    );
}
export default Login;