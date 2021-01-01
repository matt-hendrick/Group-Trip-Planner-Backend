const { db } = require('./admin');

module.exports = (req, res, next) => {
  db.doc(`/groups/${req.params.groupID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Group not found' });
      }
      if (!doc.data().members.includes(req.user.handle)) {
        return res.status(403).json({ user: 'User is not a group member' });
      } else return next();
    })
    .catch((err) => {
      console.error('Error while verifying group', err);
      return res.status(403).json(err);
    });
};
