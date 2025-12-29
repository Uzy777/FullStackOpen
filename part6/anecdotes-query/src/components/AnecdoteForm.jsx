const AnecdoteForm = ({ createAnecdote }) => {
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    createAnecdote({
      content,
      votes: 0,
    })
  }

  return (
    <form onSubmit={onCreate}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
