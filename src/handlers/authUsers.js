const protectedAuth = (req, res, next) => {
  const { username } = req.session;
  if (username) {
    return res.redirect('/');
  }
  next();
};

const signupHandler = (users, userDb, writeFile) => (req, res) => {
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

  writeFile(userDb, users.toJson(), 'utf8');
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

const logoutHandler = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
};

module.exports = { signupHandler, protectedAuth, loginHandler, logoutHandler };
