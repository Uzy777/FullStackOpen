interface CoursePart {
    name: string;
    exerciseCount: number;
}

interface HeaderProps {
    name: string;
}

const Header = ({ name }: HeaderProps) => {
    return <h1>{name}</h1>;
};

interface ContentProps {
    parts: CoursePart[];
}

const Content = ({ parts }: ContentProps) => {
    return (
        <div>
            <p>
                {parts[0].name} {parts[0].exerciseCount}
            </p>
            <p>
                {parts[1].name} {parts[1].exerciseCount}
            </p>
            <p>
                {parts[2].name} {parts[2].exerciseCount}
            </p>
        </div>
    );
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
        { name: "Fundamentals", exerciseCount: 10 },
        { name: "Using props to pass data", exerciseCount: 7 },
        { name: "Deeper type usage", exerciseCount: 14 },
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
