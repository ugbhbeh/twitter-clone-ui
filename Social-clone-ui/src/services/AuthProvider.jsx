import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (token && storedUserId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  function login(userId, token) {
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
    setUserId(userId);
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUserId(null);
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
