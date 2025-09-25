import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [country, setCountry] = useState(null);

    useEffect(() => {
        console.log("run this now");

        if (country) {
            console.log("Country found fetch results...");
            axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`).then((response) => {
                console.log("found");
            });
        }

        else {
          console.log("not found")
        }
    }, [country]);

    return (
        <>
            <label>Find Countries: </label>
            <input type="text" />
            <p>Too many matches, specify antoher filter</p>
        </>
    );
};

export default App;
