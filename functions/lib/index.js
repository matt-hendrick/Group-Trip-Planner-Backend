"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
let app = express();
const cors = require("cors");
app.use(cors());
const fbAuth_1 = require("./utility/fbAuth");
const tripAuth_1 = require("./utility/tripAuth");
const users_1 = require("./handlers/users");
const trips_1 = require("./handlers/trips");
const pins_1 = require("./handlers/pins");
const invites_1 = require("./handlers/invites");
const mapbox_1 = require("./handlers/mapbox");
const lists_1 = require("./handlers/lists");
// User routes
app.post('/signup', users_1.signup);
app.post('/login', users_1.login);
app.get('/user', fbAuth_1.default, users_1.getOwnUserDetails);
// Trip routes
app.get('/trips/:tripID', fbAuth_1.default, tripAuth_1.default, trips_1.getTrip);
app.post('/trips', fbAuth_1.default, trips_1.createTrip);
app.post('/trips/:tripID', fbAuth_1.default, tripAuth_1.default, trips_1.editTrip);
app.delete('/trips/:tripID', fbAuth_1.default, tripAuth_1.default, trips_1.deleteTrip);
// Pin routes
app.post('/trips/:tripID/pin', fbAuth_1.default, tripAuth_1.default, pins_1.createPin);
app.delete('/trips/:tripID/pins/:pinID', fbAuth_1.default, tripAuth_1.default, pins_1.deletePin);
// List routes
app.post('/trips/:tripID/listitem', fbAuth_1.default, tripAuth_1.default, lists_1.createListItem);
app.delete('/trips/:tripID/listitems/:listItemID', fbAuth_1.default, tripAuth_1.default, lists_1.deleteListItem);
app.post('/trips/:tripID/listitems/:listItemID/like', fbAuth_1.default, tripAuth_1.default, lists_1.likeListItem);
app.post('/trips/:tripID/listitems/:listItemID/unlike', fbAuth_1.default, tripAuth_1.default, lists_1.unlikeListItem);
// Invite routes
app.post('/trips/:tripID/invite', fbAuth_1.default, invites_1.inviteUser);
app.post('/trips/:tripID/invite/:inviteID', fbAuth_1.default, invites_1.acceptInvite);
app.delete('/trips/:tripID/invite/:inviteID', fbAuth_1.default, invites_1.rejectInvite);
app.delete('/trips/:tripID/users/:userHandle', fbAuth_1.default, tripAuth_1.default, trips_1.removeUserFromTrip);
// MapBox routes
app.post('/pinGeocode', fbAuth_1.default, mapbox_1.pinGeocode);
app.post('/mapCenterGeocode', fbAuth_1.default, mapbox_1.mapCenterGeocode);
app.post('/directions', fbAuth_1.default, mapbox_1.directions);
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map