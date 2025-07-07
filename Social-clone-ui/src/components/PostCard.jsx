import { Link } from "react-router-dom";


export default function PostCard({post}) {
    return (
        <div>
            <Link to={`/posts/${post.id}`}> 
            <p>
                By {post.author?.username} . {new Date(post.createdAt).toLocaleString()}
            </p>
            <p>{post.content}</p>
            </Link>         
        </div>
)
    
}

