import express from "express";
import patientsService from "../services/patientsService";

const router = express.Router();

router.get("/", (_req, res) => {
    const patients = patientsService.getNonSensitivePatients();
    return res.json(patients);
});

export default router;
