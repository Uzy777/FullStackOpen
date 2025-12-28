import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification, clearNotification } from "../reducers/notificationReducer";
import anecdoteService from "../services/anecdotes";

const AnecdoteList = () => {
    const dispatch = useDispatch();

    const anecdotes = useSelector(({ anecdotes, filter }) => {
        const filtered = filter === "" ? anecdotes : anecdotes.filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()));

        return [...filtered].sort((a, b) => b.votes - a.votes);
    });

    const vote = async (anecdote) => {
        const updatedAnecdote = {
            ...anecdote,
            votes: anecdote.votes + 1,
        };

        const returnedAnecdote = await anecdoteService.update(anecdote.id, updatedAnecdote);

        dispatch(voteAnecdote(returnedAnecdote));

        dispatch(setNotification(`you voted '${anecdote.content}'`));

        setTimeout(() => {
            dispatch(clearNotification());
        }, 5000);
    };

    return (
        <div>
            {anecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnecdoteList;
