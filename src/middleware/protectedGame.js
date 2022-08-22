const protectedGame = games => (req, res, next) => {
  const { username, gameId } = req.session;
  if (!username || !gameId || !games.findGame(gameId)) {
    res.redirect('/');
    return;
  }

  if (req.session.game.isStarted && req.url === '/lobby') {
    res.redirect('/game');
    return;
  }
  next();
};

module.exports = { protectedGame };
