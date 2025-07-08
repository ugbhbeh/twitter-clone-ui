import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default  function CreatePost() {
   const [content, setContent] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        await api.post('/posts', {content});
        setContent('');
        navigate('/')
    } catch (error) {
        setError(error.response?.data?.error || 'Failed to create post, Please try again');
    }
   };

   return (
    <div>
        <h2>Create new post</h2>
        {error && <div>{error}</div>}
        <form onSubmit={handleSubmit}>
            <div>
                <label> Content </label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} required/>
            </div>
            <button type='submit'>Create Post</button>
        </form>
    </div>
   )
    
}