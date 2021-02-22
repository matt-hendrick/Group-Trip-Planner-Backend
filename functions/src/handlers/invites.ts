import { db, admin } from '../utility/admin';
import { Request, Response } from 'express';

interface InviteData {
  recipient: string;
  sender: string;
  createdAt: string;
  tripID: string;
  tripName?: string;
}

// Invite User
export const inviteUser = (req: Request, res: Response) => {
  let tripName = '';
  const inviteData: InviteData = {
    recipient: req.body.recipient,
    sender: req.user.handle,
    createdAt: new Date().toISOString(),
    tripID: req.params.tripID,
  };
  db.doc(`/trips/${req.params.tripID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      if (!doc.data()?.members.includes(req.user.handle)) {
        return res.status(403).json({ user: 'User is not a trip member' });
      }
      if (doc.data()?.members.includes(req.body.recipient)) {
        return res
          .status(404)
          .json({ invite: 'That user is already a trip member' });
      }
      if (doc.data()?.pendingInvites.includes(req.body.recipient)) {
        return res
          .status(404)
          .json({ invite: 'That user has already been invited to the trip' });
      } else {
        tripName = doc.data()?.tripName;
        return db
          .doc(`/users/${req.body.recipient}`)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              return res
                .status(404)
                .json({ invite: 'There is no user with that handle' });
            } else {
              return db
                .doc(`/trips/${req.params.tripID}`)
                .update({
                  pendingInvites: admin.firestore.FieldValue.arrayUnion(
                    req.body.recipient
                  ),
                })
                .then(() => {
                  inviteData.tripName = tripName;
                  return db.collection('invites').add(inviteData);
                })
                .then(() => {
                  return res.json({ message: 'Invite Sent' });
                });
            }
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Accept Invite
export const acceptInvite = (req: Request, res: Response) => {
  db.doc(`/trips/${req.params.tripID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      if (doc.data()?.members.includes(req.user.handle)) {
        return res
          .status(404)
          .json({ invite: 'That user is already a trip member' });
      }
      if (!doc.data()?.pendingInvites.includes(req.user.handle)) {
        return res
          .status(404)
          .json({ invite: 'That user has not been invited to the trip' });
      } else {
        return db
          .doc(`/trips/${req.params.tripID}`)
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
              .then((doc): PromiseLike<any> | Response => {
                if (!doc.exists) {
                  return res.status(404).json({ error: 'Invite not found' });
                }
                if (doc.data()?.recipient !== req.user.handle) {
                  return res.status(403).json({ error: 'Unauthorized' });
                } else {
                  return db.doc(`/invites/${req.params.inviteID}`).delete();
                }
              })
              .then(() => {
                return res.json({ message: 'Invite Accepted' });
              });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Reject Invite
export const rejectInvite = (req: Request, res: Response) => {
  db.doc(`/trips/${req.params.tripID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      if (doc.data()?.members.includes(req.user.handle)) {
        return res
          .status(404)
          .json({ invite: 'That user is already a trip member' });
      }
      if (!doc.data()?.pendingInvites.includes(req.user.handle)) {
        return res
          .status(404)
          .json({ invite: 'That user has not been invited to the trip' });
      } else {
        return db
          .doc(`/trips/${req.params.tripID}`)
          .update({
            pendingInvites: admin.firestore.FieldValue.arrayRemove(
              req.user.handle
            ),
          })
          .then(() => {
            return db
              .doc(`/invites/${req.params.inviteID}`)
              .get()
              .then((doc): PromiseLike<any> | Response => {
                if (!doc.exists) {
                  return res.status(404).json({ error: 'Invite not found' });
                }
                if (doc.data()?.recipient !== req.user.handle) {
                  return res.status(403).json({ error: 'Unauthorized' });
                } else {
                  return db.doc(`/invites/${req.params.inviteID}`).delete();
                }
              })
              .then(() => {
                return res.json({ message: 'Invite Rejected' });
              });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
