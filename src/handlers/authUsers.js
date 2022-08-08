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

module.exports = { signupHandler, credentialCheck };
