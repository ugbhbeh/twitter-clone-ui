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
    <div className="card-social p-6">
        <h2 className="text-xl font-semibold text-secondary mb-4">Create new post</h2>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-accent mb-2">
                  What's on your mind?
                </label>
                <textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  rows={5}
                  className="input-social min-h-[120px] resize-none"
                  placeholder="Share your thoughts..."
                  required
                />
            </div>
            <div className="flex justify-end">
              <button type='submit' className="btn-primary">
                Post
              </button>
            </div>
        </form>
    </div>
   )
    
}