const serveLandingPage = (views) => (req, res) => {
  const filename = 'index.html';
  res.sendFile(filename, { root: views });
};

const serveLobby = (views) => (req, res) => {
  const filename = 'lobby.html';
  res.sendFile(filename, { root: views });
};

module.exports = { serveLandingPage, serveLobby };
