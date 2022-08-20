const blockInvalidAccess = (req, res, next) => {
  const validUrl = ['/lobby'];
  if (!req.session.game || validUrl.includes(req.url)) {
    next();
    return;
  }

  const { isGameStarted } = req.session.game.getStatus();

  if (!isGameStarted) {
    res.redirect('/lobby');
    return;
  }
  next();
};

module.exports = { blockInvalidAccess };
