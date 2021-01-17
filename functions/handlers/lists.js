const { db, admin } = require('../utility/admin');

// Create an List Item

exports.createListItem = (req, res) => {
  if (req.body.body && req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }

  const newListItem = {
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

exports.deleteListItem = (req, res) => {
  db.doc(`/trips/${req.params.tripID}/listitems/${req.params.listItemID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'List Item not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return db
          .doc(`/trips/${req.params.tripID}/listitems/${req.params.listItemID}`)
          .delete()
          .then(() => {
            res.json({ message: 'List Item deleted successfully' });
          })
          .catch((err) => {
            res.status(500).json({ error: 'Something went wrong' });
            console.error(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

// Like List Item
exports.likeListItem = (req, res) => {
  const likeDocument = db.doc(
    `/trips/${req.params.tripID}/listitems/${req.params.listItemID}`
  );

  likeDocument
    .get()
    .then((doc) => {
      if (doc.data().likes.includes(req.user.handle)) {
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
exports.unlikeListItem = (req, res) => {
  const likeDocument = db.doc(
    `/trips/${req.params.tripID}/listitems/${req.params.listItemID}`
  );

  likeDocument
    .get()
    .then((doc) => {
      if (!doc.data().likes.includes(req.user.handle)) {
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
