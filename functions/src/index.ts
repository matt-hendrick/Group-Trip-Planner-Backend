import functions = require('firebase-functions');
import express = require('express');

let app = express();

import cors = require('cors');
app.use(cors());

import fbAuth from './utility/fbAuth';
import tripAuth from './utility/tripAuth';

import { signup, login, getOwnUserDetails } from './handlers/users';
import {
  getTrip,
  createTrip,
  editTrip,
  deleteTrip,
  removeUserFromTrip,
} from './handlers/trips';
import { createPin, deletePin } from './handlers/pins';
import { inviteUser, acceptInvite, rejectInvite } from './handlers/invites';
import { pinGeocode, mapCenterGeocode, directions } from './handlers/mapbox';
import {
  createListItem,
  deleteListItem,
  likeListItem,
  unlikeListItem,
} from './handlers/lists';

// User routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', fbAuth, getOwnUserDetails);

// Trip routes
app.get('/trips/:tripID', fbAuth, tripAuth, getTrip);
app.post('/trips', fbAuth, createTrip);
app.post('/trips/:tripID', fbAuth, tripAuth, editTrip);
app.delete('/trips/:tripID', fbAuth, tripAuth, deleteTrip);

// Pin routes
app.post('/trips/:tripID/pin', fbAuth, tripAuth, createPin);
app.delete('/trips/:tripID/pins/:pinID', fbAuth, tripAuth, deletePin);

// List routes
app.post('/trips/:tripID/listitem', fbAuth, tripAuth, createListItem);
app.delete(
  '/trips/:tripID/listitems/:listItemID',
  fbAuth,
  tripAuth,
  deleteListItem
);
app.post(
  '/trips/:tripID/listitems/:listItemID/like',
  fbAuth,
  tripAuth,
  likeListItem
);
app.post(
  '/trips/:tripID/listitems/:listItemID/unlike',
  fbAuth,
  tripAuth,
  unlikeListItem
);

// Invite routes
app.post('/trips/:tripID/invite', fbAuth, inviteUser);
app.post('/trips/:tripID/invite/:inviteID', fbAuth, acceptInvite);
app.delete('/trips/:tripID/invite/:inviteID', fbAuth, rejectInvite);
app.delete(
  '/trips/:tripID/users/:userHandle',
  fbAuth,
  tripAuth,
  removeUserFromTrip
);

// MapBox routes
app.post('/pinGeocode', fbAuth, pinGeocode);
app.post('/mapCenterGeocode', fbAuth, mapCenterGeocode);
app.post('/directions', fbAuth, directions);

exports.api = functions.https.onRequest(app);
