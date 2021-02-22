import { db, admin } from '../utility/admin';
import { Request, Response } from 'express';

interface NewListItem {
  body: string;
  link: string;
  price: number;
  location: number[];
  date: string;
  userHandle: string;
  createdAt: string;
  likes: string[];
  tripID: string;
  listType: string;
  listItemID?: string;
}

// Create an List Item

export const createListItem = (
  req: Request,
  res: Response
): Response | void => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'List item body must not be empty' });
  }

  const newListItem: NewListItem = {
    body: req.body.body,
    link: req.body.link ? req.body.link : null,
    price: req.body.price ? req.body.price : null,
    location: req.body.location ? req.body.location : null,
    date: req.body.date ? req.body.date : null,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    likes: [],
    tripID: req.params.tripID,
    listType: req.body.listType,
  };

  db.collection(`/trips/${req.params.tripID}/listitems`)
    .add(newListItem)
    .then((doc) => {
      const resListItem = newListItem;
      resListItem.listItemID = doc.id;
      res.json(resListItem);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

// Delete List Item
export const deleteListItem = (req: Request, res: Response) => {
  db.doc(`/trips/${req.params.tripID}/listitems/${req.params.listItemID}`)
    .get()
    .then((doc): Response | PromiseLike<any> => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'List Item not found' });
      } else if (doc.data()?.userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return db
          .doc(`/trips/${req.params.tripID}/listitems/${req.params.listItemID}`)
          .delete()
          .then(() => {
            res.json({ message: 'List Item deleted successfully' });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

// Like List Item
export const likeListItem = (req: Request, res: Response) => {
  const likeDocument = db.doc(
    `/trips/${req.params.tripID}/listitems/${req.params.listItemID}`
  );

  likeDocument
    .get()
    .then((doc) => {
      if (doc.data()?.likes.includes(req.user.handle)) {
        return res
          .status(404)
          .json({ likes: 'That user already liked that list item' });
      } else
        return likeDocument
          .update({
            likes: admin.firestore.FieldValue.arrayUnion(req.user.handle),
          })
          .then(() => {
            return res.json({ message: 'List item liked' });
          });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Unlike List Item
exports.unlikeListItem = (req: Request, res: Response) => {
  const likeDocument = db.doc(
    `/trips/${req.params.tripID}/listitems/${req.params.listItemID}`
  );

  likeDocument
    .get()
    .then((doc) => {
      if (!doc.data()?.likes.includes(req.user.handle)) {
        return res
          .status(404)
          .json({ likes: 'That user has not liked that list item' });
      } else
        return likeDocument
          .update({
            likes: admin.firestore.FieldValue.arrayRemove(req.user.handle),
          })
          .then(() => {
            return res.json({ message: 'List item unliked' });
          });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
