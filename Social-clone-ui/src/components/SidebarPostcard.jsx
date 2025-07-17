import { Link } from "react-router-dom";

export default function SidebarPostCard({ post }) {
      const contentPreview = post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content;

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
        <p>{contentPreview}</p>
      </Link>
    </div>
  );
}
