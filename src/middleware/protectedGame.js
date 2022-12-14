const protectedLobby = lobbies => (req, res, next) => {
  const { username, lobbyId, lobby } = req.session;

  if (!username || !lobbyId || !lobbies.findLobby(lobbyId)) {
    res.redirect('/');
    return;
  }

  if (lobby.isLobbyClosed && req.url === '/lobby') {
    res.redirect('/game');
    return;
  }
  next();
};

const protectedGame = games => (req, res, next) => {
  const { username, gameId } = req.session;
  if (!username || !gameId || !games.findGame(gameId)) {
    res.redirect('/');
    return;
  }

  const { game } = req.session;
  if (game && req.url === '/lobby') {
    res.redirect('/game');
    return;
  }
  next();
};

module.exports = { protectedGame, protectedLobby };
