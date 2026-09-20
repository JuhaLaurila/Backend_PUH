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

  const person = new Person({
    name: body.name,
    number: body.number

  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })

    .catch(error => next(error))
    })
 


// Henkilön numeron muokkaus (PUT) -> TÄMÄ PUUTTUI!
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      
       person.name = name
      person.number = number
 
      return person.save().then(updatedPerson => {
    
      response.json(updatedPerson)
    }) 
})
.catch(error => next(error))
})
 

// Henkilön poisto (DELETE)
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result=> {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// --- VIRHEENKÄSITTELY (MIDDLEWARE) ---

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if ((error.name  || error.number)  === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
 }

else if ((error.name  || error.number)  === 'ValidationError') {
    return response.status(400).send({ error: 'error.message' })
 }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})