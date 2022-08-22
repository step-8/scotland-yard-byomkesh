const leaveLobby = persistGames => (req, res) => {
  const { session } = req;
  const { username, game, gameId } = session;

  if (game.isHost(username)) {
    res.redirect('/');
    return;
  };

  game.removePlayer(username);
  delete session.gameId;
  delete session.game;

  persistGames(gameId, () => {
    res.redirect('/');
  });

};

module.exports = { leaveLobby };