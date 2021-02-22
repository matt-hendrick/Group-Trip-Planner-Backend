import functions = require('firebase-functions');
import express = require('express');

let app = express();

import cors = require('cors');
app.use(cors());

import FBAuth = require('./utility/fbAuth');
import tripAuth = require('./utility/tripAuth');

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
app.get('/user', FBAuth, getOwnUserDetails);

// Trip routes
app.get('/trips/:tripID', FBAuth, tripAuth, getTrip);
app.post('/trips', FBAuth, createTrip);
app.post('/trips/:tripID', FBAuth, tripAuth, editTrip);
app.delete('/trips/:tripID', FBAuth, tripAuth, deleteTrip);

// Pin routes
app.post('/trips/:tripID/pin', FBAuth, tripAuth, createPin);
app.delete('/trips/:tripID/pins/:pinID', FBAuth, tripAuth, deletePin);

// List routes
app.post('/trips/:tripID/listitem', FBAuth, tripAuth, createListItem);
app.delete(
  '/trips/:tripID/listitems/:listItemID',
  FBAuth,
  tripAuth,
  deleteListItem
);
app.post(
  '/trips/:tripID/listitems/:listItemID/like',
  FBAuth,
  tripAuth,
  likeListItem
);
app.post(
  '/trips/:tripID/listitems/:listItemID/unlike',
  FBAuth,
  tripAuth,
  unlikeListItem
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
app.post('/pinGeocode', FBAuth, pinGeocode);
app.post('/mapCenterGeocode', FBAuth, mapCenterGeocode);
app.post('/directions', FBAuth, directions);

exports.api = functions.https.onRequest(app);
