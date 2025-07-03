import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import { useState, useEffect } from 'react';
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
    <Router>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} /> } />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to ="/" /> } />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to ="/" /> } />
        </Routes>
    </Router>
  )
}

export default App
