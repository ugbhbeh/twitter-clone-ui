/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";


export default function Profile(){
    const {username} = useParams();
    const [profile, setProfile] = useState(null);
    const [bioEditing, setBioEditing] = useState(false);
    const [bioInput, setBioInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    async function fetchProfile() {
        setLoading(true);
        try {
            const res = await api.get(`/users/${username}/profile`);
            setProfile(res.data);
            console.log(res.data)
            setBioInput(res.data.bio || '');
        } catch (error) {
            setError('Failed to load profile')
        } finally {
            setLoading(false)
        }    
    }

async function handleFollow() {
    try {
        await api.post(`users/${username}/follow`);
        await fetchProfile()
    } catch {
        alert('Follow failed')
    }
}

async function handleUnFollow() {
    try {
        await api.post(`users/${username}/unfollow`);
        await fetchProfile()
    } catch {
        alert('Unfollow failed')
    }
}

async function handleBioUpdate() {
    try {
        api.patch(`/users/me/bio`, {bio: bioInput});
        setBioEditing(false);
        await fetchProfile()
    } catch {
        alert("Failed to update bio")
    }   
}

if (loading) return <div>Loading ...</div>
if (error) return <div>{error}</div>
if (!profile) return <div>No data</div>

const isOwnProfile = profile.id === JSON.parse(localStorage.getItem('user'))?.id;

return (
    <div>
        <h1>{profile.username}'s Profile'</h1>

        <div>
            <img src={profile.profileImage} alt="profile" width={100} height={100}/>
        </div>

        <div>
            <strong>Bio:</strong>
            {bioEditing ? (
                <div>
                    <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value)} />
                    <button onClick={handleBioUpdate}>Save</button>
                    <button onClick={() => setBioEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p>{profile.bio || 'write your bio'}</p>
                    {isOwnProfile && <button onClick={() => setBioEditing(true)}>Edit bio</button>}
                </div>
            )}
        </div>
        <div>
            <p>Followers: {profile.followerCount}</p>
            <p>Following: {profile.followingCount}</p>
        </div>

        {!isOwnProfile && (profile.isFollowing? (
                <button onClick={handleUnFollow}>Unfollow</button>
            ) : (
                <button onClick={handleFollow}>Follow</button>
            )
        )}

      <hr />
      {profile.posts.map(post => (
      <PostCard
        key={post.id}
        post={post}
    />
))}








    </div>

);






}