import MostFollowedUsers from "./MostFollowedUsers";
import MostPopularPosts from "./MostPopularPosts"

export default  function SideBar() {
    return (
    <aside>
        <MostFollowedUsers/>
      <MostPopularPosts />
    </aside>
  );
    
}