import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = ({ show }) => {
    const [genre, setGenre] = useState(null);
    const { data, loading, error } = useQuery(ALL_BOOKS);

    if (!show) return null;
    if (loading) return <div>loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error.message}</div>;

    const books = data.allBooks;

    const allGenres = Array.from(new Set(books.flatMap((b) => b.genres)));

    const booksToShow = genre ? books.filter((b) => b.genres.includes(genre)) : books;

    return (
        <div>
            <h2>books</h2>

            <p>
                in genre <strong>{genre ?? "all"}</strong>
            </p>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {booksToShow.map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                {allGenres.map((g) => (
                    <button key={g} onClick={() => setGenre(g)}>
                        {g}
                    </button>
                ))}
                <button onClick={() => setGenre(null)}>all genres</button>
            </div>
        </div>
    );
};

export default Books;
