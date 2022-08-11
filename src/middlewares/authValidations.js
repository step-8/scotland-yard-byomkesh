const credentialCheck = (req, res, next) => {
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  if (!(username && password)) {
    return res
      .cookie('signuperror', 'Please enter all credentials')
      .redirect(req.url);
  }
  next();
};

const validateInput = (req, res, next) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    res.cookie('loginError', 'Please enter all credentials', { path: '/login' }).redirect(req.url);
    return;
  }
  next();
};

const authenticateUser = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    res.redirect('/login');
    return;
  }
  next();
};

module.exports = { credentialCheck, validateInput, authenticateUser };
