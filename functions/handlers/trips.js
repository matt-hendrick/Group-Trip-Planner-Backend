const { db } = require('../utility/admin');

// get data for a trip

exports.getTrip = (req, res) => {
  let tripData = {};
  db.doc(`/groups/${req.params.groupID}/trips/${req.params.tripID}`)
    .get()
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
  };
  db.collection(`/groups/${req.params.groupID}/trips`)
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

// Create Comment

exports.createComment = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }

  const newComment = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.doc(`/groups/${req.params.groupID}/trips/${req.params.tripID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Trip not found' });
      } else {
        return db
          .collection(
            `/groups/${req.params.groupID}/trips/${req.params.tripID}/comments`
          )
          .add(newComment)
          .then((doc) => {
            const resComment = newComment;
            resComment.commentID = doc.id;
            res.json(resComment);
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

// Delete Comment

exports.deleteComment = (req, res) => {
  db.doc(
    `/groups/${req.params.groupID}/trips/${req.params.tripID}/comments/${req.params.commentID}`
  )
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return db
          .doc(
            `/groups/${req.params.groupID}/trips/${req.params.tripID}/comments/${req.params.commentID}`
          )
          .delete()
          .then(() => {
            res.json({ message: 'Comment deleted successfully' });
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
