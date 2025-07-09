import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import PostView from './pages/PostView'
import { AuthProvider } from './services/AuthContext'
import TopBar from './components/TopBar'
import { useState, useEffect } from 'react';
import { BrowserRouter} from 'react-router-dom';
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
     <BrowserRouter>
      <AuthProvider>
        <TopBar />
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} /> } />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to ="/" /> } />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to ="/" /> } />
         <Route path="/posts/:Id" element={<PostView />} />
        </Routes>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App
