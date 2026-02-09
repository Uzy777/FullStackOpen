interface ExerciseResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const calculateExercises = (dailyExerciseHours: number[], target: number): ExerciseResult => {
    const periodLength = dailyExerciseHours.length;

    const trainingDays = dailyExerciseHours.filter((h) => h > 0).length;

    const totalHours = dailyExerciseHours.reduce((sum, h) => sum + h, 0);
    let average = totalHours / periodLength;

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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));

// Write a function calculateExercises that calculates the average time of daily exercise hours, compares it to the target amount of daily hours and returns an object that includes the following values:

// the number of days
// the number of training days
// the original target value
// the calculated average time
// boolean value describing if the target was reached
// a rating between the numbers 1-3 that tells how well the hours are met. You can decide on the metric on your own.
// a text value explaining the rating, you can come up with the explanations
