import { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../services/AuthContext";

export default function PostCard({ post, isEditing, postContent, setPostContent, onEdit, onDelete, onLike, onDislike, onCancelEdit }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userId, isLoggedIn } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  const isAuthor = isLoggedIn && userId === post.authorId;

  return (
    <article className="bg-surface rounded-lg shadow-md p-6 space-y-4">
      {isEditing ? (
        <>
          <textarea
            className="w-full border border-accent/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-secondary placeholder:text-accent"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={6}
          />
          <div className="flex gap-2 justify-end">
            <button className="bg-primary text-white px-4 py-1 rounded-md hover:bg-primary/90" onClick={onEdit}>
              Save
            </button>
            <button className="bg-accent/20 text-secondary px-4 py-1 rounded-md hover:bg-accent/30" onClick={onCancelEdit}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.profileImage || "/default-profile.png"}
                alt={post.author?.username}
                className="w-12 h-12 rounded-full object-cover border border-accent/30"
              />
              <div className="flex flex-col">
                <Link to={`/profile/${post.author?.id}`} className="font-semibold text-secondary hover:text-primary">
                  {post.author?.username || "Unknown"}
                </Link>
                <span className="text-sm text-accent">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {isAuthor && (
              <div ref={dropdownRef} className="relative inline-block">
                <button className="text-xl p-1 hover:bg-accent/20 rounded-full" onClick={() => setDropdownOpen((prev) => !prev)}>
                  ⋮
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-28 bg-surface border border-accent/30 rounded-md shadow-lg z-50 flex flex-col">
                    <button className="px-4 py-2 text-left hover:bg-accent/20" onClick={() => setDropdownOpen(false)}>
                      Edit
                    </button>
                    <button className="px-4 py-2 text-left hover:bg-red-500 hover:text-white" onClick={() => { setDropdownOpen(false); onDelete(); }}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-secondary whitespace-pre-wrap">{post.content}</p>

          <div className="flex gap-4 items-center text-sm text-accent">
            <button onClick={() => onLike(post.id)} className="flex items-center gap-1 hover:text-primary">👍 {post.likeCount || 0}</button>
            <button onClick={() => onDislike(post.id)} className="flex items-center gap-1 hover:text-red-500">👎 {post.dislikeCount || 0}</button>
          </div>
        </>
      )}
    </article>
  );
}
