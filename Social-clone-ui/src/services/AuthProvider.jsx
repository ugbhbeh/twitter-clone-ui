import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (token && storedUser) {
      setUserId(storedUser.id);
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  function login(user, token) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUserId(user.id);
    setUser(user);
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserId(null);
    setUser(null);
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ userId, user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
