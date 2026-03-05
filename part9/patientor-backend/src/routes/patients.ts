import express from "express";
import patientsService from "../services/patientsService";
import { toNewPatient } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
    const patients = patientsService.getNonSensitivePatients();
    return res.json(patients);
});

router.post("/", (req, res) => {
    try {
        const newPatient = toNewPatient(req.body);
        const addedPatient = patientsService.addPatient(newPatient);
        return res.json(addedPatient);
    } catch (error) {
        return res.status(400).send(error instanceof Error ? error.message : "Invalid data");
    }
});

export default router;
