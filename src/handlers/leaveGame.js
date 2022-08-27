const makePlayerLeft = (game, player) => {
  game.addAsLeft(player);
  if (player.isMrX()) {
    game.gameOver(7);
    return;
  }
  if (game.areAllDetectivesLeft()) {
    game.gameOver(11);
  }
};

const addPlayerAsLeft = (game, username) => {
  const leftPlayer = game.findPlayer(username);
  makePlayerLeft(game, leftPlayer);
};

const leaveGame = (persistGames) => (req, res) => {
  const { session } = req;
  const { username, game, gameId } = session;

  addPlayerAsLeft(game, username);

  delete session.gameId;
  delete session.game;

  persistGames(gameId, () => {
    res.redirect('/');
  });
};

module.exports = { leaveGame, makePlayerLeft, addPlayerAsLeft };
