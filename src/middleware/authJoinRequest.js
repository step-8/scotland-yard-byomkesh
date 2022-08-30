const authJoinRequest = lobbies => (req, res, next) => {
  const { lobbyId } = req.query;

  const lobby = lobbies.findLobby(+lobbyId);

  if (!lobby) {
    return res
      .cookie('joinError', 'Invalid game ID !')
      .redirect('/');
  }

  if (lobby.isLobbyClosed) {
    return res
      .cookie('joinError', 'Game is not available anymore')
      .redirect('/');
  }

  if (lobby.isLobbyFull()) {
    return res
      .cookie('joinError', 'Game is full')
      .redirect('/');
  }

  next();
};

module.exports = { authJoinRequest };
