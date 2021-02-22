"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnUserDetails = exports.login = exports.signup = void 0;
const admin_1 = require("../utility/admin");
const config_1 = require("../utility/config");
const firebase_1 = require("firebase");
firebase_1.default.initializeApp(config_1.default);
const validators_1 = require("../utility/validators");
// sign up new user
const signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };
    const { valid, errors } = validators_1.validateSignupData(newUser);
    if (!valid)
        return res.status(400).json(errors);
    let token = '';
    let userID = '';
    admin_1.db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
        if (doc.exists) {
            return res
                .status(400)
                .json({ handle: 'this user handle is already taken' });
        }
        else {
            return firebase_1.default
                .auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
        .then((data) => {
        if (data.user) {
            userID = data.user.uid;
            return data.user.getIdToken();
        }
        else {
            return res
                .status(400)
                .json({ userID: 'There was an error setting up a userID' });
        }
    })
        .then((idToken) => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userID,
        };
        return admin_1.db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
        .then(() => {
        return res.status(201).json({ token });
    })
        .catch((err) => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            return res.status(400).json({ email: 'Email is already in use' });
        }
        else {
            return res
                .status(500)
                .json({ general: 'Something went wrong. Please try again.' });
        }
    });
};
exports.signup = signup;
// log user in
const login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };
    const { valid, errors } = validators_1.validateLoginData(user);
    if (!valid)
        return res.status(400).json(errors);
    firebase_1.default
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
        if (data.user) {
            return data.user.getIdToken();
        }
        else {
            return res
                .status(400)
                .json({ userID: 'There was an error setting up a userID' });
        }
    })
        .then((token) => {
        return res.json({ token });
    })
        .catch((err) => {
        console.error(err);
        if (err.code === 'auth/user-not-found') {
            return res.status(403).json({ email: 'User not found' });
        }
        else if (err.code === 'auth/wrong-password') {
            return res
                .status(403)
                .json({ password: 'Wrong credentials, please try again' });
        }
        else
            return res.status(500).json({ error: err.code });
    });
};
exports.login = login;
const getOwnUserDetails = (req, res) => {
    let userData;
    let tripData;
    let inviteData;
    admin_1.db.doc(`/users/${req.user.handle}`)
        .get()
        .then((doc) => {
        if (doc.exists) {
            userData.credentials = doc.data();
            return admin_1.db
                .collection('trips')
                .where('members', 'array-contains', req.user.handle)
                .orderBy('createdAt', 'desc')
                .get();
        }
        else {
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
        return admin_1.db
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
exports.getOwnUserDetails = getOwnUserDetails;
//# sourceMappingURL=users.js.map