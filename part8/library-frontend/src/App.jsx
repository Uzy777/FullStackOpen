import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import RecommendedBook from "./components/RecommendedBook";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client/react";
import { BOOK_ADDED } from "./queries";

const App = () => {
    const [page, setPage] = useState("authors");
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("library-user-token");
        if (token) {
            setToken(token);
        }
    }, []);

    const logout = () => {
        setToken(null);
        localStorage.clear();
        setPage("authors");
    };

    useSubscription(BOOK_ADDED, {
        onData: ({ data }) => {
            const addedBook = data.data.bookAdded;
            window.alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`);
        },
    });

    return (
        <div>
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={() => setPage("authors")}>authors</button>
                <button onClick={() => setPage("books")}>books</button>

                {token ? (
                    <>
                        <button onClick={() => setPage("add")}>add book</button>
                        <button onClick={() => setPage("recommended")}>recommended</button>
                        <button onClick={logout}>logout</button>
                    </>
                ) : (
                    <button onClick={() => setPage("login")}>login</button>
                )}
            </div>

            <Authors show={page === "authors"} />
            <Books show={page === "books"} />
            <NewBook show={page === "add"} />
            <RecommendedBook show={page === "recommended"} />

            <LoginForm show={page === "login"} setToken={setToken} setPage={setPage} />
        </div>
    );
};

export default App;
