const { db, admin } = require('../utility/admin');

// Get data for a group

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

// Create Group

exports.createGroup = (req, res) => {
  if (req.body.groupName.trim() === '') {
    return res.status(400).json({ groupName: 'Group name must not be empty' });
  }

  const newGroup = {
    groupName: req.body.groupName,
    createdBy: req.user.handle,
    createdAt: new Date().toISOString(),
    members: [req.user.handle],
    pendingInvites: [],
  };
  db.collection('groups')
    .add(newGroup)
    .then((doc) => {
      const resGroup = newGroup;
      resGroup.groupID = doc.id;
      res.json(resGroup);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

// Remove User From Group

exports.removeUserFromGroup = (req, res) => {
  db.doc(`/groups/${req.params.groupID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Group not found' });
      }
      if (!doc.data().members.includes(req.params.userHandle)) {
        return res
          .status(404)
          .json({ invite: 'That user is not a group member' });
      } else {
        return db
          .doc(`/groups/${req.params.groupID}`)
          .update({
            members: admin.firestore.FieldValue.arrayRemove(
              req.params.userHandle
            ),
          })
          .then(() => {
            return res.json({ message: 'User removed from group' });
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
