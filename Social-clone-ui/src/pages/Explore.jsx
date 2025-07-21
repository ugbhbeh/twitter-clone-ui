import { useState } from "react";           
import PopularPosts from "../components/PopularPosts";
import PopularUsers from "../components/PopularUsers";

export default function Explore(){
    const [view, setView] = useState('posts');

    return (
        <div>
      <div>
        <button
          onClick={() => setView("posts")}
        >
            Top Posts
        </button>
        <button
          onClick={() => setView("users")}
        >
          Top Users
        </button>
      </div>

      {view === "posts" ? <PopularPosts /> : <PopularUsers />}
    </div>
  );
    
}