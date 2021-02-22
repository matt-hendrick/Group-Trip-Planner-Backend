import { db } from '../utility/admin';

import config from '../utility/config';

import firebase from 'firebase';
firebase.initializeApp(config);

import { validateSignupData, validateLoginData } from '../utility/validators';
import { Request, Response } from 'express';

interface NewUser {
  email: string;
  password: string;
  confirmPassword: string;
  handle: string;
}

interface LoginUser {
  email: string;
  password: string;
}

// sign up new user
export const signup = (req: Request, res: Response): Response | void => {
  const newUser: NewUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  let token = '';
  let userID = '';
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc): Response | PromiseLike<any> => {
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
    .then((data: firebase.auth.UserCredential): Promise<any> | Response => {
      if (data.user) {
        userID = data!.user.uid;
        return data!.user.getIdToken();
      } else {
        return res
          .status(400)
          .json({ userID: 'There was an error setting up a userID' });
      }
    })
    .then((idToken: string) => {
      token = idToken;
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
export const login = (req: Request, res: Response): Response | void => {
  const user: LoginUser = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data): Promise<any> | Response => {
      if (data.user) {
        return data.user.getIdToken();
      } else {
        return res
          .status(400)
          .json({ userID: 'There was an error setting up a userID' });
      }
    })
    .then((token: string) => {
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

// Gets the logged in user's user, trip, and invite data
export const getOwnUserDetails = (req: Request, res: Response) => {
  let userData = {} as FirebaseFirestore.DocumentData;
  let tripData = {} as FirebaseFirestore.DocumentData;
  let inviteData = {} as FirebaseFirestore.DocumentData;
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc): PromiseLike<any> | Response => {
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
    .then((collection: FirebaseFirestore.DocumentData) => {
      userData.trips = [];
      collection.forEach((doc: FirebaseFirestore.DocumentData) => {
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
