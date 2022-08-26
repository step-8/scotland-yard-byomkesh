// const { mrX } = require('../utils/roles.js');

const serveLobbyStats = (req, res) => {
  const { lobby, username } = req.session;

  if (!lobby) {
    return res.status(401).end();
  }

  const { joinees, isLobbyClosed } = lobby.forAPI();
  const isHost = lobby.isHost(username);
  res.json({ joinees, isLobbyClosed, isHost, username });
};

// const serveLobbyStats = (req, res) => {
//   const { game, username } = req.session;
//   if (!game) {
//     return res.status(401).end();
//   }
//   const { players, isGameStarted } = game.getStatus();
//   const currentPlayer = players.find(player =>
//     player.username === req.session.username);
//   const playerMrX = players.find(player => player.role === mrX);
//   const isHost = currentPlayer.isHost;

//   if (playerMrX && currentPlayer.role !== mrX) {
//     playerMrX.currentPosition = 'XX';
//   }

//   res.json({ players, isGameStarted, isHost, username });
// };

module.exports = { serveLobbyStats };
