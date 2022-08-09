const hostGame = (games) => (req, res) => {
  const game = games.createGame();
  req.session.gameId = game.gameId;
  res.redirect(`/lobby/${req.session.gameId}`);
  return;
};

module.exports = { hostGame };
