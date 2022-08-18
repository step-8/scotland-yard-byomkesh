const validStops = (req, res) => {
  const { username, game } = req.session;
  res.json(game.getValidStops(username));
};

const movePlayer = persistGames => (req, res) => {
  const { username, game } = req.session;
  const { destination, ticket } = req.body;

  if (game.currentPlayer.username !== username) {
    return res.json({ isMoved: false });
  }
  const currentPlayer = game.findPlayer(username);
  const stops = game.stopInfo(currentPlayer.position);
  const allStops = Object.values(stops).flat();

  if (allStops.includes(destination)) {
    game.playMove(destination, ticket);
    persistGames();
    res.json({ isMoved: true });
    return;
  }

  res.json({ isMoved: false });
};

const skipTurn = persistGames => (req, res) => {
  const { game } = req.session;
  game.changeCurrentPlayer();
  persistGames();
  const currentPlayer = game.currentPlayer;
  res.json(currentPlayer);
};

module.exports = { validStops, movePlayer, skipTurn };
