import axios from "axios";
import { apiBaseUrl } from "../constants";
import type { Entry, EntryWithoutId, NonSensitivePatient, Patient, PatientFormValues } from "../types";

const baseUrl = `${apiBaseUrl}/patients`;

const getAll = async (): Promise<NonSensitivePatient[]> => {
    const { data } = await axios.get<NonSensitivePatient[]>(baseUrl);
    return data;
};

const getById = async (id: string): Promise<Patient> => {
    const { data } = await axios.get<Patient>(`${baseUrl}/${id}`);
    return data;
};

const create = async (object: PatientFormValues): Promise<Patient> => {
    const { data } = await axios.post<Patient>(baseUrl, object);
    return data;
};

const addEntry = async (patientId: string, entry: EntryWithoutId): Promise<Entry> => {
    const { data } = await axios.post<Entry>(`${baseUrl}/${patientId}/entries`, entry);
    return data;
};

export default {
    getAll,
    getById,
    create,
    addEntry,
};
