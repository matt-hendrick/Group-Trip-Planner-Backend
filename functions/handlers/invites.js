const { db, admin } = require('../utility/admin');

// invite user

exports.inviteUser = (req, res) => {
  let groupData = {};
  const inviteData = {
    recipient: req.body.recipient,
    sender: req.user.handle,
    createdAt: new Date().toISOString(),
    rejected: false,
    accepted: false,
    groupID: req.params.groupID,
  };
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
      if (groupData.members.includes(req.body.recipient)) {
        return res
          .status(404)
          .json({ invite: 'That user is already a group member' });
      }
      if (groupData.pendingInvites.includes(req.body.recipient)) {
        return res
          .status(404)
          .json({ invite: 'That user has already been invited to the group' });
      } else {
        return db
          .doc(`/users/${req.body.recipient}`)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              return res.status(404).json({ error: 'User not found' });
            } else {
              return db
                .doc(`/groups/${req.params.groupID}`)
                .update({
                  pendingInvites: admin.firestore.FieldValue.arrayUnion(
                    req.body.recipient
                  ),
                })
                .then(() => {
                  return db.collection('invites').add(inviteData);
                })
                .then(() => {
                  return res.json({ message: 'Invite Sent' });
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
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
