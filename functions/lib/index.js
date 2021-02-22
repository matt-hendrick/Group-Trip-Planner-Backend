"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
let app = express();
const cors = require("cors");
app.use(cors());
const FBAuth = require("./utility/fbAuth");
const tripAuth = require("./utility/tripAuth");
const users_1 = require("./handlers/users");
const trips_1 = require("./handlers/trips");
const pins_1 = require("./handlers/pins");
const invites_1 = require("./handlers/invites");
const mapbox_1 = require("./handlers/mapbox");
const lists_1 = require("./handlers/lists");
// User routes
app.post('/signup', users_1.signup);
app.post('/login', users_1.login);
app.get('/user', FBAuth, users_1.getOwnUserDetails);
// Trip routes
app.get('/trips/:tripID', FBAuth, tripAuth, trips_1.getTrip);
app.post('/trips', FBAuth, trips_1.createTrip);
app.post('/trips/:tripID', FBAuth, tripAuth, trips_1.editTrip);
app.delete('/trips/:tripID', FBAuth, tripAuth, trips_1.deleteTrip);
// Pin routes
app.post('/trips/:tripID/pin', FBAuth, tripAuth, pins_1.createPin);
app.delete('/trips/:tripID/pins/:pinID', FBAuth, tripAuth, pins_1.deletePin);
// List routes
app.post('/trips/:tripID/listitem', FBAuth, tripAuth, lists_1.createListItem);
app.delete('/trips/:tripID/listitems/:listItemID', FBAuth, tripAuth, lists_1.deleteListItem);
app.post('/trips/:tripID/listitems/:listItemID/like', FBAuth, tripAuth, lists_1.likeListItem);
app.post('/trips/:tripID/listitems/:listItemID/unlike', FBAuth, tripAuth, lists_1.unlikeListItem);
// Invite routes
app.post('/trips/:tripID/invite', FBAuth, invites_1.inviteUser);
app.post('/trips/:tripID/invite/:inviteID', FBAuth, invites_1.acceptInvite);
app.delete('/trips/:tripID/invite/:inviteID', FBAuth, invites_1.rejectInvite);
app.delete('/trips/:tripID/users/:userHandle', FBAuth, tripAuth, trips_1.removeUserFromTrip);
// MapBox routes
app.post('/pinGeocode', FBAuth, mapbox_1.pinGeocode);
app.post('/mapCenterGeocode', FBAuth, mapbox_1.mapCenterGeocode);
app.post('/directions', FBAuth, mapbox_1.directions);
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map