require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

// --- REITIT ---

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})

// Hae kaikki henkilöt tietokannasta
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

// Hae yksi henkilö ID:n perusteella
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Info-reitti
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(
        `<p>Taulukkoon on tallennettu ${count} henkilöä.</p>` +
        `<p>Aika nyt: ${new Date().toLocaleString('fi-FI')}</p>`
      )
    })
    .catch(error => next(error))
})

// Uuden henkilön lisäys (POST)
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Nimi tai numero puuttuu' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })



  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
})

// Henkilön numeron muokkaus (PUT) -> TÄMÄ PUUTTUI!
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Henkilön poisto (DELETE)
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// --- VIRHEENKÄSITTELY (MIDDLEWARE) ---

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})