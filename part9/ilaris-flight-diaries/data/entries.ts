import { DiaryEntry } from "../src/types";
import toNewDiaryEntry from "../src/utils";

const data = [
    {
        id: 1,
        date: "2017-01-01",
        weather: "rainy",
        visibility: "poor",
        comment: "Pretty scary flight, I'm glad I'm alive",
    },
];

const diaryEntries: DiaryEntry[] = data.map((obj) => {
    const object = toNewDiaryEntry(obj) as DiaryEntry;
    object.id = obj.id;
    return object;
});

export default diaryEntries;
