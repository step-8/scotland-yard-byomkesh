const expressSession = require('express-session');
const { SessionStore } = require('../sessionStore/store.js');

const createExpressSession = (datastore, cookieKey) => {
  return expressSession({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    store: new SessionStore(datastore)
  });
};

module.exports = { createExpressSession };
