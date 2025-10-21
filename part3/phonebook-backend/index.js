require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

morgan.token("postData", (request, response) => {
    if (request.method === "POST") {
        return JSON.stringify(request.body);
    }
    return "";
});

app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :postData"));
app.use(express.static("dist"));

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

// GET REQUESTS //

app.get("/", (request, response) => {
    response.send("<h1>Phonebook Application</h1>");
});

app.get("/info", (request, response) => {
    const entriesCount = persons.length;
    const date = new Date().toString();

    response.send(
        `<p>Phonebook has info for ${entriesCount} people.</p>
        <p>${date}</p>`
    );
});

// Get for all persons
app.get("/api/persons", (request, response, next) => {
    Person.find({})
        .then((persons) => {
            response.json(persons);
        })
        .catch((error) => next(error));
});

// app.get("/api/persons", (request, response) => {
//     response.json(persons);
// });

// Get for a person ID
app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then((person) => {
        response.json(person);
    });
});

// app.get("/api/persons/:id", (request, response) => {
//     const id = request.params.id;
//     const person = persons.find((person) => person.id === id);

//     if (person) {
//         response.json(person);
//     } else {
//         response.status(404).end();
//     }
// });

// DELETE REQUESTS //

// Delete a single person ID entry
app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

// app.delete("/api/persons/:id", (request, response) => {
//     const id = request.params.id;
//     persons = persons.filter((person) => person.id !== id);

//     response.status(204).end();
// });

// POST REQUESTS //

// Post new phonebook entry
app.post("/api/persons", (request, response, next) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({ error: "content missing" });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson);
        })
        .catch((error) => next(error));
});

// const generateId = () => {
//     return String(Math.floor(Math.random() * (1000000 - 0 + 1) + 0));
// };

// app.post("/api/persons", (request, response) => {
//     const body = request.body;

//     if (!body.name || !body.number) {
//         return response.status(400).json({
//             error: "content missing",
//         });
//     } else if (persons.some((person) => person.name === body.name)) {
//         return response.status(400).json({
//             error: "name must be unique",
//         });
//     }

//     const person = {
//         name: body.name,
//         number: body.number || false,
//         id: generateId(),
//     };

//     persons = persons.concat(person);

//     response.json(person);
// });

// PUT REQUESTS

// Change number for existing person name
app.put("/api/persons/:id", (request, response, next) => {
    const { name, number } = request.body;

    Person.findById(request.params.id)
        .then((person) => {
            if (!person) {
                return response.status(404).end();
            }

            person.name = name;
            person.number = number;

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson);
            });
        })
        .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
