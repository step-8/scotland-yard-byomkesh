const serveUsername = (req, res) => {
  const { username, lobbyId } = req.session;
  if (username) {
    res.json({ username, lobbyId });
    return;
  }
  res.status(200).json({});
};

module.exports = { serveUsername };
