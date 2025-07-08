import { Link } from "react-router-dom";


export default function PostCard({post, onLike, onDislike}) {
    const likeCount = post._count?.likes ?? 0;
    const disLikeCount = post._count?.dislikes ?? 0;
    
    return (
        <div>
            <Link to={`/posts/${post.id}`}> 
            <p>
                By {post.author?.username} . {new Date(post.createdAt).toLocaleString()}
            </p>
            <p>{post.content}</p>
            </Link> 

         <div>
            <button onClick={() => onLike?.(post.id)}> 👍 {likeCount} </button>
            <button onClick={() => onDislike?.(post.id)}> 👍 {disLikeCount}  </button>
         </div>        
        </div>
)
    
}

