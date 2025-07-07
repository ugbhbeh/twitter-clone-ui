import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function PostView() {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [error, setError] = useState("");

    const fetchPostWithComments = async () => {
        try {
            const res = await api.get(`/posts/${postId}`);
            setPost(res.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.error || "Error loading page");
        }
    };

    useEffect(() => {
        fetchPostWithComments();
    }, [postId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/comments/${postId}`) {
                content: newComment,
            };
            setNewComment("");
            fetchPostWithComments();
        } catch (err) {
            setError(err.response?.data?.error || "Error adding comment")
        }
    };

    const handleEditComment = async (commentId, new content) => {
        try {
            await api.put(`/comments/${commentId}`, {content: newContent});
            setEditingComment(null);
            fetchPostWithComments();
        } catch (err) {
            setError(err.response?.data?.error || "Error updating comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if(window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await api.delete(`/comment/${commentId}`);
                fetchPostWithComments();
            } catch (err) {
                setError(err.response?.data.error || "Error deleting comment");
            }
        }
    };

    if(!post) return <div>Loading ...</div>
}