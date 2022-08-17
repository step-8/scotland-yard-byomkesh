const fs = require('fs');

const { initApp } = require('./src/app.js');
const { parsed } = require('dotenv').config();
const { Users } = require('./src/models/users.js');
const expressSession = require('express-session');
const { Games } = require('./src/models/games.js');

const config = {
  mode: parsed.NODE_ENV,
  views: parsed.VIEWS,
  cookieKey: parsed.COOKIE_KEY,
  userDb: parsed.USERS_DB,
  stops: parsed.STOPS
};

const startServer = port => {
  const userJson = JSON.parse(fs.readFileSync(config.userDb, 'utf8'));
  const stopsJson = JSON.parse(fs.readFileSync(config.stops, 'utf8'));
  const users = new Users(userJson);
  const games = new Games(stopsJson);
  const session = expressSession({
    secret: config.cookieKey, resave: false, saveUninitialized: false
  });

  const app = initApp(config, users, games, session, fs.writeFileSync);

  app.listen(port, () => {
    console.log(`Listening on the Port : ${port}`);
  });
};

const PORT = process.env.PORT || 8000;
startServer(PORT);
