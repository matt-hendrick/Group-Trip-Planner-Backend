const { db } = require('../utility/admin');

// get data for a trip

exports.getTrip = (req, res) => {
  let tripData = {};
  let pinData = {};
  let listItemData = {};
  let itineraryData = {};
  db.doc(`/trips/${req.params.tripID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      tripData = doc.data();
      tripData.tripID = doc.id;
      return db
        .doc(`/trips/${req.params.tripID}`)
        .collection('pins')
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then((collection) => {
      tripData.pins = [];
      collection.forEach((doc) => {
        pinData = doc.data();
        pinData.pinID = doc.id;
        tripData.pins.push(pinData);
      });
      return db
        .doc(`/trips/${req.params.tripID}`)
        .collection('listitems')
        .orderBy('likeCount', 'desc')
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
      return db
        .doc(`/trips/${req.params.tripID}`)
        .collection('itineraryitems')
        .orderBy('index')
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then((collection) => {
      tripData.itineraryitems = [];
      collection.forEach((doc) => {
        itineraryData = doc.data();
        itineraryData.itineraryItemID = doc.id;
        tripData.itineraryitems.push(itineraryData);
      });
      return res.json(tripData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};

// Create Trip

exports.createTrip = (req, res) => {
  if (req.body.tripName.trim() === '') {
    return res.status(400).json({ tripName: 'Trip name must not be empty' });
  }

  const newTrip = {
    tripName: req.body.tripName,
    createdBy: req.user.handle,
    destination: req.body.destination ? req.body.destination : null,
    mapZoomLevel: 8,
    createdAt: new Date().toISOString(),
    members: [req.user.handle],
    pendingInvites: [],
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
exports.editTrip = (req, res) => {
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

exports.deleteTrip = (req, res) => {
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

exports.removeUserFromTrip = (req, res) => {
  db.doc(`/trips/${req.params.tripID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      if (!doc.data().members.includes(req.params.userHandle)) {
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
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
