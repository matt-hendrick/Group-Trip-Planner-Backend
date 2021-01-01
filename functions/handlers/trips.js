const { db } = require('../utility/admin');

// get data for a trip

exports.getTrip = (req, res) => {
  let groupData = {};
  let tripData = {};
  db.doc(`/groups/${req.params.groupID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Group not found' });
      }
      groupData = doc.data();
      groupData.groupID = doc.id;
      if (!groupData.members.includes(req.user.handle)) {
        return res.status(403).json({ user: 'User is not a group member' });
      }
      return db
        .doc(`/groups/${req.params.groupID}/trips/${req.params.tripID}`)
        .get();
    })
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      tripData = doc.data();
      tripData.tripID = doc.id;
      return db
        .doc(`/groups/${req.params.groupID}/trips/${req.params.tripID}`)
        .collection('pins')
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then((collection) => {
      tripData.pins = [];
      collection.forEach((doc) => {
        tripData.pins.push(doc.data());
      });
      return db
        .doc(`/groups/${req.params.groupID}/trips/${req.params.tripID}`)
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then((collection) => {
      tripData.comments = [];
      collection.forEach((doc) => {
        tripData.comments.push(doc.data());
      });
      return db
        .doc(`/groups/${req.params.groupID}/trips/${req.params.tripID}`)
        .collection('lists')
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then((collection) => {
      tripData.lists = [];
      collection.forEach((doc) => {
        tripData.lists.push(doc.data());
      });
      return res.json(tripData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};
