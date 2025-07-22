import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'

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
        <div className="min-h-[80vh] flex items-center justify-center bg-background">
            <div className="card-social w-full max-w-md p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-center text-secondary mb-8">Sign Up</h2>
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}
                    <div className="space-y-4">
                        <input type="email" name='email' placeholder='Email' value={formData.email} onChange={handleChange} required className="input-social bg-surface text-secondary border border-accent/30 focus:border-primary placeholder:text-accent" />
                        <input type="text" name='username' placeholder='Username' value={formData.username} onChange={handleChange} required className="input-social bg-surface text-secondary border border-accent/30 focus:border-primary placeholder:text-accent" />
                        <input type="password" name='password' placeholder='Password' value={formData.password} onChange={handleChange} required className="input-social bg-surface text-secondary border border-accent/30 focus:border-primary placeholder:text-accent" />
                    </div>
                    <button type='submit' className="btn btn-primary w-full">Sign Up</button>
                    <p className="text-center text-accent mt-4">Already have an account? <Link to="/login" className="text-primary hover:text-primary/90">Login</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Signup;