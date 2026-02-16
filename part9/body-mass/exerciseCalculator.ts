export interface ExerciseResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

export const calculateExercises = (dailyExerciseHours: number[], target: number): ExerciseResult => {
    const periodLength = dailyExerciseHours.length;
    const trainingDays = dailyExerciseHours.filter((h) => h > 0).length;
    const totalHours = dailyExerciseHours.reduce((sum, h) => sum + h, 0);
    const average = totalHours / periodLength;
    const success = average >= target;

    let rating: number;
    let ratingDescription: string;

    if (average < target * 0.75) {
        rating = 1;
        ratingDescription = "you need to exercise more";
    } else if (average < target) {
        rating = 2;
        ratingDescription = "not too bad but could be better";
    } else {
        rating = 3;
        ratingDescription = "great job, target exceeded";
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average,
    };
};

if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        throw new Error("Please provide target and daily exercise hours");
    }

    const target = Number(args[0]);
    const dailyHours = args.slice(1).map(Number);

    if (isNaN(target) || dailyHours.some(isNaN)) {
        throw new Error("All provided values must be numbers");
    }

    console.log(calculateExercises(dailyHours, target));
}
