const { mrX } = require("../utils/roles");

const validStops = (req, res) => {
  const { username, game } = req.session;
  const players = game.getPlayers();
  const requestedPlayer = game.findPlayer(username).info;
  const stops = game.stopInfo(requestedPlayer.currentPosition);

  players.forEach(player => {
    if (player.role === mrX) {
      return;
    }
    Object.keys(stops).forEach((route) => {
      const index = stops[route].indexOf(player.currentPosition);
      if (index >= 0) {
        stops[route].splice(index, 1);
      }
    });
  });

  res.json(stops);
};

const movePlayer = (req, res) => {
  const { username, game } = req.session;
  const { destination, ticket } = req.body;

  if (game.currentPlayer.username !== username) {
    return res.json({ isMoved: false });
  }
  const currentPlayer = game.findPlayer(username);
  const stops = game.stopInfo(currentPlayer.position);
  const allStops = Object.values(stops).flat();

  if (allStops.includes(destination)) {
    // currentPlayer.updatePosition(destination);
    // currentPlayer.updateTicket(ticket);
    game.playMove(destination, ticket);

    // game.changeCurrentPlayer();
    res.json({ isMoved: true });
    return;
  }

  res.json({ isMoved: false });

};

module.exports = { validStops, movePlayer };