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
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const likeCount = comment._count?.likes ?? 0;
  const dislikeCount = comment._count?.dislikes ?? 0;
  const { userId } = useContext(AuthContext);

  const isAuthor = userId === comment.author?.id;

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
        <div className="flex flex-col flex-1">
          <div className="flex items-center space-x-2">
            <Link
              to={`/profile/${comment.author?.id}`}
              className="font-medium text-secondary hover:text-primary"
            >
              {comment.author?.username || "Unknown"}
            </Link>
            <span>· {new Date(comment.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Dropdown for author actions */}
        {isAuthor && (
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="btn btn-xs btn-ghost ml-auto"
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
              className="btn btn-xs btn-outline btn-primary"
            >
              👍 {likeCount}
            </button>
            <button
              onClick={() => onDislike?.(comment.id)}
              className="btn btn-xs btn-outline btn-secondary"
            >
              👎 {dislikeCount}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
