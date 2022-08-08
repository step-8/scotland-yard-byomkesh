const { BAD_REQUEST } = require('../utils/responseCodes.js');

const credentialCheck = (req, res, next) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(BAD_REQUEST).end();
  }
  next();
};

const signupHandler = (users) => (req, res) => {
  const { username, password } = req.body;
  const isAdded = users.addUser(username, password);
  if (!isAdded) {
    return res.status(BAD_REQUEST).end();
  }
  res.end();
};

const validateInput = (req, res, next) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    res.cookie('loginError', 'Please enter all credentials', { path: '/login' });
    res.redirect(req.url);
    return;
  }
  next();
};

const loginHandler = (users) => (req, res) => {
  const { username, password } = req.body;
  if (users.authUser(username, password)) {
    res.redirect('/');
    return;
  }
  res.cookie('loginError', 'Invalid credentials', { path: '/login' });
  res.redirect(req.url);
};

module.exports = { signupHandler, credentialCheck, validateInput, loginHandler };
