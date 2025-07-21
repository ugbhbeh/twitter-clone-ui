import { useLocation, useNavigate } from "react-router-dom";          
import PopularPosts from "../components/PopularPosts";
import PopularUsers from "../components/PopularUsers";

export default function Explore() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const section = params.get('section') || 'posts';

  const handleSectionChange = (value) => {
    navigate(`/explore?section=${value}`);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleSectionChange("posts")}>
          Top Posts
        </button>
        <button onClick={() => handleSectionChange("users")}>
          Top Users
        </button>
      </div>

      {section === 'users' ? (
        <PopularUsers />
      ) : (
        <PopularPosts />
      )}
    </div>
  );
}
