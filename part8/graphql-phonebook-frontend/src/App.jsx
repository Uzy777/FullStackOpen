import { useApolloClient, useQuery } from "@apollo/client/react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import { ALL_PERSONS } from "./queries";
import Notify from "./components/Notify";
import { useState } from "react";
import PhoneForm from "./components/PhoneForm";
import LoginForm from "./components/LoginForm";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("phonebook-user-token"));
    const [errorMessage, setErrorMessage] = useState(null);

    const result = useQuery(ALL_PERSONS);

    if (result.loading) {
        return <div>loading...</div>;
    }

    const onLogout = () => {
        setToken(null);
        localStorage.clear();
        client.resetStore();
    };

    const notify = (message) => {
        setErrorMessage(message);
        setTimeout(() => {
            setErrorMessage(null);
        }, 10000);
    };

    if (!token) {
        return (
            <div>
                <Notify errorMessage={errorMessage} />
                <h2>Login</h2>
                <LoginForm setToken={setToken} setError={notify} />
            </div>
        );
    }

    return (
        <div>
            <Notify errorMessage={errorMessage} />
            <button onClick={onLogout}>logout</button>
            <Persons persons={result.data.allPersons} />
            <PersonForm setError={notify} />
            <PhoneForm setError={notify} />
        </div>
    );
};

export default App;
