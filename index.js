const { initApp } = require('./src/app.js');
const { parsed } = require('dotenv').config();
const { Users } = require('./src/models/users.js');
const expressSession = require('express-session');
const { Games } = require('./src/models/games.js');

const config = {
  mode: parsed.NODE_ENV,
  views: parsed.VIEWS,
  cookieKey: parsed.COOKIE_KEY
};

const startServer = port => {
  const users = new Users();
  const games = new Games();
  const session = expressSession({
    secret: config.cookieKey, resave: false, saveUninitialized: false
  });

  const app = initApp(config, users, games, session);

  app.listen(port, () => console.log(`Listening on the Port : ${port}`));
};

const PORT = 8000;

startServer(PORT);
