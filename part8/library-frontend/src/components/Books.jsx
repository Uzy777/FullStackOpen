import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = ({ show }) => {
    const [genre, setGenre] = useState(null);

    // filtered books (table)
    const booksResult = useQuery(ALL_BOOKS, {
        variables: { genre },
    });

    // unfiltered books (genre buttons)
    const genresResult = useQuery(ALL_BOOKS);

    if (!show) return null;
    if (booksResult.loading || genresResult.loading) {
        return <div>loading...</div>;
    }
    if (booksResult.error) {
        return <div style={{ color: "red" }}>{booksResult.error.message}</div>;
    }

    const books = booksResult.data.allBooks;
    const allGenres = Array.from(new Set(genresResult.data.allBooks.flatMap((b) => b.genres)));

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
                    {books.map((b) => (
                        <tr key={b.title}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
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
