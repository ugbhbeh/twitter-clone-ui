import { useContext } from "react";
import AuthContext from "../services/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Explore from "../pages/Explore";

export default function TopBar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlehome = () => {
    navigate("/");
  };

  const handleExplore = () => {
    navigate("/explore");
  };

  const userId = localStorage.getItem("userId");

  return (
    <div>
      <div>
        <button onClick={handlehome}> Home</button>
      </div>
      <div>
        <button onClick={handleExplore}> Explore</button>
      </div>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          {userId && (
            <Link to={`/profile/${userId}`}>
              <button>Profile</button>
            </Link>
          )}
        </>
      ) : (
        <Link to="/login">
          <button>Login</button>
        </Link>
      )}
    </div>

    
  );
}
