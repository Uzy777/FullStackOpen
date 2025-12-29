import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import { useNotification } from './NotificationContext'

const App = () => {
  const [, notificationDispatch] = useNotification()

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate(
      { ...anecdote, votes: anecdote.votes + 1 },
      {
        onSuccess: () => {
          notificationDispatch({
            type: 'SET',
            payload: `you voted '${anecdote.content}'`,
          })
          setTimeout(() => {
            notificationDispatch({ type: 'CLEAR' })
          }, 5000)
        },
      },
    )
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problem in server</div>
  }

  const anecdotes = result.data

  const handleCreate = (newAnecdote) => {
    newAnecdoteMutation.mutate(newAnecdote, {
      onSuccess: () => {
        notificationDispatch({
          type: 'SET',
          payload: `you added '${newAnecdote.content}'`,
        })
        setTimeout(() => {
          notificationDispatch({ type: 'CLEAR' })
        }, 5000)
      },
    })
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm createAnecdote={handleCreate} />
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
