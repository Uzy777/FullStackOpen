import { NewDiaryEntry, Weather, Visibility } from "./types";

/* ---------------- TYPE GUARDS ---------------- */

const isString = (text: unknown): text is string => {
    return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const isWeather = (param: string): param is Weather => {
    return Object.values(Weather).includes(param as Weather);
};

const isVisibility = (param: string): param is Visibility => {
    return Object.values(Visibility).includes(param as Visibility);
};

/* ---------------- PARSERS ---------------- */

const parseComment = (comment: unknown): string => {
    if (!isString(comment)) {
        throw new Error("Incorrect or missing comment");
    }
    return comment;
};

const parseDate = (date: unknown): string => {
    if (!isString(date) || !isDate(date)) {
        throw new Error("Incorrect or missing date");
    }
    return date;
};

const parseWeather = (weather: unknown): Weather => {
    if (!isString(weather) || !isWeather(weather)) {
        throw new Error("Incorrect or missing weather");
    }
    return weather;
};

const parseVisibility = (visibility: unknown): Visibility => {
    if (!isString(visibility) || !isVisibility(visibility)) {
        throw new Error("Incorrect or missing visibility");
    }
    return visibility;
};

/* ---------------- MAIN FUNCTION ---------------- */

const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }

    const newObject = object as {
        date: unknown;
        weather: unknown;
        visibility: unknown;
        comment: unknown;
    };

    const newEntry: NewDiaryEntry = {
        date: parseDate(newObject.date),
        weather: parseWeather(newObject.weather),
        visibility: parseVisibility(newObject.visibility),
        comment: parseComment(newObject.comment),
    };

    return newEntry;
};

export default toNewDiaryEntry;
