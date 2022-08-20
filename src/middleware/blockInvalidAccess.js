const redirectToLobby = (req, res, next) => {
  const { game } = req.session;
  if (!game || req.url === '/lobby') {
    next();
    return
  }

  if (game.isInLobby()) {
    res.redirect('/lobby');
    return;
  }
  next();
}

const redirectToGame = (req, res, next) => {
  const { game } = req.session;
  if (!game || req.url === '/game') {
    next();
    return
  }

  if (game.isStarted) {
    res.redirect('/game');
    return;
  }
  next();
}

module.exports = { redirectToLobby, redirectToGame };
