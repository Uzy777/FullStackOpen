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

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const PatientPage = ({ diagnoses }: Props) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const { id } = useParams<{ id: string }>();

    const [entryType, setEntryType] = useState<EntryType>("HealthCheck");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [specialist, setSpecialist] = useState("");
    const [diagnosisCodes, setDiagnosisCodes] = useState("");

    const [healthCheckRating, setHealthCheckRating] = useState("");
    const [dischargeDate, setDischargeDate] = useState("");
    const [dischargeCriteria, setDischargeCriteria] = useState("");
    const [employerName, setEmployerName] = useState("");
    const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
    const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

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

        const diagnosisCodesArray = diagnosisCodes ? diagnosisCodes.split(",").map((code) => code.trim()) : [];

        let newEntry: EntryWithoutId;

        switch (entryType) {
            case "HealthCheck":
                newEntry = {
                    type: "HealthCheck",
                    description,
                    date,
                    specialist,
                    diagnosisCodes: diagnosisCodesArray,
                    healthCheckRating: Number(healthCheckRating) as HealthCheckRating,
                };
                break;

            case "Hospital":
                newEntry = {
                    type: "Hospital",
                    description,
                    date,
                    specialist,
                    diagnosisCodes: diagnosisCodesArray,
                    discharge: {
                        date: dischargeDate,
                        criteria: dischargeCriteria,
                    },
                };
                break;

            case "OccupationalHealthcare":
                newEntry = {
                    type: "OccupationalHealthcare",
                    description,
                    date,
                    specialist,
                    diagnosisCodes: diagnosisCodesArray,
                    employerName,
                    ...(sickLeaveStartDate && sickLeaveEndDate
                        ? {
                              sickLeave: {
                                  startDate: sickLeaveStartDate,
                                  endDate: sickLeaveEndDate,
                              },
                          }
                        : {}),
                };
                break;

            default:
                throw new Error("Unsupported entry type");
        }

        try {
            const createdEntry = await patientService.addEntry(patient.id, newEntry);

            setPatient({
                ...patient,
                entries: patient.entries.concat(createdEntry),
            });

            setEntryType("HealthCheck");
            setDescription("");
            setDate("");
            setSpecialist("");
            setDiagnosisCodes("");
            setHealthCheckRating("");
            setDischargeDate("");
            setDischargeCriteria("");
            setEmployerName("");
            setSickLeaveStartDate("");
            setSickLeaveEndDate("");
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

            <h3>New entry</h3>

            {error && <div style={{ color: "red" }}>{error}</div>}

            <form
                onSubmit={submitNewEntry}
                style={{
                    border: "1px dashed black",
                    padding: "1em",
                    marginBottom: "1em",
                }}
            >
                <div>
                    type
                    <select value={entryType} onChange={({ target }) => setEntryType(target.value as EntryType)}>
                        <option value="HealthCheck">HealthCheck</option>
                        <option value="Hospital">Hospital</option>
                        <option value="OccupationalHealthcare">OccupationalHealthcare</option>
                    </select>
                </div>

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
                    diagnosis codes
                    <input value={diagnosisCodes} onChange={({ target }) => setDiagnosisCodes(target.value)} placeholder="e.g. Z57.1, N30.0" />
                </div>

                {entryType === "HealthCheck" && (
                    <div>
                        healthCheckRating
                        <input value={healthCheckRating} onChange={({ target }) => setHealthCheckRating(target.value)} />
                    </div>
                )}

                {entryType === "Hospital" && (
                    <>
                        <div>
                            discharge date
                            <input value={dischargeDate} onChange={({ target }) => setDischargeDate(target.value)} placeholder="YYYY-MM-DD" />
                        </div>
                        <div>
                            discharge criteria
                            <input value={dischargeCriteria} onChange={({ target }) => setDischargeCriteria(target.value)} />
                        </div>
                    </>
                )}

                {entryType === "OccupationalHealthcare" && (
                    <>
                        <div>
                            employer name
                            <input value={employerName} onChange={({ target }) => setEmployerName(target.value)} />
                        </div>
                        <div>
                            sick leave start date
                            <input value={sickLeaveStartDate} onChange={({ target }) => setSickLeaveStartDate(target.value)} placeholder="YYYY-MM-DD" />
                        </div>
                        <div>
                            sick leave end date
                            <input value={sickLeaveEndDate} onChange={({ target }) => setSickLeaveEndDate(target.value)} placeholder="YYYY-MM-DD" />
                        </div>
                    </>
                )}

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
