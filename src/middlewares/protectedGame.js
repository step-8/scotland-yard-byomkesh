const protectedGame = (req, res, next) => {
  const { username, gameId } = req.session;
  if (!username || !gameId) {
    res.redirect('/');
    return;
  }
  if (req.session.game.isStarted) {
    res.redirect('/game')
  }
  next();
};

module.exports = { protectedGame };
