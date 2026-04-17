import PostFeed from '../components/PostFeed';
import CreatePost from '../components/CreatePost';
import SideBar from '../components/SideBar'

function Home() {
  return (
    <div className="flex gap-8 max-w-7xl mx-auto px-4 py-8">
      <div className="flex-1 min-w-0 ">
        <CreatePost />
        <br />
        <PostFeed />
      </div>
      <SideBar />
    </div>
  );
}

export default Home;