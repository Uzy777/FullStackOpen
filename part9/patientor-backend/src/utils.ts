import { NewPatient } from "./types";

export const toNewPatient = (object: unknown): NewPatient => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }

    if ("name" in object && "dateOfBirth" in object && "ssn" in object && "gender" in object && "occupation" in object) {
        const newPatient: NewPatient = {
            name: String(object.name),
            dateOfBirth: String(object.dateOfBirth),
            ssn: String(object.ssn),
            gender: String(object.gender),
            occupation: String(object.occupation),
        };

        return newPatient;
    }

    throw new Error("Incorrect data: fields missing");
};
