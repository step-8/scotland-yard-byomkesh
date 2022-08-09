const protectedLobby = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    res.redirect('/');
    return;
  }
  next();
};

module.exports = { protectedLobby };
