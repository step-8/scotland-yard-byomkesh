const credentialCheck = (req, res, next) => {
  const { username, password } = req.body;
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
  res.redirect('/');
};

module.exports = { signupHandler, credentialCheck, protectedAuth };
