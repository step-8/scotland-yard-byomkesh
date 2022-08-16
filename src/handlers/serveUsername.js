const serveUsername = (req, res) => {
  const { username, gameId } = req.session;
  if (username) {
    res.json({ username, gameId });
    return;
  }
  res.status(200).json({});
};

module.exports = { serveUsername };
