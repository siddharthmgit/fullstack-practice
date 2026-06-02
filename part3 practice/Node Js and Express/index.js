const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

morgan.token('body', (req) => { return JSON.stringify(req.body) })

app.put('/api/notes/:id', (request, response) => {
  const id = String(request.params.id)
  const body = request.body
  const note = notes.find(note => note.id == id)
  if (!note) {
    return response.status(404).json({ error: 'note is missing' })
  }
  const updatedNote = {
    ...note,
    content: body.content,
    important: body.important
  }
  notes = notes.map(note => note.id === id ? updatedNote : note)
  response.json(updatedNote)
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World! how are you</h1>')
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id == id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id != id)
  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})