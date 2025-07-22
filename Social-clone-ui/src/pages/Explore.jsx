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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => handleSectionChange("posts")}
          className={`btn btn-primary px-6 py-2 font-semibold ${section === 'posts' ? '' : 'btn-outline'}`}
        >
          Top Posts
        </button>
        <button
          onClick={() => handleSectionChange("users")}
          className={`btn btn-primary px-6 py-2 font-semibold ${section === 'users' ? '' : 'btn-outline'}`}
        >
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
