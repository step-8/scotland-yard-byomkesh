const redirectToLobby = (req, res, next) => {
  const { lobbyId } = req.session;

  if (req.url === '/lobby') {
    next();
    return;
  }

  if (lobbyId) {
    res.redirect('/lobby');
    return;
  }
  next();
};

const redirectToGame = (req, res, next) => {
  const { game } = req.session;
  if (!game || req.url === '/game') {
    next();
    return;
  }

  res.redirect('/game');
};

module.exports = { redirectToLobby, redirectToGame };
