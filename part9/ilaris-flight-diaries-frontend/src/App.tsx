import { useEffect, useState } from "react";
import diaryService from "./services/diaries";
import type { DiaryEntry } from "./types";

const App = () => {
    const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

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

    return (
        <div>
            <h1>Flight diaries</h1>

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
