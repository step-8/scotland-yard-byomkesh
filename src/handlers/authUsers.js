const credentialCheck = (req, res, next) => {
  // const { username, password } = req.body;
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  if (!(username && password)) {
    return res
      .cookie('signuperror', 'Invalid credentials.')
      .redirect(req.url);
  }
  next();
};

const protectedAuth = (req, res, next) => {
  const { username } = req.session;
  if (username) {
    return res.redirect('/');
  }
  next();
};

const signupHandler = (users) => (req, res) => {
  const { username, password } = req.body;
  const isAdded = users.addUser(username, password);
  if (!isAdded) {
    return res
      .cookie('signuperror', 'User already exist.')
      .redirect('/signup');
  }
  req.session.username = username;
  const pathToRedirect = req.session.redirectTo || '/';
  res.redirect(pathToRedirect);
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
    req.session.username = username;
    const pathToRedirect = req.session.redirectTo || '/';
    res.redirect(pathToRedirect);
    return;
  }
  res.cookie('loginError', 'Invalid credentials', { path: '/login' });
  res.redirect(req.url);
};

module.exports = { signupHandler, credentialCheck, protectedAuth, validateInput, loginHandler };
