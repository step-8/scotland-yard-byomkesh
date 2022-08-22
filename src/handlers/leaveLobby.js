const removePlayer = (session) => {
  const { username, game } = session;
  game.removePlayer(username);
  delete session.gameId;
  delete session.game;
};

const leaveLobby = (games, persistGames, gamesStore) => (req, res) => {
  const { session } = req;
  const { gameId, game } = session;

  removePlayer(session, persistGames);

  if (!game.canGameSustain()) {
    games.deleteGame(gameId);
    gamesStore.delete(gameId).then(() => {
      res.redirect('/');
    });
    return;
  }

  persistGames(gameId, () => {
    res.redirect('/');
  });

};

module.exports = { leaveLobby };