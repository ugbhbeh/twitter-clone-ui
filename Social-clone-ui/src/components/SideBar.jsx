import MostFollowedUsers from "./PopularUsersPreview";
import MostPopularPosts from "./PopularPostsPreview"

export default  function SideBar() {
    return (
    <aside>
        <MostFollowedUsers/>
      <MostPopularPosts />
    </aside>
  );
    
}