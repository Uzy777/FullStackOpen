import { useState } from "react";

const Blog = ({ blog }) => {
    // Step 1: local state to track visibility
    const [visible, setVisible] = useState(false);

    // Step 2: function to toggle visibility
    const toggleVisibility = () => setVisible(!visible);

    // Step 3: basic inline style
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    };

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
            </div>

            {visible && (
                <div>
                    <div>{blog.url}</div>
                    <div>
                        likes {blog.likes} <button>like</button>
                    </div>
                    <div>{blog.author}</div>
                </div>
            )}
        </div>
    );
};

export default Blog;
