const { db } = require('../utility/admin');

// get data for a group

exports.getGroup = (req, res) => {
  let groupData = {};
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
        .doc(`/groups/${req.params.groupID}`)
        .collection('trips')
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then((collection) => {
      groupData.trips = [];
      collection.forEach((doc) => {
        groupData.trips.push(doc.data());
      });
      return res.json(groupData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};
