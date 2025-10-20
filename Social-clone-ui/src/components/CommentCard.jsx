import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../services/AuthContext";

export default function CommentCard({
  comment,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onEdit,
  onDelete,
  onLike,
  onDislike,
  toggleFollow,       // NEW: function to toggle follow
  isFollowing,        // NEW: boolean to indicate follow status
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const likeCount = comment._count?.likes ?? 0;
  const dislikeCount = comment._count?.dislikes ?? 0;
  const { userId } = useContext(AuthContext);

  const isAuthor = userId === comment.author?.id;
  const isOwnComment = userId === comment.author?.id;

  return (
    <div className="card-social p-4 mb-3 bg-surface rounded-lg shadow hover:shadow-md transition-shadow relative">
      <div className="flex items-center space-x-3 mb-2 text-sm text-accent">
        {/* Profile Image */}
        <Link to={`/profile/${comment.author?.id}`}>
          <img
            src={comment.author?.profileImage || "/images/default-avatar.png"}
            alt={comment.author?.username || "User"}
            className="w-8 h-8 rounded-full object-cover border border-accent/20"
          />
        </Link>

        {/* Author Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Link
              to={`/profile/${comment.author?.id}`}
              className="font-medium text-secondary hover:text-primary truncate"
            >
              {comment.author?.username || "Unknown"}
            </Link>
            <span>· {new Date(comment.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Follow/Unfollow Button */}
        {!isOwnComment && toggleFollow && (
          <button
            onClick={() => toggleFollow(comment.author.id)}
            className={`text-sm px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              isFollowing
                ? "bg-gray-200 text-secondary hover:bg-gray-300"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}

        {/* Dropdown for author actions */}
        {isAuthor && (
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="btn btn-xs btn-ghost ml-2"
          >
            ⋮
          </button>
        )}
        {dropdownOpen && isAuthor && (
          <div className="absolute top-8 right-2 bg-surface border border-accent/20 rounded shadow-lg z-10 flex flex-col">
            <button
              onClick={() => {
                setDropdownOpen(false);
                onStartEdit();
              }}
              className="btn btn-sm btn-outline btn-primary"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false);
                onDelete();
              }}
              className="btn btn-sm btn-outline btn-error"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onEdit(editContent);
          }}
          className="space-y-2"
        >
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows="2"
            required
            className="input-social bg-surface text-secondary border border-accent/30 focus:border-primary placeholder:text-accent min-h-[60px] resize-none"
          />
          <div className="flex space-x-2">
            <button type="submit" className="btn btn-primary btn-sm">
              Save
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="btn btn-outline btn-secondary btn-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="text-secondary mb-2">{comment.content}</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onLike?.(comment.id)}
              className="flex items-center space-x-2 text-accent hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>{likeCount}</span>
            </button>

            <button
              onClick={() => onDislike?.(comment.id)}
              className="flex items-center space-x-2 text-accent hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              <span>{dislikeCount}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
