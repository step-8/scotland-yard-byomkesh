const express = require('express');

const authLib = require('../handlers/authUsers.js');
const { signupHandler, protectedAuth } = authLib;
const { loginHandler, logoutHandler } = authLib;

const pagesLib = require('../handlers/servePages.js');
const { serveLoginPage, serveSignupPage } = pagesLib;

const authValidators = require('../middlewares/authValidations.js');
const { credentialCheck, validateInput } = authValidators;

const createAuthRouter = (users, userDb, views, writeFile) => {
  const authRouter = express.Router();
  const authRoutes = ['/login', '/signup'];

  authRouter.use(authRoutes, protectedAuth)

  authRouter.get('/signup', serveSignupPage(views));
  const signup = signupHandler(users, userDb, writeFile);
  authRouter.post('/signup', credentialCheck, signup);

  authRouter.get('/login', serveLoginPage(views));
  authRouter.post('/login', validateInput, loginHandler(users));
  authRouter.get('/logout', logoutHandler);

  return authRouter;
};

module.exports = { createAuthRouter };
