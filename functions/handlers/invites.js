const { db, admin } = require('../utility/admin');

// Invite User

exports.inviteUser = (req, res) => {
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
      if (!doc.data().members.includes(req.user.handle)) {
        return res.status(403).json({ user: 'User is not a group member' });
      }
      if (doc.data().members.includes(req.body.recipient)) {
        return res
          .status(404)
          .json({ invite: 'That user is already a group member' });
      }
      if (doc.data().pendingInvites.includes(req.body.recipient)) {
        return res
          .status(404)
          .json({ invite: 'That user has already been invited to the group' });
      } else {
        return db
          .doc(`/users/${req.body.recipient}`)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              return res
                .status(404)
                .json({ error: 'There is no user with that handle' });
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

// Accept Invite

exports.acceptInvite = (req, res) => {
  db.doc(`/groups/${req.params.groupID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Group not found' });
      }
      if (doc.data().members.includes(req.user.handle)) {
        return res
          .status(404)
          .json({ invite: 'That user is already a group member' });
      }
      if (!doc.data().pendingInvites.includes(req.user.handle)) {
        return res
          .status(404)
          .json({ invite: 'That user has not been invited to the group' });
      } else {
        return db
          .doc(`/groups/${req.params.groupID}`)
          .update({
            pendingInvites: admin.firestore.FieldValue.arrayRemove(
              req.user.handle
            ),
            members: admin.firestore.FieldValue.arrayUnion(req.user.handle),
          })
          .then(() => {
            return db
              .doc(`/invites/${req.params.inviteID}`)
              .get()
              .then((doc) => {
                if (!doc.exists) {
                  return res.status(404).json({ error: 'Invite not found' });
                }
                if (doc.data().recipient !== req.user.handle) {
                  return res.status(403).json({ error: 'Unauthorized' });
                } else {
                  return db.doc(`/invites/${req.params.inviteID}`).delete();
                }
              })
              .then(() => {
                return res.json({ message: 'Invite Accepted' });
              })
              .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: err.code });
              });
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

// Reject Invite

exports.rejectInvite = (req, res) => {
  db.doc(`/groups/${req.params.groupID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Group not found' });
      }
      if (doc.data().members.includes(req.user.handle)) {
        return res
          .status(404)
          .json({ invite: 'That user is already a group member' });
      }
      if (!doc.data().pendingInvites.includes(req.user.handle)) {
        return res
          .status(404)
          .json({ invite: 'That user has not been invited to the group' });
      } else {
        return db
          .doc(`/groups/${req.params.groupID}`)
          .update({
            pendingInvites: admin.firestore.FieldValue.arrayRemove(
              req.user.handle
            ),
          })
          .then(() => {
            return db
              .doc(`/invites/${req.params.inviteID}`)
              .get()
              .then((doc) => {
                if (!doc.exists) {
                  return res.status(404).json({ error: 'Invite not found' });
                }
                if (doc.data().recipient !== req.user.handle) {
                  return res.status(403).json({ error: 'Unauthorized' });
                } else {
                  return db.doc(`/invites/${req.params.inviteID}`).delete();
                }
              })
              .then(() => {
                return res.json({ message: 'Invite Rejected' });
              })
              .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: err.code });
              });
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
