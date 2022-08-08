const express = require('express');
const morgan = require('morgan');
const { credentialCheck, signupHandler } = require('./handlers/authUsers.js');

const initApp = (config, users) => {
  const app = express();
  const { mode, views } = config;

  if (mode === 'dev') {
    app.use(morgan('tiny'));
  }

  app.use(express.urlencoded({ extended: true }));

  app.get('/signup', (req, res) => {
    res.sendFile('signup.html', { root: views });
  });

  app.post('/signup', credentialCheck, signupHandler(users));
  return app;
};

module.exports = { initApp };
