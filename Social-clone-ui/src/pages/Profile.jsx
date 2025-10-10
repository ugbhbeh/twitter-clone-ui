
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";

export default function Profile(){
    const {userId} = useParams();
    const [profile, setProfile] = useState(null);
    const [bioEditing, setBioEditing] = useState(false);
    const [bioInput, setBioInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    async function fetchProfile() {
        setLoading(true);
        try {
            const res = await api.get(`/users/${userId}/profile`);
            setProfile(res.data);
            setBioInput(res.data.bio || '');
        } catch (error) {
            setError(error,'Failed to load profile')
        } finally {
            setLoading(false)
        }    
    }

async function handleFollow() {
    try {
        await api.post(`/users/${userId}/follow`);
        await fetchProfile()
    } catch {
        alert('Follow failed')
    }
}

async function handleUnFollow() {
    try {
        await api.delete(`/users/${userId}/unfollow`);
        await fetchProfile()
    } catch {
        alert('Unfollow failed')
    }
}

async function handleBioUpdate() {
    try {
        await api.patch(`/users/me/bio`, {bio: bioInput});
        setBioEditing(false);
        await fetchProfile()
    } catch {
        alert("Failed to update bio")
    }   
}

const handleLike = async (postId) => {
  try {
    await api.post(`/posts/${postId}/like`);
    await fetchProfile();  
  } catch (err) {
    console.error("Failed to like post", err);
  }
};

const handleDislike = async (postId) => {
  try {
    await api.post(`/posts/${postId}/dislike`);
    await fetchProfile();  
  } catch (err) {
    console.log("Failed to dislike post", err);
  }
};

if (loading) return <div className="flex justify-center items-center min-h-[40vh] text-accent">Loading ...</div>;
if (error) return <div className="text-red-600 text-center py-4">{error}</div>;
if (!profile) return <div className="text-accent text-center py-4">No data</div>;

const isOwnProfile = profile.id === localStorage.getItem('userId');

return (
  <div className="max-w-3xl mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
      <img src={profile.profileImage || '/default-profile.png'} alt="profile" className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow" />
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-primary mb-2">{profile.username}</h1>
        <div className="flex gap-4 text-accent mb-2">
          <span>Followers: <span className="font-semibold text-secondary">{profile.followerCount}</span></span>
          <span>Following: <span className="font-semibold text-secondary">{profile.followingCount}</span></span>
        </div>
        {!isOwnProfile && (
          profile.isFollowing ? (
            <button onClick={handleUnFollow} className="btn btn-outline btn-secondary font-semibold px-6 py-2 mt-2">Unfollow</button>
          ) : (
            <button onClick={handleFollow} className="btn btn-primary font-semibold px-6 py-2 mt-2">Follow</button>
          )
        )}
      </div>
    </div>

    <div className="mb-8">
      <h2 className="text-xl font-semibold text-secondary mb-2">Bio</h2>
      {bioEditing ? (
        <div className="space-y-2">
          <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value)} className="input-social bg-surface text-secondary border border-accent/30 focus:border-primary placeholder:text-accent min-h-[60px] resize-none w-full" />
          <div className="flex gap-2">
            <button onClick={handleBioUpdate} className="btn btn-primary btn-sm">Save</button>
            <button onClick={() => setBioEditing(false)} className="btn btn-outline btn-secondary btn-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-accent">{profile.bio || 'Write your bio'}</p>
          {isOwnProfile && <button onClick={() => setBioEditing(true)} className="btn btn-outline btn-primary btn-xs">Edit bio</button>}
        </div>
      )}
    </div>

    <hr className="my-8 border-accent/20" />
    <h2 className="text-xl font-semibold text-primary mb-4">Posts</h2>
    <div className="space-y-6">
      {profile.posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      ))}
    </div>
  </div>
);






}