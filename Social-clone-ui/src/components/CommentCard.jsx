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
}) 

{
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const likeCount = comment._count?.likes ?? 0;
  const dislikeCount = comment._count?.dislikes ?? 0;
  const { userId } = useContext(AuthContext);

  const isAuthor = userId === comment.author?.id;

  return (
    <div>
      <div>
        <Link to={`/profile/${comment.author?.id}`}>
        <span>{comment.author?.username || "Unknown"}</span> •{" "}
        </Link>
        <small>{new Date(comment.createdAt).toLocaleString()}</small>
        {isAuthor && (
        <button onClick={() => setDropdownOpen((prev) => !prev)}>⋮</button>
        )}
        {dropdownOpen && isAuthor && (
     <div>
      <button onClick={() => { setDropdownOpen(false); onStartEdit(); }}>
      Edit
    </button>
    <button onClick={() => { setDropdownOpen(false); onDelete(); }}>
      Delete
    </button>
  </div>
)}
      </div>

      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onEdit(editContent);
          }}
        >
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows="2"
            required
          />
          <div>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p>{comment.content}</p>
          <div>
            <button onClick={() => onLike?.(comment.id)}>👍 {likeCount}</button>
            <button onClick={() => onDislike?.(comment.id)}>👎 {dislikeCount}</button>
          </div>
        </>
      )}
    </div>
  );
}