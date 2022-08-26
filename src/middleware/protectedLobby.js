const protectedLobby = (req, res, next) => {
  const { lobbyId, lobby } = req.session;
  if (!lobbyId) {
    res.redirect('/');
    return;
  }
  if (lobby.isLobbyClosed) {
    res.redirect('/lobby');
    return;
  }
  next();
};

module.exports = { protectedLobby };
