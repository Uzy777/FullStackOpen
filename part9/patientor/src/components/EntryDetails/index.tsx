import { Entry, Diagnosis, HealthCheckRating } from "../../types";

interface Props {
    entry: Entry;
    diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
    throw new Error(`Unhandled union member: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry, diagnoses }: Props) => {
    const renderDiagnosisCodes = () => {
        if (!entry.diagnosisCodes) {
            return null;
        }

        return (
            <ul>
                {entry.diagnosisCodes.map((code) => {
                    const diagnosis = diagnoses.find((d) => d.code === code);

                    return (
                        <li key={code}>
                            {code} {diagnosis ? diagnosis.name : ""}
                        </li>
                    );
                })}
            </ul>
        );
    };

    switch (entry.type) {
        case "Hospital":
            return (
                <div style={{ border: "1px solid black", padding: "0.5em", marginBottom: "1em" }}>
                    <div>{entry.date} 🏥</div>
                    <div>
                        <i>{entry.description}</i>
                    </div>
                    {renderDiagnosisCodes()}
                    <div>
                        discharge: {entry.discharge.date} {entry.discharge.criteria}
                    </div>
                    <div>diagnose by {entry.specialist}</div>
                </div>
            );

        case "OccupationalHealthcare":
            return (
                <div style={{ border: "1px solid black", padding: "0.5em", marginBottom: "1em" }}>
                    <div>
                        {entry.date} 💼 {entry.employerName}
                    </div>
                    <div>
                        <i>{entry.description}</i>
                    </div>
                    {renderDiagnosisCodes()}
                    {entry.sickLeave && (
                        <div>
                            sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
                        </div>
                    )}
                    <div>diagnose by {entry.specialist}</div>
                </div>
            );

        case "HealthCheck":
            return (
                <div style={{ border: "1px solid black", padding: "0.5em", marginBottom: "1em" }}>
                    <div>{entry.date} ❤️</div>
                    <div>
                        <i>{entry.description}</i>
                    </div>
                    {renderDiagnosisCodes()}
                    <div>{renderHealthCheckRating(entry.healthCheckRating)}</div>
                    <div>diagnose by {entry.specialist}</div>
                </div>
            );

        default:
            return assertNever(entry);
    }
};

const renderHealthCheckRating = (rating: HealthCheckRating) => {
    switch (rating) {
        case HealthCheckRating.Healthy:
            return "💚";
        case HealthCheckRating.LowRisk:
            return "🟨";
        case HealthCheckRating.HighRisk:
            return "🟧";
        case HealthCheckRating.CriticalRisk:
            return "🟥";
        default:
            return null;
    }
};

export default EntryDetails;
