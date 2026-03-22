import type { CoursePart } from "../types";

const assertNever = (value: never): never => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const Part = ({ part }: { part: CoursePart }) => {
    switch (part.kind) {
        case "basic":
            return (
                <div>
                    <p>
                        {part.name} {part.exerciseCount}
                    </p>
                    <p>
                        <i>{part.description}</i>
                    </p>
                </div>
            );

        case "group":
            return (
                <div>
                    <p>
                        {part.name} {part.exerciseCount}
                    </p>
                    <p>project exercises {part.groupProjectCount}</p>
                </div>
            );

        case "background":
            return (
                <div>
                    <p>
                        {part.name} {part.exerciseCount}
                    </p>
                    <p>
                        <i>{part.description}</i>
                    </p>
                    <p>submit to {part.backgroundMaterial}</p>
                </div>
            );

        default:
            return assertNever(part);
    }
};

export default Part;
