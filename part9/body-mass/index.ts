import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
    res.send("Hello Full Stack");
});

app.get("/bmi", (req, res) => {
    const { height, weight } = req.query;

    if (typeof height !== "string" || typeof weight !== "string") {
        return res.status(400).json({ error: "malformatted parameters" });
    }

    const heightNumber = Number(height);
    const weightNumber = Number(weight);

    if (isNaN(heightNumber) || isNaN(weightNumber)) {
        return res.status(400).json({ error: "malformatted parameters" });
    }

    const bmi = calculateBmi(heightNumber, weightNumber);

    return res.json({
        height: heightNumber,
        weight: weightNumber,
        bmi,
    });
});

app.post("/exercises", (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || target === undefined) {
        return res.status(400).json({ error: "parameters missing" });
    }

    if (!Array.isArray(daily_exercises) || typeof target !== "number") {
        return res.status(400).json({ error: "malformatted parameters" });
    }

    if (daily_exercises.some((d) => isNaN(Number(d)))) {
        return res.status(400).json({ error: "malformatted parameters" });
    }

    const dailyNumbers = daily_exercises.map(Number);

    const result = calculateExercises(dailyNumbers, target);

    return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
