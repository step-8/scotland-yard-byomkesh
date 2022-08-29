const injectGame = (games) => (req, res, next) => {
  const { gameId } = req.session;
  if (!gameId) {
    return next();
  }
  const game = games.findGame(gameId);
  req.session.game = game;
  next();
};

const findGameOfPlayer = (games, username) => {
  const allGames = games.getAllGames();
  return allGames.find(game => {
    const { players } = game.getStatus();
    return players.some(
      player => {
        return player.username === username
          && !game.hasPlayerLeft(username);
      }
    );
  });
};

const injectGameId = games => (req, _, next) => {
  const { username } = req.session;
  // const currentPlayerGame = findGameOfPlayer(games, username);
  const currentPlayerGame = findGameOfPlayer(games, username);

  if (currentPlayerGame) {
    req.session.gameId = currentPlayerGame.gameId;

    // res.redirect('/game');
    // return;
  }
  next();
};

module.exports = { injectGame, injectGameId };
