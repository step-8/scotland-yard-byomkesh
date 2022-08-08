const validateAnchor = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    req.session.redirectTo = '/host';
    res.redirect('/login');
    return;
  }
  next();
};

module.exports = { validateAnchor };
