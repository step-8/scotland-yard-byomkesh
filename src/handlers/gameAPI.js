const validStops = (req, res) => {
  const { username, game } = req.session;
  res.json(game.getValidStops(username));
};

const movePlayer = persistGames => (req, res) => {
  const { username, game, gameId } = req.session;
  const { destination, ticket } = req.body;

  if (!game.isCurrentPlayer(username)) {
    return res.json({ isMoved: false });
  }

  if (!game.isMovePossible(username, destination)) {
    res.json({ isMoved: false });
    return;
  }

  game.playMove(destination, ticket);
  persistGames(gameId, () => {
    res.json({ isMoved: true });
  });
};

const skipTurn = persistGames => (req, res) => {
  const { game, gameId } = req.session;
  game.changeCurrentPlayer();
  const currentPlayer = game.currentPlayer;
  persistGames(gameId, () => {
    res.json(currentPlayer);
  });
};

const enableTwoX = persistGames => (req, res) => {
  const { game, gameId } = req.session;
  const { round } = req.body;

  if (!game.isTwoXAvailable()) {
    return res.json({ twoXEnabled: false });
  }

  game.enableTwoX(round);
  persistGames(gameId, () => {
    res.json({ twoXEnabled: true });
  });
};

module.exports = { validStops, movePlayer, skipTurn, enableTwoX };
