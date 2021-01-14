const functions = require('firebase-functions');
const app = require('express')();

const cors = require('cors');
app.use(cors());

const FBAuth = require('./utility/fbAuth');
const tripAuth = require('./utility/tripAuth');

const { signup, login, getOwnUserDetails } = require('./handlers/users');
const {
  getTrip,
  createTrip,
  editTrip,
  deleteTrip,
  createPin,
  deletePin,
  createItineraryItem,
  deleteItineraryItem,
  editItineraryItem,
  removeUserFromTrip,
} = require('./handlers/trips');
const {
  inviteUser,
  acceptInvite,
  rejectInvite,
} = require('./handlers/invites');
const { geocode, directions } = require('./handlers/mapbox');
const { createListItem, deleteListItem } = require('./handlers/lists');

// User routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', FBAuth, getOwnUserDetails);

// Trip routes
app.get('/trips/:tripID', FBAuth, tripAuth, getTrip);
app.post('/trips', FBAuth, createTrip);
app.post('/trips/:tripID', FBAuth, tripAuth, editTrip);
app.delete('/trips/:tripID', FBAuth, tripAuth, deleteTrip);

// Pin routes
app.post('/trips/:tripID/pin', FBAuth, tripAuth, createPin);
app.delete('/trips/:tripID/pins/:pinID', FBAuth, tripAuth, deletePin);

// Itinerary Routes
app.post('/trips/:tripID/itineraryitem', FBAuth, tripAuth, createItineraryItem);
app.delete(
  '/trips/:tripID/itineraryitems/:itineraryItemID',
  FBAuth,
  tripAuth,
  deleteItineraryItem
);
app.post(
  '/trips/:tripID/itineraryitems/:itineraryItemID',
  FBAuth,
  tripAuth,
  editItineraryItem
);

// List routes
app.post('/trips/:tripID/listitem', FBAuth, tripAuth, createListItem);
app.delete(
  '/trips/:tripID/listitems/:listItemID',
  FBAuth,
  tripAuth,
  deleteListItem
);

// Invite routes
app.post('/trips/:tripID/invite', FBAuth, inviteUser);
app.post('/trips/:tripID/invite/:inviteID', FBAuth, acceptInvite);
app.delete('/trips/:tripID/invite/:inviteID', FBAuth, rejectInvite);
app.delete(
  '/trips/:tripID/users/:userHandle',
  FBAuth,
  tripAuth,
  removeUserFromTrip
);

// MapBox routes
app.post('/geocode', FBAuth, geocode);
app.post('/directions', FBAuth, directions);

exports.api = functions.https.onRequest(app);
