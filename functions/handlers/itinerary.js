const { db } = require('../utility/admin');

// Create an Itinerary Item

exports.createItineraryItem = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }

  const newItineraryItem = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    startDateTime: null,
    endDateTime: null,
    likeCount: 0,
    commentCount: 0,
    tripID: req.params.tripID,
    index: 0,
  };

  db.collection(`/trips/${req.params.tripID}/itineraryitems`)
    .add(newItineraryItem)
    .then((doc) => {
      const resItineraryItem = newItineraryItem;
      resItineraryItem.itineraryItemID = doc.id;
      res.json(resItineraryItem);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

// Delete Itinerary Item

exports.deleteItineraryItem = (req, res) => {
  db.doc(
    `/trips/${req.params.tripID}/itineraryitems/${req.params.itineraryItemID}`
  )
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Itinerary Item not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return db
          .doc(
            `/trips/${req.params.tripID}/itineraryitems/${req.params.itineraryItemID}`
          )
          .delete()
          .then(() => {
            res.json({ message: 'Itinerary Item deleted successfully' });
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

// Edit Itinerary Item Data
exports.editItineraryItem = (req, res) => {
  db.doc(
    `/trips/${req.params.tripID}/itineraryitems/${req.params.itineraryItemID}`
  )
    .update(req.body)
    .then(() => {
      return res.json({
        message: 'Itinerary Item details updated successfully',
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
