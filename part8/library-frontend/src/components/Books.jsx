import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

const Books = ({ show }) => {
    const { data, loading, error } = useQuery(ALL_BOOKS);

    if (loading) return <div>loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error.message}</div>;

    const books = data.allBooks;

    return (
        <div>
            <h2>books</h2>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books.map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Books;
