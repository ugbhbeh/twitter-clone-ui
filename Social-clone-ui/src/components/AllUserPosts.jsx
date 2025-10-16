import PostCard from "./PostCard";

export default function UserPosts({ posts, onLike, onDislike }) {
  if (!posts || posts.length === 0) {
    return <div className="text-accent text-center py-4">No posts yet</div>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onDislike={onDislike}
        />
      ))}
    </div>
  );
}
