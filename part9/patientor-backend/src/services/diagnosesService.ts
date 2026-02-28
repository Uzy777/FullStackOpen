import diagnoses from "../data/diagnoses";
import patients from "../data/patients";

import { Diagnosis } from "../types";
import { Patient } from "../types";

const getDiagnoses = (): Diagnosis[] => {
    return diagnoses;
};

export default {
    getDiagnoses,
};
