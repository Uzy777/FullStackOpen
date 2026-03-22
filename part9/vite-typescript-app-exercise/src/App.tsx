import type { CoursePart } from "./types";
import Content from "./components/Content";

interface HeaderProps {
    name: string;
}

const Header = ({ name }: HeaderProps) => {
    return <h1>{name}</h1>;
};

interface TotalProps {
    parts: CoursePart[];
}

const Total = ({ parts }: TotalProps) => {
    const total = parts.reduce((sum, part) => sum + part.exerciseCount, 0);
    return <p>Number of exercises {total}</p>;
};

const App = () => {
    const courseName = "Half Stack application development";

    const courseParts: CoursePart[] = [
        {
            name: "Fundamentals",
            exerciseCount: 10,
            description: "This is an awesome course part",
            kind: "basic",
        },
        {
            name: "Using props to pass data",
            exerciseCount: 7,
            groupProjectCount: 3,
            kind: "group",
        },
        {
            name: "Basics of type Narrowing",
            exerciseCount: 7,
            description: "How to go from unknown to string",
            kind: "basic",
        },
        {
            name: "Deeper type usage",
            exerciseCount: 14,
            description: "Confusing description",
            backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
            kind: "background",
        },
    ];

    return (
        <div>
            <Header name={courseName} />
            <Content parts={courseParts} />
            <Total parts={courseParts} />
        </div>
    );
};

export default App;
