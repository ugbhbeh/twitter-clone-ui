import { Link } from "react-router-dom";

export default function SidebarPostCard({ post }) {
  const contentPreview =
    post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content;

  return (
    <div className="card-social p-4 mb-3 bg-surface rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-2 mb-2 text-sm text-accent">
        <img
          src={post.author?.profileImage || "/default-profile.png"}
          alt={post.author?.username || "Unknown"}
          className="w-8 h-8 rounded-full object-cover border border-accent/20"
        />
        <span>By</span>
        <Link
          to={`/profile/${post.author?.id}`}
          className="font-medium text-secondary hover:text-primary"
        >
          {post.author?.username || "Unknown"}
        </Link>
        <span>· {new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <Link to={`/posts/${post.id}`} className="block group">
        <p className="text-secondary group-hover:text-primary/90 transition-colors">
          {contentPreview}
        </p>
      </Link>
    </div>
  );
}
