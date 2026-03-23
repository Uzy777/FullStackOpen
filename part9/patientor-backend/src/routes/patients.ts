import express from "express";
import patientsService from "../services/patientsService";
import { toNewPatient } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
    res.json(patientsService.getNonSensitivePatients());
});

router.get("/:id", (req, res) => {
    const patient = patientsService.getPatientById(req.params.id);

    if (patient) {
        res.json(patient);
    } else {
        res.status(404).send("Patient not found");
    }
});

router.post("/", (req, res) => {
    try {
        const newPatient = toNewPatient(req.body);
        const addedPatient = patientsService.addPatient(newPatient);
        res.json(addedPatient);
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Invalid data");
    }
});

export default router;
