import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, handleDelete, handleLike }) => {
    const [visible, setVisible] = useState(false);
    const [likes, setLikes] = useState(blog.likes);

    const isOwner = blog.user?.username === user?.username;

    const toggleVisibility = () => setVisible(!visible);

    const handleLikeClick = async () => {
        if (handleLike) {
            handleLike(blog);
        }

        // Increase likes in UI immediately
        const newLikes = likes + 1;
        setLikes(newLikes);

        try {
            const updatedBlog = {
                user: blog.user ? blog.user.id : null,
                likes: newLikes,
                author: blog.author,
                title: blog.title,
                url: blog.url,
            };

            await blogService.update(blog.id, updatedBlog);
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    };

    return (
        <div style={{ paddingTop: 10, paddingLeft: 2, border: "solid", borderWidth: 1, marginBottom: 5 }}>
            <div>
                {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
            </div>

            {visible && (
                <div>
                    <div>{blog.url}</div>
                    <div>
                        likes {likes} <button onClick={handleLikeClick}>like</button>
                    </div>
                    <div>{blog.user?.name || "Unknown user"}</div>

                    {isOwner && (
                        <button style={{ backgroundColor: "red" }} onClick={() => handleDelete(blog)}>
                            remove
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Blog;
