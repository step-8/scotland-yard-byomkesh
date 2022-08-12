const validStops = (req, res) => {
  const { username, game } = req.session;
  const players = game.getPlayers();
  const currentPlayer = game.findPlayer(username);
  const stops = game.stopInfo(currentPlayer.position);

  if (currentPlayer.role === 'Mr. X') {
    return res.json(stops);
  }

  players.forEach(player => {
    if (player.role === 'Mr. X') {
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

const move = (req, res) => {
  const { username, game } = req.session;
  const { destination } = req.body;

  const currentPlayer = game.findPlayer(username);
  const stops = game.stopInfo(currentPlayer.position);
  const { buses, taxies, subways, ferries } = stops;
  const allStops = buses.concat(taxies, subways, ferries);

  if (allStops.includes(destination)) {
    currentPlayer.updatePosition(destination);
    game.changeCurrentPlayer();
    res.json({ isMoved: true });
    return;
  }

  res.json({ isMoved: false });

};

module.exports = { validStops, move };