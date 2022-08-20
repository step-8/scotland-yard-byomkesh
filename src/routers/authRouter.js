const express = require('express');

const authLib = require('../handlers/authUsers.js');
const { signupHandler, protectedAuth } = authLib;
const { loginHandler, logoutHandler } = authLib;

const pagesLib = require('../handlers/servePages.js');
const { serveLoginPage, serveSignupPage } = pagesLib;

const authValidators = require('../middleware/authValidations.js');
const { redirectToGame, redirectToLobby } = require('../middleware/blockInvalidAccess.js');
const { credentialCheck, validateInput } = authValidators;

const createAuthRouter = (users, views, persistUser) => {
  const authRouter = express.Router();
  const authRoutes = ['/login', '/signup'];

  authRouter.use(authRoutes, protectedAuth)

  authRouter.get('/signup', serveSignupPage(views));
  const signup = signupHandler(users, persistUser);
  authRouter.post('/signup', credentialCheck, signup);

  authRouter.get('/login', serveLoginPage(views));
  authRouter.post('/login', validateInput, loginHandler(users));
  authRouter.get('/logout', redirectToGame, redirectToLobby, logoutHandler);

  return authRouter;
};

module.exports = { createAuthRouter };
