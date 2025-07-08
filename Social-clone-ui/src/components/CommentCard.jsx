import { useState } from "react";

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

  return (
    <div>
      <div>
        <span>{comment.author?.username || "Unknown"}</span> •{" "}
        <small>{new Date(comment.createdAt).toLocaleString()}</small>
        <button onClick={() => setDropdownOpen((prev) => !prev)}>⋮</button>
        {dropdownOpen && (
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