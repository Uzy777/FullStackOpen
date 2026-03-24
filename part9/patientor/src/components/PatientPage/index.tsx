import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import { Diagnosis, Gender, Patient } from "../../types";
import EntryDetails from "../EntryDetails";

interface Props {
    diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const { id } = useParams<{ id: string }>();

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
