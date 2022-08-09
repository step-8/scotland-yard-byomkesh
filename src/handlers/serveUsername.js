const serveUsername = (req, res) => {
  const { username, gameId } = req.session;
  if (username) {
    res.json({ username, gameId });
    return;
  }
  res.status(401).json({});
  return;
};

module.exports = { serveUsername };
