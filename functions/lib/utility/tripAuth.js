"use strict";
const { db } = require('./admin');
module.exports = (req, res, next) => {
    db.doc(`/trips/${req.params.tripID}`)
        .get()
        .then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        if (!doc.data().members.includes(req.user.handle)) {
            return res.status(403).json({ user: 'User is not a trip member' });
        }
        else
            return next();
    })
        .catch((err) => {
        console.error('Error while verifying trip', err);
        return res.status(403).json(err);
    });
};
//# sourceMappingURL=tripAuth.js.map