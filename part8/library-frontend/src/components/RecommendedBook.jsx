import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ME } from "../queries";

const RecommendedBook = ({ show }) => {
    const userResult = useQuery(ME);

    const booksResult = useQuery(ALL_BOOKS, {
        skip: !userResult.data,
        variables: {
            genre: userResult.data?.me?.favoriteGenre,
        },
    });

    if (!show) return null;

    if (userResult.loading || booksResult.loading) {
        return <div>loading...</div>;
    }

    const favoriteGenre = userResult.data.me.favoriteGenre;
    const books = booksResult.data.allBooks;

    return (
        <div>
            <h2>recommendations</h2>

            <p>
                books in your favorite genre <strong>{favoriteGenre}</strong>
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
        </div>
    );
};

export default RecommendedBook;
