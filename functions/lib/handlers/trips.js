"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromTrip = exports.deleteTrip = exports.editTrip = exports.createTrip = exports.getTrip = void 0;
const admin_1 = require("../utility/admin");
// get data for a trip
const getTrip = (req, res) => {
    let tripData = {};
    let pinData = {};
    let listItemData = {};
    admin_1.db.doc(`/trips/${req.params.tripID}`)
        .get()
        .then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        tripData = doc.data();
        tripData.tripID = doc.id;
        return admin_1.db
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
        return admin_1.db
            .doc(`/trips/${req.params.tripID}`)
            .collection('listitems')
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
        return res.json(tripData);
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.code });
    });
};
exports.getTrip = getTrip;
// Create Trip
const createTrip = (req, res) => {
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
        itineraryItems: {},
    };
    admin_1.db.collection(`/trips`)
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
exports.createTrip = createTrip;
// Edit Trip Data
const editTrip = (req, res) => {
    if (req.body.tripName && req.body.tripName.trim() === '') {
        return res.status(400).json({ tripName: 'Trip name must not be empty' });
    }
    admin_1.db.doc(`/trips/${req.params.tripID}`)
        .update(req.body)
        .then(() => {
        return res.json({ message: 'Trip details updated successfully' });
    })
        .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
};
exports.editTrip = editTrip;
// Delete Trip
const deleteTrip = (req, res) => {
    admin_1.db.doc(`/trips/${req.params.tripID}`)
        .delete()
        .then(() => {
        res.json({ message: 'Trip deleted successfully' });
    })
        .catch((err) => {
        res.status(500).json({ error: 'Something went wrong' });
        console.error(err);
    });
};
exports.deleteTrip = deleteTrip;
// Remove User From Trip
const removeUserFromTrip = (req, res) => {
    admin_1.db.doc(`/trips/${req.params.tripID}`)
        .get()
        .then((doc) => {
        var _a;
        if (!doc.exists) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        if (!((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.members.includes(req.params.userHandle))) {
            return res
                .status(404)
                .json({ invite: 'That user is not a trip member' });
        }
        else {
            return admin_1.db
                .doc(`/trips/${req.params.tripID}`)
                .update({
                members: admin_1.admin.firestore.FieldValue.arrayRemove(req.params.userHandle),
            })
                .then(() => {
                return res.json({ message: 'User removed from trip' });
            });
        }
    })
        .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
};
exports.removeUserFromTrip = removeUserFromTrip;
//# sourceMappingURL=trips.js.map