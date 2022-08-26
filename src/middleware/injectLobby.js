const injectLobby = (lobbies) => (req, res, next) => {
  const { lobbyId } = req.session;
  if (!lobbyId) {
    return next();
  }
  const lobby = lobbies.findLobby(lobbyId);
  req.session.lobby = lobby;
  next();
};

module.exports = { injectLobby };
