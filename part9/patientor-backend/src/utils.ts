import { EntryWithoutId, Gender, HealthCheckRating, NewPatient } from "./types";
import { z } from "zod";

export const NewPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.string().date(),
    ssn: z.string(),
    gender: z.nativeEnum(Gender),
    occupation: z.string(),
});

export const toNewPatient = (object: unknown): NewPatient => {
    const parsedPatient = NewPatientSchema.parse(object);

    return {
        ...parsedPatient,
        entries: [],
    };
};

const BaseEntrySchema = z.object({
    description: z.string(),
    date: z.string().date(),
    specialist: z.string(),
    diagnosisCodes: z.array(z.string()).optional(),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
    type: z.literal("Hospital"),
    discharge: z.object({
        date: z.string().date(),
        criteria: z.string(),
    }),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
    type: z.literal("OccupationalHealthcare"),
    employerName: z.string(),
    sickLeave: z
        .object({
            startDate: z.string().date(),
            endDate: z.string().date(),
        })
        .optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
    type: z.literal("HealthCheck"),
    healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const NewEntrySchema = z.discriminatedUnion("type", [HospitalEntrySchema, OccupationalHealthcareEntrySchema, HealthCheckEntrySchema]);

export const toNewEntry = (object: unknown): EntryWithoutId => {
    return NewEntrySchema.parse(object);
};
