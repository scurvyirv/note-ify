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

//create GET method for dbData returned in JSON
app.get('/api/notes', (req, res) => res.json(dbData));

//POST method for dbData from db.json 
//* `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

//post method to saveNote
app.post('/api/notes', (req, res) => {
    //log that POST request was received
    console.info(`${req.method} request was received to save note`)

    //destructure title and text from req.body
    const {title, text} =req.body;

    if (title && text) {
        //variable for the object we will save
        const newSavedNote = {
            title,
            text,
            userID: uuidv4(),
        };

        fs.readFile('./db/db.json', 'utf8', (readErr, data) => {
            if (readErr) {
                console.error(readErr);
                res.status(500).send('Error reading notes file.');
            } else {
                let notes = JSON.parse(data);
                notes.push(newSavedNote);

                fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        res.status(500).send('Error saving note.');
                    } else {
                        console.info('Successfully updated saved notes');
                        res.json(newSavedNote);
                    }
                });
            }
        });
    } else {
        res.status(400).send('Title and text are required for a note.');
    }
});

//create express.js routes for default '/', '/index' = wildcard '/*', and '/notes' endpoints
// app.get('/', (req, res) => res.sendFile('./public/index.html'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

//create listen method to listen for incoming connections to specified PORT
app.listen(PORT, () => console.log(`Note-ify app listening at http://localhost:${PORT}`));
