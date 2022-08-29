const leaveGame = (persistGames) => (req, res) => {
  const { session } = req;
  const { username, game, gameId } = session;

  game.addToInactive(username);

  delete session.gameId;
  delete session.game;

  persistGames(gameId, () => {
    res.redirect('/');
  });
};

module.exports = { leaveGame };
