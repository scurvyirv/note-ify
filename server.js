//import modules express.js, path, and fs
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//initialize instantiation of express.js
const app = express();

//specify which port to run express.js server OR 3001 if no environment variable PORT
const PORT = process.env.PORT || 3001;
const userID = uuidv4();
console.log(userID);

//specify which folder to navigate through for middleware
app.use(express.static('public'));

//take in JSON data from clients
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//define database data 
const dbData = require('./db/db.json');

//GET method for dbData returned in JSON
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (readErr, data) => {
        console.log('file read')
        console.log(data);
        res.json(JSON.parse(data));
    });
});

//POST method for dbData from db.json 
app.post('/api/notes', (req, res) => {
    //log that POST request was received
    console.info(`${req.method} request was received to save note`)

    //destructure title and text from req.body
    const { title, text } = req.body;

    if (title && text) {
        //variable for the object we will save
        const newNote = {
            title,
            text,
            userID: uuidv4(),
        };
        console.log('new note', newNote);

        fs.readFile('./db/db.json', 'utf8', (readErr, data) => {
            if (readErr) {
                console.error(readErr);
                res.status(500).send('Error reading notes file.');
            } else {
                let notes = JSON.parse(data);
                notes.push(newNote);

                return fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), () => console.log('hello'))
            }
        });

        //the response to allow this route to complete
        res.json('hello');

        } else {
        res.status(400).send('Title and text are required for a note.');
    }
});

//DELETE method for dbData from db.json 
app.delete('/api/notes/:id', (req, res) => {
    //log that POST request was received
    console.info(`${req.params.id} request was received to delete note`)

    // //destructure title and text from req.body
    // const { title, text } = req.body;

    // if (title && text) {
    //     //variable for the object we will save
    //     const newNote = {
    //         title,
    //         text,
    //         userID: uuidv4(),
    //     };
    //     console.log('new note', newNote);

    //     fs.readFile('./db/db.json', 'utf8', (readErr, data) => {
    //         if (readErr) {
    //             console.error(readErr);
    //             res.status(500).send('Error reading notes file.');
    //         } else {
    //             let notes = JSON.parse(data);
    //             notes.push(newNote);

    //             return fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), () => console.log('hello'))
    //         }
    //     });
        
    //     //the response to allow this route to complete
    //     res.json('hello');

    //     } else {
    //     res.status(400).send('Title and text are required for a note.');
    // }
});


//create express.js routes for default '/', '/index' = wildcard '/*', and '/notes' endpoints
// app.get('/', (req, res) => res.sendFile('./public/index.html'));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
//wildcard to index.html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

//create listen method to listen for incoming connections to specified PORT
app.listen(PORT, () => console.log(`Note-ify app listening at http://localhost:${PORT}`));
