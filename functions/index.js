const functions = require('firebase-functions');
const app = require('express')();

const cors = require('cors');
app.use(cors());

const FBAuth = require('./utility/fbAuth');
const { db } = require('./utility/admin');

const { signup, login } = require('./handlers/users');

// User routes
app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.https.onRequest(app);
