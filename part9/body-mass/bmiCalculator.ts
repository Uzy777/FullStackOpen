const calculateBmi = (heightCm: number, weightKg: number): string => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    if (bmi < 18.5) {
        return "Underweight";
    } else if (bmi < 24.9) {
        return "Normal weight";
    } else if (bmi < 29.9) {
        return "Overweight";
    } else if (bmi > 3) {
        return "Obese";
    }
};

console.log(calculateBmi(180, 74));

// Underweight: < 18.5

// Normal weight: 18.5 – 24.9

// Overweight: 25 – 29.9

// Obese: ≥ 3
