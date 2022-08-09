const authJoinRequest = games => (req, res, next) => {
  const { gameId } = req.query;
  const game = games.findGame(gameId);

  if (!game) {
    return res
      .cookie('joinError', 'Invalid room id !')
      .redirect('/');
  }

  if (game.isGameFull()) {
    return res
      .cookie('joinError', 'Game is full')
      .redirect('/');
  }

  next();
};

module.exports = { authJoinRequest };
