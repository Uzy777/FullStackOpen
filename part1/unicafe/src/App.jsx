import { useState } from "react";

const Button = ({ handleButtonClick, text }) => {
  return <button onClick={handleButtonClick[text.toLowerCase()]}>{text}</button>;
};

// const Display = (props) => {
//   return <div>{props.feedbackName} {props.feedbackName}</div>;
// };

const StatisticLine = ({ text, value }) => {
  return (
    <div>
      <p>
        {text}: {value}
      </p>
    </div>
  );
};

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
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="All" value={totalValue} />
      <StatisticLine text="Average" value={averageValue} />
      <StatisticLine text="Positive" value={positiveValue + " %"} />
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleButtonClick = {
    good: () => setGood(good + 1),
    neutral: () => setNeutral(neutral + 1),
    bad: () => setBad(bad + 1),
  };

  return (
    <div>
      <h1>Give Feedback:</h1>
      {/* Button Clicks */}
      <Button handleButtonClick={handleButtonClick} text="Good" />
      <Button handleButtonClick={handleButtonClick} text="Neutral" />
      <Button handleButtonClick={handleButtonClick} text={"Bad"} />
      <h1>Statistics:</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
