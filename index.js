//import express module
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
//enable CORS for all routes
app.use(cors());
app.use(express.static("dist"));
//middleware to parse incoming JSON request data
app.use(express.json());

// define custom token to log request body
morgan.token("body", (req) => JSON.stringify(req.body));

//use the token in a custom format
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

//route handler for the root path
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

//route handler for the /info path
app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`
  );
});

//route handler for the /api/persons/:id path
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});
// generate a new random id for a new person
const generateId = () => {
  const maxId = persons.length > 0 ? Math.floor(Math.random() * 10000) : 0;
  return (maxId + 1).toString();
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }

  // create a new person object
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  // validate that the name and number are provided and that the name is unique
  if (!person.name || !person.number) {
    return res.status(400).json({
      error: "name or number is missing",
    });
  }

  // check for duplicate names
  if (persons.find((p) => p.name === person.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  persons = persons.concat(person);
  res.status(201).json(person);
});

//middleware to handle unknown endpoints
 app.use(unknownEndpoint);

// start server and listen on the specified port;
const PORT = proces.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
