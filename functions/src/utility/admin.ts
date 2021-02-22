import admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

declare global {
  namespace Express {
    export interface Request {
      user: admin.auth.DecodedIdToken;
    }
  }
}

export { admin, db };
