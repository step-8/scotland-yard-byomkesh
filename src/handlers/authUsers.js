const protectedAuth = (req, res, next) => {
  const { username } = req.session;
  if (username) {
    return res.redirect('/');
  }
  next();
};

const signupHandler = (users, persistUser) => (req, res) => {
  const { username, password } = req.body;
  const isAdded = users.addUser(username, password);
  if (!isAdded) {
    return res
      .cookie('signuperror', 'User already exist.')
      .redirect('/signup');
  }
  const user = users.findUser(username);
  req.session.username = user.username;
  const pathToRedirect = req.session.redirectTo || '/';
  persistUser(username, password, () => {
    res.redirect(pathToRedirect);
  });

};

const loginHandler = (users) => (req, res) => {
  const { username, password } = req.body;
  if (users.authUser(username, password)) {
    const user = users.findUser(username);
    req.session.username = user.username;
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
  });
};

module.exports = { signupHandler, protectedAuth, loginHandler, logoutHandler };
