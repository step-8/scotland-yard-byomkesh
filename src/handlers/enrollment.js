const sendConnectionError = (req, res) => {
  const message = 'You are already in a Game';
  res.cookie('connError', message, { maxAge: 1000 });
  res.redirect(302, '/');
};

const isInGame = (username, games, lobbies) => {
  return games.isPlayerInGame(username) || lobbies.isPlayerInLobby(username);
};

const hostGame = (games, lobbies, persistLobbies) => (req, res) => {
  const { username } = req.session;
  if (isInGame(username, games, lobbies)) {
    sendConnectionError(req, res);
    return;
  }
  const limit = { min: 3, max: 6 };
  const lobby = lobbies.createLobby(username, limit);
  const lobbyId = lobby.lobbyId;

  req.session.lobbyId = lobbyId;
  req.session.lobby = lobby;

  persistLobbies(lobbyId, () => {
    res.redirect('/lobby');
  });
};
const joinGame = (games, lobbies, persistLobbies) => (req, res) => {
  const { username } = req.session;
  if (isInGame(username, games, lobbies)) {
    sendConnectionError(req, res);
    return;
  }

  const { lobbyId } = req.query;
  const lobby = lobbies.findLobby(+lobbyId);
  lobby.addJoinee(username);

  req.session.lobbyId = +lobbyId;
  req.session.lobby = lobby;

  persistLobbies(+lobbyId, () => {
    res.redirect('/lobby');
  });
};

module.exports = { hostGame, joinGame };
