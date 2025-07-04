import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api'

function Signup(){
    const[formData, setFormData] = useState({
        email:'',
        username:'',
        password:'',
    });
    
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if(!formData.email || !formData.username || !formData.password) {
            setError('All fields are required');
            return;
        }
        try {
            const response = await api.post('/users', formData);
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (error) {
            console.log('Signup failed', error);
            setError(error.response?.data?.error || 'Signup failed, please try again.');  
        }
    };
    
    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className='auth-form'>
                <h2>Sign up</h2>
                {error && <div className='error-message' style={{color:'red', marginBottom:'1rem'}}>{error}</div>}
                
                <input type="email" name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
                <input type="text" name='username' placeholder='Username' value={formData.username} onChange={handleChange} required />
                <input type="password" name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />        
                
                <button type='submit'>Sign Up</button>
                <p> Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}

export default Signup;