const protectedGame = (req, res, next) => {
  const { username, gameId } = req.session;
  if (!username || !gameId) {
    res.redirect('/');
    return;
  }
  next();
};

module.exports = { protectedGame };
