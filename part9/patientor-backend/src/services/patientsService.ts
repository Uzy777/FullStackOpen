import patients from "../data/patients";
import { NonSensitivePatient, NewPatient, Patient } from "../types";
import { v1 as uuid } from "uuid";

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

export default {
    getNonSensitivePatients,
    getPatientById,
    addPatient,
};
