import MostFollowedUsers from "./PopularUsersPreview";
import MostPopularPosts from "./PopularPostsPreview"

export default  function SideBar() {
    return (
      <aside className="sticky top-24 h-[calc(100vh-6rem)] w-80 min-w-[260px] max-w-xs bg-surface rounded-xl shadow-lg p-4 flex flex-col gap-6 overflow-y-auto border border-accent/10">
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Most Followed Users</h3>
          <MostFollowedUsers/>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Popular Posts</h3>
          <MostPopularPosts />
        </div>
      </aside>
    );
    
}