import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import patientService from "../../services/patients";
import EntryDetails from "../EntryDetails";
import type { Diagnosis, EntryWithoutId, HealthCheckRating, Patient } from "../../types";
import { Gender } from "../../types";

interface Props {
    diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const { id } = useParams<{ id: string }>();

    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [specialist, setSpecialist] = useState("");
    const [healthCheckRating, setHealthCheckRating] = useState("");
    const [diagnosisCodes, setDiagnosisCodes] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchPatient = async () => {
            const patientData = await patientService.getById(id);
            setPatient(patientData);
        };

        void fetchPatient();
    }, [id]);

    const submitNewEntry = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (!patient) {
            return;
        }

        const newEntry: EntryWithoutId = {
            type: "HealthCheck",
            description,
            date,
            specialist,
            healthCheckRating: Number(healthCheckRating) as HealthCheckRating,
            diagnosisCodes: diagnosisCodes ? diagnosisCodes.split(",").map((code) => code.trim()) : [],
        };

        try {
            const createdEntry = await patientService.addEntry(patient.id, newEntry);

            setPatient({
                ...patient,
                entries: patient.entries.concat(createdEntry),
            });

            setDescription("");
            setDate("");
            setSpecialist("");
            setHealthCheckRating("");
            setDiagnosisCodes("");
            setError("");
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (typeof e.response?.data === "string") {
                    setError(e.response.data);
                } else {
                    setError("Failed to add entry");
                }
            } else {
                setError("Unknown error");
            }
        }
    };

    if (!patient) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>
                {patient.name} {patient.gender === Gender.Male ? "♂" : patient.gender === Gender.Female ? "♀" : "⚧"}
            </h2>

            <div>ssn: {patient.ssn}</div>
            <div>occupation: {patient.occupation}</div>

            <h3>New HealthCheck entry</h3>

            {error && <div style={{ color: "red" }}>{error}</div>}

            <form onSubmit={submitNewEntry}>
                <div>
                    description
                    <input value={description} onChange={({ target }) => setDescription(target.value)} />
                </div>

                <div>
                    date
                    <input value={date} onChange={({ target }) => setDate(target.value)} placeholder="YYYY-MM-DD" />
                </div>

                <div>
                    specialist
                    <input value={specialist} onChange={({ target }) => setSpecialist(target.value)} />
                </div>

                <div>
                    healthCheckRating
                    <input value={healthCheckRating} onChange={({ target }) => setHealthCheckRating(target.value)} />
                </div>

                <div>
                    diagnosis codes
                    <input value={diagnosisCodes} onChange={({ target }) => setDiagnosisCodes(target.value)} placeholder="e.g. Z57.1, N30.0" />
                </div>

                <button type="submit">add</button>
            </form>

            <h3>entries</h3>

            {patient.entries.length === 0 ? (
                <div>No entries</div>
            ) : (
                patient.entries.map((entry) => <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />)
            )}
        </div>
    );
};

export default PatientPage;
