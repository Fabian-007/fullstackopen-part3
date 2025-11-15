//import express module
const express = require('express')
require('dotenv').config()
const Person = require('./model/persons')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
//enable CORS for all routes
app.use(cors())
app.use(express.static('dist'))
//middleware to parse incoming JSON request data
app.use(express.json())


// define custom token to log request body
morgan.token('body', (req) => JSON.stringify(req.body))

//use the token in a custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

//route handler for the root path
app.get('/api/persons', (req, res) => {
  Person.find({}).then((notes) => {
    res.json(notes)
  })
})

//route handler for the /info path
app.get('/info', (req, res) => {
  const date = new Date()
  res.send(
    `<p>Phonebook has info for ${Person.length} people</p> <p>${date}</p>`
  )
})

//route handler for the /api/persons/:id path
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id).then((person) => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
    .catch((error) => {
      console.log(error)
      res.status(500).end()
    })
})
app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const { name, number } = body
  Person.findById(id)
    .then((person) => {
      if (person) {
        person.name = name
        person.number = number
        return person.save().then((updatedPerson) => {
          res.json(updatedPerson)
        })
      }
      else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  }).catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  console.log(body)

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing',
    })
  }

  // create a new person object with mongoose model
  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generateId(),
  })

  // validate that the name and number are provided and that the name is unique
  if (!person.name || !person.number) {
    return res.status(400).json({
      error: 'name or number is missing',
    })
  }


  person.save().then((savedPerson) => {
    res.json(savedPerson)
  })
    .catch((error) => next(error))
})

//middleware to handle unknown endpoints
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  //handle validation errors
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)


// start server and listen on the specified port;
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
