const serveUsername = (req, res) => {
  console.log(req.session);
  const { username } = req.session;
  if (username) {
    res.json({ username });
    return;
  }
  res.status(401).json({});
  return;
};

module.exports = { serveUsername };
