import { Form, Button } from "react-bootstrap";

const AddBlog = ({ addBlog, title, author, url, handleTitleChange, handleAuthorChange, handleUrlChange }) => {
    return (
        <Form onSubmit={addBlog}>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control placeholder="title" value={title} onChange={handleTitleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control placeholder="author" value={author} onChange={handleAuthorChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>URL</Form.Label>
                <Form.Control placeholder="url" value={url} onChange={handleUrlChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
                Create
            </Button>
        </Form>
    );
};

export default AddBlog;
