const { db } = require('../utility/admin');

// Create an List Item

exports.createListItem = (req, res) => {
  const newListItem = {
    body: req.body.body ? req.body.body : null,
    link: req.body.link ? req.body.link : null,
    price: req.body.price ? req.body.price : null,
    location: req.body.location ? req.body.location : null,
    date: req.body.date ? req.body.date : null,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
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
