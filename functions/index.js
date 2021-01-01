const functions = require('firebase-functions');
const app = require('express')();

const cors = require('cors');
app.use(cors());

const FBAuth = require('./utility/fbAuth');

const { signup, login, getOwnUserDetails } = require('./handlers/users');
const { getGroup } = require('./handlers/groups');
const { getTrip } = require('./handlers/trips');
const { inviteUser } = require('./handlers/invites');

// User routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/users/:userHandle', FBAuth, getOwnUserDetails);

// Group routes
app.get('/groups/:groupID', FBAuth, getGroup);

// Trip routes
app.get('/groups/:groupID/trips/:tripID', FBAuth, getTrip);

// Invite routes
app.post('/groups/:groupID/invite', FBAuth, inviteUser);

exports.api = functions.https.onRequest(app);
