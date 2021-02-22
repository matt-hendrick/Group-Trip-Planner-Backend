"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectInvite = exports.acceptInvite = exports.inviteUser = void 0;
const admin_1 = require("../utility/admin");
// Invite User
const inviteUser = (req, res) => {
    let tripName = '';
    const inviteData = {
        recipient: req.body.recipient,
        sender: req.user.handle,
        createdAt: new Date().toISOString(),
        tripID: req.params.tripID,
    };
    admin_1.db.doc(`/trips/${req.params.tripID}`)
        .get()
        .then((doc) => {
        var _a, _b, _c, _d;
        if (!doc.exists) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        if (!((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.members.includes(req.user.handle))) {
            return res.status(403).json({ user: 'User is not a trip member' });
        }
        if ((_b = doc.data()) === null || _b === void 0 ? void 0 : _b.members.includes(req.body.recipient)) {
            return res
                .status(404)
                .json({ invite: 'That user is already a trip member' });
        }
        if ((_c = doc.data()) === null || _c === void 0 ? void 0 : _c.pendingInvites.includes(req.body.recipient)) {
            return res
                .status(404)
                .json({ invite: 'That user has already been invited to the trip' });
        }
        else {
            tripName = (_d = doc.data()) === null || _d === void 0 ? void 0 : _d.tripName;
            return admin_1.db
                .doc(`/users/${req.body.recipient}`)
                .get()
                .then((doc) => {
                if (!doc.exists) {
                    return res
                        .status(404)
                        .json({ invite: 'There is no user with that handle' });
                }
                else {
                    return admin_1.db
                        .doc(`/trips/${req.params.tripID}`)
                        .update({
                        pendingInvites: admin_1.admin.firestore.FieldValue.arrayUnion(req.body.recipient),
                    })
                        .then(() => {
                        inviteData.tripName = tripName;
                        return admin_1.db.collection('invites').add(inviteData);
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
exports.inviteUser = inviteUser;
// Accept Invite
const acceptInvite = (req, res) => {
    admin_1.db.doc(`/trips/${req.params.tripID}`)
        .get()
        .then((doc) => {
        var _a, _b;
        if (!doc.exists) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        if ((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.members.includes(req.user.handle)) {
            return res
                .status(404)
                .json({ invite: 'That user is already a trip member' });
        }
        if (!((_b = doc.data()) === null || _b === void 0 ? void 0 : _b.pendingInvites.includes(req.user.handle))) {
            return res
                .status(404)
                .json({ invite: 'That user has not been invited to the trip' });
        }
        else {
            return admin_1.db
                .doc(`/trips/${req.params.tripID}`)
                .update({
                pendingInvites: admin_1.admin.firestore.FieldValue.arrayRemove(req.user.handle),
                members: admin_1.admin.firestore.FieldValue.arrayUnion(req.user.handle),
            })
                .then(() => {
                return admin_1.db
                    .doc(`/invites/${req.params.inviteID}`)
                    .get()
                    .then((doc) => {
                    var _a;
                    if (!doc.exists) {
                        return res.status(404).json({ error: 'Invite not found' });
                    }
                    if (((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.recipient) !== req.user.handle) {
                        return res.status(403).json({ error: 'Unauthorized' });
                    }
                    else {
                        return admin_1.db.doc(`/invites/${req.params.inviteID}`).delete();
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
exports.acceptInvite = acceptInvite;
// Reject Invite
const rejectInvite = (req, res) => {
    admin_1.db.doc(`/trips/${req.params.tripID}`)
        .get()
        .then((doc) => {
        var _a, _b;
        if (!doc.exists) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        if ((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.members.includes(req.user.handle)) {
            return res
                .status(404)
                .json({ invite: 'That user is already a trip member' });
        }
        if (!((_b = doc.data()) === null || _b === void 0 ? void 0 : _b.pendingInvites.includes(req.user.handle))) {
            return res
                .status(404)
                .json({ invite: 'That user has not been invited to the trip' });
        }
        else {
            return admin_1.db
                .doc(`/trips/${req.params.tripID}`)
                .update({
                pendingInvites: admin_1.admin.firestore.FieldValue.arrayRemove(req.user.handle),
            })
                .then(() => {
                return admin_1.db
                    .doc(`/invites/${req.params.inviteID}`)
                    .get()
                    .then((doc) => {
                    var _a;
                    if (!doc.exists) {
                        return res.status(404).json({ error: 'Invite not found' });
                    }
                    if (((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.recipient) !== req.user.handle) {
                        return res.status(403).json({ error: 'Unauthorized' });
                    }
                    else {
                        return admin_1.db.doc(`/invites/${req.params.inviteID}`).delete();
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
exports.rejectInvite = rejectInvite;
//# sourceMappingURL=invites.js.map