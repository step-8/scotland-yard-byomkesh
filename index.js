const fs = require('fs');
const fsPromise = require('fs/promises');
const redis = require('redis');

const { initApp } = require('./src/app.js');
const { parsed } = require('dotenv').config();
const { Users } = require('./src/models/users.js');
const expressSession = require('express-session');
const { Games } = require('./src/models/games.js');
const { SessionStore } = require('./src/sessionStore/store.js');
const Datastore = require('./src/models/datastore.js');

const config = {
  mode: parsed.NODE_ENV,
  views: parsed.VIEWS,
  cookieKey: parsed.COOKIE_KEY,
  stops: parsed.STOPS,
  redis: {
    host: parsed.REDIS_HOSTNAME,
    username: parsed.REDIS_USERNAME,
    password: parsed.REDIS_PASSWORD,
    port: parsed.REDIS_PORT
  }
};

const createRedisClient = () => {
  const { port } = config.redis;
  if (config.mode === 'production') {
    const { host, password, username } = config.redis;
    const url = `redis://${username}:${password}@${host}.redis.server:${port}`;

    return redis.createClient({ url });
  }

  return redis.createClient(port);
};

const createExpressSession = (datastore) => {
  return expressSession({
    secret: config.cookieKey,
    resave: false,
    saveUninitialized: false,
    store: new SessionStore(datastore)
  });
};

const getUsers = (usersStore) => {
  return usersStore.getAll()
    .then((rawUsers) => {
      const usersData = Object.entries(rawUsers)
        .reduce((usersData, [username, obj]) => {
          usersData[username] = JSON.parse(obj);

          return usersData;
        }, {});

      return new Users(usersData);
    })
};

const getGamesInfo = (gamesStore) => {
  return gamesStore.getAll().then((rawGamesObj) => {
    return Object.entries(rawGamesObj)
      .reduce((gamesData, [key, value]) => {
        if (key === 'newGameId') {
          gamesData.newGameId = value;
          return gamesData;
        }

        gamesData.games.push(JSON.parse(value));
        return gamesData;
      }, { games: [], newGameId: 1 });
  });
}

const createStores = (client) => {
  const usersStore = new Datastore('users', client);
  const gamesStore = new Datastore('games', client);
  return { usersStore, gamesStore };
};

const startServer = port => {
  let users, games, client, stores = {};

  fsPromise.readFile(config.stops, 'utf8')
    .then(value => JSON.parse(value))
    .then((stopsData) => games = new Games(stopsData))
    .then(() => {
      client = createRedisClient();
    })
    .then(() => client.connect())

    .then(() => {
      stores = createStores(client);
    })

    .then(() => getUsers(stores.usersStore))
    .then((usersData) => users = usersData)

    .then(() => getGamesInfo(stores.gamesStore))
    .then((gamesData) => games.init(gamesData))

    .then(() => createExpressSession(new Datastore('session', client)))
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
startServer(PORT);
