const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const mongoose = require('mongoose');
const config = require('config');
const express = require('express');
const app = express();

//config module uses environment variables that we have set  // here it is searching for "jwtPrivateKey"  //so set private key for application
if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vitty')
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error('Could not connect to MongoDB...'));

//middleware functions 
//first json middleware will be used if json is sent or recieved to any route
//then one of the route is handled whichever called by client
//in that route there can be other middleware functions like auth,admin which will than pass execution to next() middleware
//next middleware will be error IF we catch any exception in try catch block
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log('Listening to port ' + port) });