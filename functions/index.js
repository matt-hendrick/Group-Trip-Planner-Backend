const functions = require('firebase-functions');
const app = require('express')();

const cors = require('cors');
app.use(cors());

const FBAuth = require('./utility/fbAuth');
const groupAuth = require('./utility/groupAuth');

const { signup, login, getOwnUserDetails } = require('./handlers/users');
const {
  getGroup,
  createGroup,
  removeUserFromGroup,
} = require('./handlers/groups');
const {
  getTrip,
  createTrip,
  createComment,
  deleteComment,
  createPin,
  deletePin,
} = require('./handlers/trips');
const {
  inviteUser,
  acceptInvite,
  rejectInvite,
} = require('./handlers/invites');

// User routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', FBAuth, getOwnUserDetails);

// Group routes
app.get('/groups/:groupID', FBAuth, getGroup);
app.post('/groups', FBAuth, createGroup);
app.delete(
  '/groups/:groupID/users/:userHandle',
  FBAuth,
  groupAuth,
  removeUserFromGroup
);

// Trip routes
app.get('/groups/:groupID/trips/:tripID', FBAuth, groupAuth, getTrip);
app.post('/groups/:groupID/trips', FBAuth, groupAuth, createTrip);
app.post(
  '/groups/:groupID/trips/:tripID/comment',
  FBAuth,
  groupAuth,
  createComment
);
app.delete(
  '/groups/:groupID/trips/:tripID/comments/:commentID',
  FBAuth,
  groupAuth,
  deleteComment
);
app.post('/groups/:groupID/trips/:tripID/pin', FBAuth, groupAuth, createPin);
app.delete(
  '/groups/:groupID/trips/:tripID/pins/:pinID',
  FBAuth,
  groupAuth,
  deletePin
);

// Invite routes
app.post('/groups/:groupID/invite', FBAuth, inviteUser);
app.post('/groups/:groupID/invite/:inviteID', FBAuth, acceptInvite);
app.delete('/groups/:groupID/invite/:inviteID', FBAuth, rejectInvite);

exports.api = functions.https.onRequest(app);
