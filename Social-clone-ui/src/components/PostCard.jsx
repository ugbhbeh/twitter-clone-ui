import { Link } from "react-router-dom";

export default function PostCard({ post, onLike, onDislike }) {
  const likeCount = post._count?.likes ?? 0;
  const dislikeCount = post._count?.dislikes ?? 0;

  return (
    <article className="card-social p-6 mb-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
          {post.author?.username?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1">
          <Link 
            to={`/profile/${post.author?.id}`}
            className="font-medium text-secondary hover:text-primary"
          >
            {post.author?.username || "Unknown"}
          </Link>
          <p className="text-sm text-accent">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      
      <Link to={`/posts/${post.id}`} className="block group">
        <p className="text-secondary group-hover:text-primary/90 transition-colors">
          {post.content}
        </p>
      </Link>

      <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-accent/10">
        <button 
          onClick={() => onLike?.(post.id)}
          className="flex items-center space-x-2 text-accent hover:text-primary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span>{likeCount}</span>
        </button>
        <button 
          onClick={() => onDislike?.(post.id)}
          className="flex items-center space-x-2 text-accent hover:text-primary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
          </svg>
          <span>{dislikeCount}</span>
        </button>
      </div>
    </article>
  );
}
