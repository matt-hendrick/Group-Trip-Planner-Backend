"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = require("./admin");
const tripAuth = (req, res, next) => {
    admin_1.db.doc(`/trips/${req.params.tripID}`)
        .get()
        .then((doc) => {
        var _a;
        if (!doc.exists) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        if (!((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.members.includes(req.user.handle))) {
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
exports.default = tripAuth;
//# sourceMappingURL=tripAuth.js.map