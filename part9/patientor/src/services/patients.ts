import axios from "axios";
import { Patient, PatientFormValues, NonSensitivePatient } from "../types";

const baseUrl = "http://localhost:3001/api/patients";

const getAll = async () => {
    const { data } = await axios.get<NonSensitivePatient[]>(baseUrl);
    return data;
};

const create = async (object: PatientFormValues) => {
    const { data } = await axios.post<Patient>(baseUrl, object);
    return data;
};

const getById = async (id: string) => {
    const { data } = await axios.get<Patient>(`${baseUrl}/${id}`);
    return data;
};

export default {
    getAll,
    create,
    getById,
};
