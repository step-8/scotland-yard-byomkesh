const injectGame = (games) => (req, res, next) => {
  const { gameId } = req.session;
  const game = games.findGame(gameId);
  req.session.game = game;
  next();
};

module.exports = { injectGame };
