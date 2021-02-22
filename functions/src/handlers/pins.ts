import { db } from '../utility/admin';
import { Request, Response } from 'express';

interface NewPin {
  comment?: string | null;
  coordinates?: number[] | null;
  address?: string | null;
  userHandle: string;
  createdAt: string;
  tripID: string;
  pinID?: string;
}

// Create Pin

export const createPin = (req: Request, res: Response): void | Response => {
  if (!req.body.coordinates) {
    return res.status(400).json({ pin: 'A location must be selected' });
  }

  const newPin: NewPin = {
    comment: req.body.comment ? req.body.comment : null,
    coordinates: req.body.coordinates ? req.body.coordinates : null,
    address: req.body.address ? req.body.address : null,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    tripID: req.params.tripID,
  };

  db.collection(`/trips/${req.params.tripID}/pins`)
    .add(newPin)
    .then((doc) => {
      const resPin = newPin;
      resPin.pinID = doc.id;
      res.json(resPin);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

// Delete Pin

export const deletePin = (req: Request, res: Response) => {
  db.doc(`/trips/${req.params.tripID}/pins/${req.params.pinID}`)
    .get()
    .then((doc): void | PromiseLike<void> | Response => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Pin not found' });
      }
      if (doc.data()?.userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return db
          .doc(`/trips/${req.params.tripID}/pins/${req.params.pinID}`)
          .delete()
          .then(() => {
            res.json({ message: 'Pin deleted successfully' });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};
