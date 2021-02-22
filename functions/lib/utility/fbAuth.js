"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = require("./admin");
const fbAuth = (req, res, next) => {
    let idToken;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    }
    else {
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized' });
    }
    admin_1.admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
        req.user = decodedToken;
        return admin_1.db
            .collection('users')
            .where('userID', '==', req.user.uid)
            .limit(1)
            .get();
    })
        .then((data) => {
        req.user.handle = data.docs[0].data().handle;
        return next();
    })
        .catch((err) => {
        console.error('Error while verifying token', err);
        return res.status(403).json(err);
    });
};
exports.default = fbAuth;
//# sourceMappingURL=fbAuth.js.map