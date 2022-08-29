const { Player } = require('../models/player.js');
const { roles } = require('../utils/roles.js');

const randInt = (limit) => {
  return Math.ceil(Math.random() * 1000) % limit;
};

const shuffle = (list) => {
  const shuffleLimit = Math.max(20, list.length);
  for (let index = 0; index < shuffleLimit; index++) {
    const position = randInt(list.length);
    const item = list[position];
    list.splice(position, 1);
    list.unshift(item);
  }
  return list;
};

const initialStats = (games) => (req, res) => {
  const { gameId, username, lobbyId } = req.session;
  if (lobbyId) {
    delete req.session.lobbyId;
  }

  const game = games.findGame(gameId);
  const players = game.getInitialStats(username);

  res.json({ players, user: { username } });
};

const canGameStart = (lobby, username) => {
  return lobby && lobby.canLobbyClose(username);
};

const initializeGame = (lobby, lobbyId, games) => {
  const joinees = lobby.getJoinees();
  const players = joinees.map(joinee => new Player(joinee.username));
  return games.addGame(lobbyId, players);
};

const startGameHandler = (lobbies, games, persistLobbies, persistGames) =>
  (req, res) => {
    const { lobby, lobbyId, username } = req.session;
    if (!canGameStart(lobby, username)) {
      res.json({ isStarted: false });
      return;
    }

    const game = initializeGame(lobby, lobbyId, games);
    lobby.closeLobby(username);

    const initialPositions = [
      13, 26, 29, 91, 117, 34, 50, 53, 94, 103,
      112, 123, 138, 141, 155, 174
    ];

    const shuffledPositions = shuffle(initialPositions);

    game.assignRoles(roles, shuffle);
    game.assignInitialPositions(shuffledPositions);
    game.changeGameStatus();

    persistLobbies(lobbyId, () => {
      persistGames(lobbyId, () => res.json({ isStarted: true }));
    });
  };

module.exports = { startGameHandler, initialStats };
