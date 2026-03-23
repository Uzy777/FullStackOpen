import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "http://localhost:3001/api/diaries";

const getAll = async (): Promise<DiaryEntry[]> => {
    const response = await axios.get<DiaryEntry[]>(baseUrl);
    return response.data;
};

const create = async (newDiary: NewDiaryEntry): Promise<DiaryEntry> => {
    const response = await axios.post<DiaryEntry>(baseUrl, newDiary);
    return response.data;
};

export default {
    getAll,
    create,
};
