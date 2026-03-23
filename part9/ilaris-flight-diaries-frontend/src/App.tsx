import axios from "axios";
import { useEffect, useState } from "react";
import diaryService from "./services/diaries";
import type { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";

const App = () => {
    const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
    const [date, setDate] = useState("");
    const [visibility, setVisibility] = useState<Visibility | "">("");
    const [weather, setWeather] = useState<Weather | "">("");
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        diaryService
            .getAll()
            .then((data) => {
                setDiaries(data);
            })
            .catch((error) => {
                console.error("Failed to fetch diaries:", error);
            });
    }, []);

    const diaryCreation = (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (!date || !weather || !visibility || !comment) {
            setErrorMessage("All fields are required");
            return;
        }

        const newDiary: NewDiaryEntry = {
            date,
            weather,
            visibility,
            comment,
        };

        diaryService
            .create(newDiary)
            .then((createdDiary) => {
                setDiaries(diaries.concat(createdDiary));
                setDate("");
                setVisibility("");
                setWeather("");
                setComment("");
                setErrorMessage("");
            })
            .catch((error: unknown) => {
                if (axios.isAxiosError(error)) {
                    if (typeof error.response?.data === "string") {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage("Failed to create diary entry");
                    }
                } else {
                    setErrorMessage("Unknown error");
                }
            });
    };

    return (
        <div>
            <h1>Add new entry</h1>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <form onSubmit={diaryCreation}>
                <div>
                    date
                    <input type="date" value={date} onChange={({ target }) => setDate(target.value)} />
                </div>

                <div>
                    visibility:
                    <label>
                        great
                        <input
                            type="radio"
                            name="visibility"
                            value="great"
                            checked={visibility === "great"}
                            onChange={({ target }) => setVisibility(target.value as Visibility)}
                        />
                    </label>
                    <label>
                        good
                        <input
                            type="radio"
                            name="visibility"
                            value="good"
                            checked={visibility === "good"}
                            onChange={({ target }) => setVisibility(target.value as Visibility)}
                        />
                    </label>
                    <label>
                        ok
                        <input
                            type="radio"
                            name="visibility"
                            value="ok"
                            checked={visibility === "ok"}
                            onChange={({ target }) => setVisibility(target.value as Visibility)}
                        />
                    </label>
                    <label>
                        poor
                        <input
                            type="radio"
                            name="visibility"
                            value="poor"
                            checked={visibility === "poor"}
                            onChange={({ target }) => setVisibility(target.value as Visibility)}
                        />
                    </label>
                </div>

                <div>
                    weather:
                    <label>
                        sunny
                        <input
                            type="radio"
                            name="weather"
                            value="sunny"
                            checked={weather === "sunny"}
                            onChange={({ target }) => setWeather(target.value as Weather)}
                        />
                    </label>
                    <label>
                        rainy
                        <input
                            type="radio"
                            name="weather"
                            value="rainy"
                            checked={weather === "rainy"}
                            onChange={({ target }) => setWeather(target.value as Weather)}
                        />
                    </label>
                    <label>
                        cloudy
                        <input
                            type="radio"
                            name="weather"
                            value="cloudy"
                            checked={weather === "cloudy"}
                            onChange={({ target }) => setWeather(target.value as Weather)}
                        />
                    </label>
                    <label>
                        stormy
                        <input
                            type="radio"
                            name="weather"
                            value="stormy"
                            checked={weather === "stormy"}
                            onChange={({ target }) => setWeather(target.value as Weather)}
                        />
                    </label>
                    <label>
                        windy
                        <input
                            type="radio"
                            name="weather"
                            value="windy"
                            checked={weather === "windy"}
                            onChange={({ target }) => setWeather(target.value as Weather)}
                        />
                    </label>
                </div>

                <div>
                    comment
                    <input value={comment} onChange={({ target }) => setComment(target.value)} />
                </div>

                <button type="submit">add</button>
            </form>

            <h1>Diary entries</h1>

            {diaries.map((diary) => (
                <div key={diary.id}>
                    <h2>{diary.date}</h2>
                    <p>visibility: {diary.visibility}</p>
                    <p>weather: {diary.weather}</p>
                </div>
            ))}
        </div>
    );
};

export default App;
