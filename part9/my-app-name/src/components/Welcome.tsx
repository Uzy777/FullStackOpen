interface WelcomeProps {
    name: string;
}

const Welcome = ({ name }: WelcomeProps) => {
    return <h1>Hello, {name}</h1>;
};

export default Welcome;
