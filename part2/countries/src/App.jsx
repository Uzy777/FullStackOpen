import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [value, setValue] = useState("");
    const [allCountries, setAllCountries] = useState([]);
    const [country, setCountry] = useState(null);
    const [updateMessage, setUpdateMessage] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);

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
                {selectedCountry ? (
                    // Show details for a manually selected country
                    <div>
                        <h1>{selectedCountry.name.common}</h1>
                        <p>Capital: {selectedCountry.capital}</p>
                        <p>Area: {selectedCountry.area}</p>
                        <br />
                        <h2>Languages</h2>
                        <ul>
                            {Object.values(selectedCountry.languages).map((lang) => (
                                <li key={lang}>{lang}</li>
                            ))}
                        </ul>
                        <img src={selectedCountry.flags.png} alt={selectedCountry.flags.alt} />
                    </div>
                ) : filtered.length > 10 ? (
                    <p>Too many matches, specify another filter</p>
                ) : filtered.length === 1 ? (
                    // Show details for a single match
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
                ) : filtered.length > 1 ? (
                    // Show list of countries with "Show" buttons
                    <div>
                        {filtered.map((country) => (
                            <p key={country.cca3}>
                                {country.name.common} <button onClick={() => setSelectedCountry(country)}>Show</button>
                            </p>
                        ))}
                    </div>
                ) : null}
            </form>
        </div>
    );
};

export default App;
