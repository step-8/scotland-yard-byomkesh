const serveLandingPage = (views) => (req, res) => {
  const filename = 'index.html';
  res.sendFile(filename, { root: views });
};

const serveSignupPage = (views) => (req, res) => {
  res.sendFile('signup.html', { root: views });
};

module.exports = { serveLandingPage, serveSignupPage };
