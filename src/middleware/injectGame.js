const injectGame = (games) => (req, res, next) => {
  const { gameId } = req.session;
  if (!gameId) {
    return next();
  }
  const game = games.findGame(gameId);
  req.session.game = game;
  next();
};

const injectGameId = games => (req, _, next) => {
  const { username } = req.session;
  const playerGameId = games.findPlayerGameId(username);

  if (playerGameId) {
    req.session.gameId = playerGameId;
  }
  next();
};

module.exports = { injectGame, injectGameId };
