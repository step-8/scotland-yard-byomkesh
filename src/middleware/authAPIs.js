const authApi = (req, res, next) => {
  if (!req.session.username) {
    return res.status(401).end();
  }
  next();
};

module.exports = { authApi };
