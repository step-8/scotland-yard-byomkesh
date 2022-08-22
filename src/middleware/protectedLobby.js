const protectedLobby = (req, res, next) => {
  const { gameId, game } = req.session;
  if (!gameId) {
    res.redirect('/');
    return;
  }
  if (game.isStarted) {
    res.redirect('/lobby');
    return;
  }
  next();
};

module.exports = { protectedLobby };
