import { useState, useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

    useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedUserId) {
      try {
        const decoded = jwtDecode(storedToken);
        if (!decoded.exp || Date.now() < decoded.exp * 1000) {
          setUserId(storedUserId);
          setToken(storedToken);
        } else {
          clearAuth();
        }
      } catch {
        setUserId(storedUserId);
        setToken(storedToken);
      }
    }
  }, [] );

  useEffect(() => {
    if (!token) return;

    const s = io("http://localhost:8080", { auth: { token } });
    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => console.log("Socket connected:", s.id));
    s.on("disconnect", () => console.log("Socket disconnected"));

    return () => s.disconnect();
  }, [token]);
 
 
  const login = (id, newToken) => {
    if (!id || !newToken) {
      logout();
      return;
    }
    localStorage.setItem("userId", id);
    localStorage.setItem("token", newToken);
    setUserId(id);
    setToken(newToken);
  };

    const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUserId(null);
    setToken(null);
  };

  const logout = () => {
    clearAuth();
    sessionStorage.clear();
    navigate("/login");
  };

  const isLoggedIn = !!userId && !!token;

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn, login, logout, socket, }}>
      {children}
    </AuthContext.Provider>
  );
 }

