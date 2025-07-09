import { useContext } from "react";
import AuthContext from "../services/AuthContext";
import { Link, useNavigate } from "react-router-dom";         




export default  function TopBar() {
    const {isLoggedIn, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/")
    };

    return (
        <div>
            {isLoggedIn? (<button onClick={handleLogout}>Logout</button>) 
            : 
            ( <Link to="/login">
                 <button>Login</button>
                </Link>
            )}
        </div>

    );  
}