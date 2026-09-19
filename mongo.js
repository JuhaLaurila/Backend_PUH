const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('anna salasana argumenttina')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://JuLauusi:${password}@cluster0.vqvldvv.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// 1. Määritellään schema
const personSchema = new mongoose.Schema({
  nimi: String,
  numero: String,
  important: Boolean,
})

// 2. Luodaan malli 
const Person = mongoose.model('Person', personSchema)

// 3. LOGIIKKA: Jos argumentteja on vain salasana, tulostetaan kaikki
if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.nimi} ${person.numero}`)
    })
    mongoose.connection.close()
  })
} 

// 4. LOGIIKKA: Jos argumentteja on nimi ja numero, tallennetaan uusi
if (process.argv.length > 3) {
  const nimi = process.argv[3]
  const numero = process.argv[4]

  const person = new Person({
    nimi: nimi,
    numero: numero,
    important: Math.random() > 0.5,
  })

  person.save()
    .then(result => {
      console.log(`added ${nimi} number ${numero} to phonebook`)
      mongoose.connection.close()
    })
    .catch(err => {
      console.log('Virhe tallennuksessa:', err)
      mongoose.connection.close()
    })
}