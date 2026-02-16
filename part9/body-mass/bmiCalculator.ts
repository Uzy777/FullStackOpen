export const calculateBmi = (heightCm: number, weightKg: number): string => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal range";
    if (bmi < 30) return "Overweight";
    return "Obese";
};

// ---- CLI handling ----
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length !== 2) {
        throw new Error("Please provide exactly two arguments: height(cm) and weight(kg)");
    }

    const height = Number(args[0]);
    const weight = Number(args[1]);

    if (isNaN(height) || isNaN(weight)) {
        throw new Error("Provided values must be numbers");
    }

    console.log(calculateBmi(height, weight));
}

// Underweight: < 18.5

// Normal weight: 18.5 – 24.9

// Overweight: 25 – 29.9

// Obese: ≥ 3
