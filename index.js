

const express = require('express')
const app = express()
var morgan = require('morgan')

const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: "1",
    name: "Torspo",
    number: "1234456"
  },
  {
    id: "2",
    name: "Kake",
    number: "654321"
  },
 {
    id: "3",
    name: "Unto",
    number: "132435"
  },

  {
    id: "4",
    name: "Steve",
    number: "13243578"
  },

  {
    id: "5",
    name: "Tuomo Tampio",
    number: "13243578"
  },
]



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  
  const person = persons.find(person => person.id === id)

   if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.get('/info', (request, response) => {
  response.send('Taulukkoon on tallennettu '+ persons.length + ' henkilöä. ' + ` Aika nyt: ${new Date().toLocaleString('fi-FI')}` )

})

app.post('/api/persons', (request, response) => {

  const person = request.body

  if (!person.name || !person.number) {
    return response.status(400).json({ 
      error: 'nimi tai numero puuttuu ' 
    })
  }

  const samaNumero = persons.find(
    p => p.number === person.number
    
  )

  if (samaNumero) {
    return response.status(400).json({ 
      error: 'numero on jo olemassa' 
    })

  }
   


  
  person.id = Math.floor(Math.random() * 1000000).toString()

 
persons = persons.concat(person)

  console.log('Lisätty henkilö:', person)
  console.log('Kaikki henkilöt:', persons)

  response.json(person) 

})



app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})