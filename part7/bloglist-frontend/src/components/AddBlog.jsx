const AddBlog = ({ addBlog, title, author, url, handleTitleChange, handleAuthorChange, handleUrlChange }) => {
    return (
        <form onSubmit={addBlog}>
            <div>
                <label>
                    title:
                    <input placeholder="title" value={title} onChange={handleTitleChange} />
                </label>
            </div>
            <div>
                <label>
                    author:
                    <input placeholder="author" value={author} onChange={handleAuthorChange} />
                </label>
            </div>
            <div>
                <label>
                    url:
                    <input placeholder="url" value={url} onChange={handleUrlChange} />
                </label>
            </div>
            <button type="submit">create</button>
        </form>
    );
};

export default AddBlog;
