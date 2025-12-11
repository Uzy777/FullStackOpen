import { useDispatch } from "react-redux";
import anecdoteReducer from "../reducers/anecdoteReducer";

const generateId = () => Number((Math.random() * 1000000).toFixed(0));

const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const addAnecdote = (event) => {
        event.preventDefault();
        const content = event.target.anecdote.value;
        event.target.anecdote.value = "";
        dispatch({
            type: "NEW_ANECDOTE",
            payload: {
                content,
                id: generateId(),
                votes: 0,
            },
        });
    };

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="anecdote" />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    );
};

export default AnecdoteForm;
