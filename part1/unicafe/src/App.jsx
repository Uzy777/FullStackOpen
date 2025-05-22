import { useState } from "react";

// const Button = ({ onClick, text }) => {
//   return <button onClick={onClick}>{text}</button>;
// };

// const Display = (props) => {
//   return <div>{props.feedbackName} {props.feedbackName}</div>;
// };

const Statistics = ({ good, neutral, bad }) => {
  // Calculations
  const totalValue = good + neutral + bad;
  const averageValue = (good - bad) / totalValue;
  const positiveValue = (good * 100) / totalValue;

  if (good + neutral + bad === 0) {
    return (
      <div>
        <p>No feedback given yet!</p>
      </div>
    );
  }

  return (
    <div>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>All: {totalValue}</p>
      <p>Average: {averageValue}</p>
      <p>Positive: {positiveValue} %</p>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give Feedback:</h1>
      {/* Button Clicks */}
      <button onClick={() => setGood(good + 1)}>Good</button>
      <button onClick={() => setNeutral(neutral + 1)}>Neutral</button>
      <button onClick={() => setBad(bad + 1)}>Bad</button>
      <h1>Statistics:</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
