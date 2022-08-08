const serveLandingPage = (views) => (req, res) => {
  const filename = 'index.html';
  res.sendFile(filename, { root: views });
};

const serveLobby = (views) => (req, res) => {
  const filename = 'lobby.html';
  res.sendFile(filename, { root: views });
};

const serveSignupPage = (views) => (req, res) => {
  res.sendFile('signup.html', { root: views });
};

const serveLoginPage = (views) => (req, res) => {
  res.sendFile('login.html', { root: views });
};

module.exports = { serveLandingPage, serveSignupPage, serveLobby, serveLoginPage };
