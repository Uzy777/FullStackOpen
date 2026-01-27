import { useQuery } from "@apollo/client/react";
import { ALL_AUTHORS } from "../queries";
import { EDIT_BORN } from "../queries";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

const Authors = ({ show }) => {
    const [name, setName] = useState("");
    const [born, setBorn] = useState("");

    const result = useQuery(ALL_AUTHORS);
    const [editAuthor] = useMutation(EDIT_BORN, {
        refetchQueries: [{ query: ALL_AUTHORS }],
    });

    if (!show) {
        return null;
    }

    if (result.loading) {
        return <div>loading...</div>;
    }

    const authors = result.data.allAuthors;

    const handleSubmit = async (e) => {
        e.preventDefault();

        await editAuthor({
            variables: {
                name,
                setBornTo: Number(born),
            },
        });

        setName("");
        setBorn("");
    };

    return (
        <div>
            <h2>authors</h2>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>

                    {authors.map((a) => (
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born ?? "—"}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <form onSubmit={handleSubmit}>
                <h3>Set birthyear</h3>
                <div>
                    <label>name: </label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                </div>

                <div>
                    <label>born: </label>
                    <input type="number" value={born} onChange={(e) => setBorn(e.target.value)}></input>
                </div>
                <button>update author</button>
            </form>
        </div>
    );
};

export default Authors;
