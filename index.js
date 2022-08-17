const fs = require('fs');
const fsPromise = require('fs/promises');

const { initApp } = require('./src/app.js');
const { parsed } = require('dotenv').config();
const { Users } = require('./src/models/users.js');
const expressSession = require('express-session');
const { Games } = require('./src/models/games.js');
const { SessionStore } = require('./src/sessionStore/store.js');

const config = {
  mode: parsed.NODE_ENV,
  views: parsed.VIEWS,
  cookieKey: parsed.COOKIE_KEY,
  userDb: parsed.USERS_DB,
  stops: parsed.STOPS,
  gamesDb: parsed.GAMES_DB,
  sessionFile: parsed.SESSION_FILE
};

const startServer = port => {
  const userJson = JSON.parse(fs.readFileSync(config.userDb, 'utf8'));
  const stopsJson = JSON.parse(fs.readFileSync(config.stops, 'utf8'));
  const gameData = JSON.parse(fs.readFileSync(config.gamesDb, 'utf8'));
  const sessionData = JSON.parse(fs.readFileSync(config.sessionFile, 'utf8'));
  const users = new Users(userJson);
  const games = new Games(stopsJson);
  const sessionStore = new SessionStore(sessionData, (sessionData) => {
    return fsPromise.writeFile(config.sessionFile, JSON.stringify(sessionData), 'utf8');
  });
  const session = expressSession({
    secret: config.cookieKey, resave: false, saveUninitialized: false,
    store: sessionStore
  });

  games.init(gameData);
  const app = initApp(config, users, games, session, fs.writeFileSync);

  app.listen(port, () => {
    console.log(`Listening on the Port : ${port}`);
  });
};

const PORT = process.env.PORT;
startServer(PORT);
