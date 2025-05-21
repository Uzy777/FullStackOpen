import { useState } from "react";

// const Button = ({ onClick, text }) => {
//   return <button onClick={onClick}>{text}</button>;
// };

// const Display = (props) => {
//   return <div>{props.feedbackName} {props.feedbackName}</div>;
// };

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  // const incrementGood = () => setGood(good + 1);
  // const incrementNeutral = () => setNeutral(neutral + 1);
  // const incrementBad = () => setBad(bad + 1);
  const total = good + neutral + bad;

  return (
    <div>
      <h1>Give Feedback:</h1>
      {/* <Button onClick={incrementGood} text="Good" />
      <Button onClick={incrementNeutral} text="Neutral" />
      <Button onClick={incrementBad} text="Bad" /> */}
      <button onClick={() => setGood(good + 1)}>Good</button>
      <button onClick={() => setNeutral(neutral + 1)}>Neutral</button>
      <button onClick={() => setBad(bad + 1)}>Bad</button>
      <h1>Statistics:</h1>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>All: {good + neutral + bad}</p>
      <p>Average: {(good - bad) / total}</p>
      <p>Positive: {(good * 100) / total} %</p>

      {/* <Display feedbackName="Good" /> */}
    </div>
  );
};

export default App;
