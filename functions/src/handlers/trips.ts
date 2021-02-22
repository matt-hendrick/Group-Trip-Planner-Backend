import { db, admin } from '../utility/admin';
import { Request, Response } from 'express';

interface NewTrip {
  tripName: string;
  createdBy: string;
  destination: number[];
  mapZoomLevel: number;
  createdAt: string;
  members: string[];
  pendingInvites: string[];
  itineraryItems: ItineraryDictionary;
  tripID?: string;
}

interface ItineraryItem {
  createdAt: string;
  userHandle: string;
  body: string;
}

interface ItineraryDictionary {
  [key: number]: ItineraryItem;
}

// get data for a trip
export const getTrip = (req: Request, res: Response) => {
  let tripData: FirebaseFirestore.DocumentData;
  let pinData: FirebaseFirestore.DocumentData;
  let listItemData: FirebaseFirestore.DocumentData;
  db.doc(`/trips/${req.params.tripID}`)
    .get()
    .then((doc): Response | PromiseLike<any> => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      tripData = doc.data() as FirebaseFirestore.DocumentData;
      tripData.tripID = doc.id;
      return db
        .doc(`/trips/${req.params.tripID}`)
        .collection('pins')
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then((collection: FirebaseFirestore.DocumentData) => {
      tripData.pins = [];
      collection.forEach((doc: FirebaseFirestore.DocumentData) => {
        pinData = doc.data();
        pinData.pinID = doc.id;
        tripData.pins.push(pinData);
      });
      return db
        .doc(`/trips/${req.params.tripID}`)
        .collection('listitems')
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then((collection) => {
      tripData.listItems = [];
      collection.forEach((doc) => {
        listItemData = doc.data();
        listItemData.listItemID = doc.id;
        tripData.listItems.push(listItemData);
      });
      return res.json(tripData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};

// Create Trip
export const createTrip = (req: Request, res: Response): Response | void => {
  if (req.body.tripName.trim() === '') {
    return res.status(400).json({ tripName: 'Trip name must not be empty' });
  }

  const newTrip: NewTrip = {
    tripName: req.body.tripName,
    createdBy: req.user.handle,
    destination: req.body.destination ? req.body.destination : null,
    mapZoomLevel: 8,
    createdAt: new Date().toISOString(),
    members: [req.user.handle],
    pendingInvites: [],
    itineraryItems: {} as ItineraryDictionary,
  };
  db.collection(`/trips`)
    .add(newTrip)
    .then((doc) => {
      const resTrip = newTrip;
      resTrip.tripID = doc.id;
      res.json(resTrip);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

// Edit Trip Data
export const editTrip = (req: Request, res: Response): Response | void => {
  if (req.body.tripName && req.body.tripName.trim() === '') {
    return res.status(400).json({ tripName: 'Trip name must not be empty' });
  }

  db.doc(`/trips/${req.params.tripID}`)
    .update(req.body)
    .then(() => {
      return res.json({ message: 'Trip details updated successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Delete Trip
export const deleteTrip = (req: Request, res: Response) => {
  db.doc(`/trips/${req.params.tripID}`)
    .delete()
    .then(() => {
      res.json({ message: 'Trip deleted successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

// Remove User From Trip
export const removeUserFromTrip = (req: Request, res: Response) => {
  db.doc(`/trips/${req.params.tripID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      if (!doc.data()?.members.includes(req.params.userHandle)) {
        return res
          .status(404)
          .json({ invite: 'That user is not a trip member' });
      } else {
        return db
          .doc(`/trips/${req.params.tripID}`)
          .update({
            members: admin.firestore.FieldValue.arrayRemove(
              req.params.userHandle
            ),
          })
          .then(() => {
            return res.json({ message: 'User removed from trip' });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
