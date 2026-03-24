import { v1 as uuid } from "uuid";
import patients from "../data/patients";
import { Entry, EntryWithoutId, NonSensitivePatient, NewPatient, Patient } from "../types";

const getNonSensitivePatients = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const getPatientById = (id: string): Patient | undefined => {
    return patients.find((patient) => patient.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
    const id = uuid();

    const newPatient = {
        id,
        ...entry,
    };

    patients.push(newPatient);
    return newPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
    const patient = patients.find((p) => p.id === patientId);

    if (!patient) {
        throw new Error("Patient not found");
    }

    const newEntry: Entry = {
        id: uuid(),
        ...entry,
    };

    patient.entries.push(newEntry);
    return newEntry;
};

export default {
    getNonSensitivePatients,
    getPatientById,
    addPatient,
    addEntry,
};
