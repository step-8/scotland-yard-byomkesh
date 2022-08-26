const authJoinRequest = lobbies => (req, res, next) => {
  const { gameId } = req.query; // will change to lobby id in frontend later.

  const lobbyId = +gameId;
  const lobby = lobbies.findLobby(lobbyId);

  if (!lobby) {
    return res
      .cookie('joinError', 'Invalid room id !')
      .redirect('/');
  }

  if (lobby.isLobbyFull()) {
    return res
      .cookie('joinError', 'Room is already full')
      .redirect('/');
  }

  if (lobby.isLobbyClosed) {
    return res
      .cookie('joinError', 'Room is not available anymore')
      .redirect('/');
  }

  next();
};

module.exports = { authJoinRequest };
