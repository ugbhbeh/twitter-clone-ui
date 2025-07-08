import { useState } from "react";

export default function CommentCard({comment, onLike, onDislike, onEdit, onDelete}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const likeCount = comment._count?.likes ?? 0;
    const dislikeCount = comment._count?.dislikes ?? 0;
    
    return (
        <div>
            <div>
                <span>{comment.author?.username || "Unknown"}</span> •{" "}
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
                {dropdownOpen && (
                    <div>
                        <button onClick={() => { setDropdownOpen(false); onEdit(comment.id); }}> Edit </button>
                        <button onClick={() => { setDropdownOpen(false); onDelete(comment.id); }}> Delete </button>
                    </div>
                )}
            </div>
             <p>{comment.content}</p>
            <div>
                <button onClick={() => onLike?.(comment.id)}> 👍 {likeCount} </button>
                <button onClick={() => onDislike?.(comment.id)}> 👍 {dislikeCount}  </button>
             </div>        
        </div>
)
    
}

