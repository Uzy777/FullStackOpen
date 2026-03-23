import { useEffect, useState } from "react";
import diaryService from "./services/diaries";
import type { DiaryEntry, NewDiaryEntry } from "./types";

const App = () => {
    const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
    const [date, setDate] = useState("");
    const [visibility, setVisibility] = useState("");
    const [weather, setWeather] = useState("");
    const [comment, setComment] = useState("");

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

        const newDiary: NewDiaryEntry = {
            date,
            visibility,
            weather,
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
            })
            .catch((error) => {
                console.error("Failed to create diary:", error);
            });
    };

    return (
        <div>
            <h1>Add new entry</h1>

            <form onSubmit={diaryCreation}>
                <div>
                    date
                    <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                </div>

                <div>
                    visibility
                    <input value={visibility} onChange={(event) => setVisibility(event.target.value)} />
                </div>

                <div>
                    weather
                    <input value={weather} onChange={(event) => setWeather(event.target.value)} />
                </div>

                <div>
                    comment
                    <input value={comment} onChange={(event) => setComment(event.target.value)} />
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
