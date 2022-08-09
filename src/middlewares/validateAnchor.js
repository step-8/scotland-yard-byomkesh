const validateAnchor = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    req.session.redirectTo = '/host';
    res.redirect('/login');
    return;
  }
  const gameId = 1;
  req.session.gameId = gameId;
  res.redirect(`/lobby/${gameId}`);
};

module.exports = { validateAnchor };
