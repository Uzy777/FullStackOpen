import NoteForm from "./components/NoteForm";
import Notes from "./components/Notes";

const App = () => {
    const filterSelected = (value) => {
        console.log(value);
    };

    return (
        <div>
            <NoteForm />
            <div>
                <input type="radio" name="filter" onChange={() => filterSelected("ALL")} />
                all
                <input type="radio" name="filter" onChange={() => filterSelected("IMPORTANT")} />
                important
                <input type="radio" name="filter" onChange={() => filterSelected("NONIMPORTANT")} />
                nonimportant
            </div>
            <Notes />
        </div>
    );
};

export default App;
