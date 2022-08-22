const fsPromise = require('fs/promises');

const { initApp } = require('./src/app.js');
const { parsed } = require('dotenv').config();

const { getGamesInfo } = require('./src/utils/createGames.js');
const { getUsers } = require('./src/utils/createUsers.js');
const { Games } = require('./src/models/games.js');
const Datastore = require('./src/models/datastore.js');
const { createRedisClient } = require('./src/utils/redis.js');
const { createExpressSession } = require('./src/utils/session.js');

const CONFIG = {
  mode: parsed.NODE_ENV,
  views: parsed.VIEWS,
  cookieKey: parsed.COOKIE_KEY,
  stops: parsed.STOPS
};

const createStores = (client) => {
  const usersStore = new Datastore('users', client);
  const gamesStore = new Datastore('games', client);

  return { usersStore, gamesStore };
};

const startServer = (port, config) => {
  let users, games, client, stores = {};

  fsPromise.readFile(config.stops, 'utf8')
    .then(value => JSON.parse(value))
    .then((stopsData) => {
      games = new Games(stopsData);
    })
    .then(() => {
      client = createRedisClient();
    })
    .then(() => client.connect())

    .then(() => {
      stores = createStores(client);
    })

    .then(() => getUsers(stores.usersStore))
    .then((usersData) => {
      users = usersData;
    })

    .then(() => getGamesInfo(stores.gamesStore))
    .then((gamesData) => games.init(gamesData))

    .then(() => {
      const sessionStore = new Datastore('session', client);
      return createExpressSession(sessionStore);
    })

    .then((session) => initApp(config, users, games, session, stores))
    .then((app) => {
      app.listen(port, () => console.log(`Listening on the Port : ${port}`));
    })
    .catch((err) => {
      console.log(`Failed to start server\n${err}`);
      client && client.disconnect();
    });
};

const PORT = process.env.PORT;
startServer(PORT, CONFIG);
