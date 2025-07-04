import TopBar from '../components/TopBar';
import PostFeed from '../components/PostFeed';
import CreatePost from '../components/CreatePost';
import SideBar from '../components/SideBar'

function Home() {
return (
    <div className='app-layout'>
        <TopBar/>

        <div className='main-content'>
            <SideBar/>

            <div className='feed'>
                <CreatePost/>
                 <PostFeed/>
                 
                </div>
            </div>
        </div>
)
}

export default Home;