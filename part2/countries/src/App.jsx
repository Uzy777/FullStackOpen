import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [value, setValue] = useState("");
    const [allCountries, setAllCountries] = useState([]);
    const [country, setCountry] = useState(null);
    const [updateMessage, setUpdateMessage] = useState("");

    useEffect(() => {
        axios.get("https://studies.cs.helsinki.fi/restcountries/api/all").then((response) => setAllCountries(response.data));
    }, []);

    //     axios
    //         .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
    //         .then((response) => {
    //             console.log(response.data);
    //             console.log("found");
    //         })
    //         .catch((error) => {
    //             console.log("no matches found");
    //             setUpdateMessage("Too many matches, specify another filter")
    //         });
    // }, [country]);

    const filtered = allCountries.filter((country) => country.name.common.toLowerCase().includes(value.toLowerCase()));

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const onSearch = (event) => {
        event.preventDefault();
        setCountry(value);
    };

    return (
        <div>
            <form onSubmit={onSearch}>
                Find Countries: <input value={value} onChange={handleChange} />
                {/* <button type="submit">Submit</button> */}
                {filtered.length > 10 && <p>Too many matches, specify antoher filter</p>}
                {filtered.length > 0 && filtered.length <= 10 && (
                    <ul>
                        {filtered.map((country) => (
                            <li key={country.cca3}>{country.name.common}</li>
                        ))}
                    </ul>
                )}{" "}
                {filtered.length === 1 && (
                    <div>
                        <h1>{filtered[0].name.common}</h1>
                        <p>Capital: {filtered[0].capital}</p>
                        <p>Area: {filtered[0].area}</p>
                        <br />
                        <h2>Languages</h2>
                        <ul>
                            {Object.values(filtered[0].languages).map((lang) => (
                                <li key={lang}>{lang}</li>
                            ))}
                        </ul>
                        <img src={filtered[0].flags.png} alt={filtered[0].flags.alt} />
                    </div>
                )}
            </form>

            {/* <label>Find Countries: </label>
            <input type="text" />
            <p>Too many matches, specify antoher filter</p> */}
        </div>
    );
};

export default App;
