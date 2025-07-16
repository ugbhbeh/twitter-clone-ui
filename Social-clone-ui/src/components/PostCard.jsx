import { Link } from "react-router-dom";

export default function PostCard({ post, onLike, onDislike }) {
  const likeCount = post._count?.likes ?? 0;
  const dislikeCount = post._count?.dislikes ?? 0;

  return (
    <div>
      <div>
        By{" "}
        <Link to={`/profile/${post.author?.id}`}>
          {post.author?.username || "Unknown"}
        </Link>{" "}
        · {new Date(post.createdAt).toLocaleString()}
      </div>
      <Link to={`/posts/${post.id}`}>
        <p>{post.content}</p>
      </Link>

      <div>
        <button onClick={() => onLike?.(post.id)}>👍 {likeCount}</button>
        <button onClick={() => onDislike?.(post.id)}>👎 {dislikeCount}</button>
      </div>
    </div>
  );
}
