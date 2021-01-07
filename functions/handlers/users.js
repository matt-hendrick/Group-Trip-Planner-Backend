const { db, admin } = require('../utility/admin');

const config = require('../utility/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
} = require('../utility/validators');

// sign up new user

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  let token, userID;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ handle: 'this user handle is already taken' });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userID = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      console.log(token);
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userID,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already in use' });
      } else {
        return res
          .status(500)
          .json({ general: 'Something went wrong. Please try again.' });
      }
    });
};

// log user in

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        return res.status(403).json({ email: 'User not found' });
      } else if (err.code === 'auth/wrong-password') {
        return res
          .status(403)
          .json({ password: 'Wrong credentials, please try again' });
      } else return res.status(500).json({ error: err.code });
    });
};

exports.getOwnUserDetails = (req, res) => {
  let userData = {};
  let tripData = {};
  let inviteData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection('trips')
          .where('members', 'array-contains', req.user.handle)
          .orderBy('createdAt', 'desc')
          .get();
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    })
    .then((collection) => {
      userData.trips = [];
      collection.forEach((doc) => {
        tripData = doc.data();
        tripData.tripID = doc.id;
        userData.trips.push(tripData);
      });
      return db
        .collection('invites')
        .where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then((collection) => {
      userData.invites = [];
      collection.forEach((doc) => {
        inviteData = doc.data();
        inviteData.inviteID = doc.id;
        userData.invites.push(inviteData);
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
