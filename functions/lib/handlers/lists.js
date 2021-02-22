"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeListItem = exports.likeListItem = exports.deleteListItem = exports.createListItem = void 0;
const admin_1 = require("../utility/admin");
// Create an List Item
const createListItem = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'List item body must not be empty' });
    }
    const newListItem = {
        body: req.body.body,
        link: req.body.link ? req.body.link : null,
        price: req.body.price ? req.body.price : null,
        location: req.body.location ? req.body.location : null,
        date: req.body.date ? req.body.date : null,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
        likes: [],
        tripID: req.params.tripID,
        listType: req.body.listType,
    };
    admin_1.db.collection(`/trips/${req.params.tripID}/listitems`)
        .add(newListItem)
        .then((doc) => {
        const resListItem = newListItem;
        resListItem.listItemID = doc.id;
        res.json(resListItem);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Something went wrong' });
        console.error(err);
    });
};
exports.createListItem = createListItem;
// Delete List Item
const deleteListItem = (req, res) => {
    admin_1.db.doc(`/trips/${req.params.tripID}/listitems/${req.params.listItemID}`)
        .get()
        .then((doc) => {
        var _a;
        if (!doc.exists) {
            return res.status(404).json({ error: 'List Item not found' });
        }
        else if (((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.userHandle) !== req.user.handle) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        else {
            return admin_1.db
                .doc(`/trips/${req.params.tripID}/listitems/${req.params.listItemID}`)
                .delete()
                .then(() => {
                res.json({ message: 'List Item deleted successfully' });
            });
        }
    })
        .catch((err) => {
        res.status(500).json({ error: 'Something went wrong' });
        console.error(err);
    });
};
exports.deleteListItem = deleteListItem;
// Like List Item
const likeListItem = (req, res) => {
    const likeDocument = admin_1.db.doc(`/trips/${req.params.tripID}/listitems/${req.params.listItemID}`);
    likeDocument
        .get()
        .then((doc) => {
        var _a;
        if ((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.likes.includes(req.user.handle)) {
            return res
                .status(404)
                .json({ likes: 'That user already liked that list item' });
        }
        else
            return likeDocument
                .update({
                likes: admin_1.admin.firestore.FieldValue.arrayUnion(req.user.handle),
            })
                .then(() => {
                return res.json({ message: 'List item liked' });
            });
    })
        .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
};
exports.likeListItem = likeListItem;
// Unlike List Item
const unlikeListItem = (req, res) => {
    const likeDocument = admin_1.db.doc(`/trips/${req.params.tripID}/listitems/${req.params.listItemID}`);
    likeDocument
        .get()
        .then((doc) => {
        var _a;
        if (!((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.likes.includes(req.user.handle))) {
            return res
                .status(404)
                .json({ likes: 'That user has not liked that list item' });
        }
        else
            return likeDocument
                .update({
                likes: admin_1.admin.firestore.FieldValue.arrayRemove(req.user.handle),
            })
                .then(() => {
                return res.json({ message: 'List item unliked' });
            });
    })
        .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
};
exports.unlikeListItem = unlikeListItem;
//# sourceMappingURL=lists.js.map