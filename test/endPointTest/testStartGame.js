const request = require('supertest');
const expressSession = require('express-session');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const Datastore = require('../../src/models/datastore.js');
const { Lobbies } = require('../../src/models/lobbies.js');

let app, sessionId, games, lobbies;

const mockClient = () => {
  const p = new Promise((res) => res());
  return { hGet: () => p, hSet: () => p, hDel: () => p };
};

const initTestApp = () => {
  const config = { mode: 'test', views: './views' };
  const root = { root: { username: 'root', password: 'root' } };
  const users = new Users(root);
  lobbies = new Lobbies();
  games = new Games();
  const session = expressSession({
    secret: 'test', resave: false, saveUninitialized: false
  });

  const stores = {
    lobbiesStore: new Datastore('lobbies', mockClient()),
    gamesStore: new Datastore('games', mockClient()),
    usersStore: new Datastore('users', mockClient()),
  };
  app = request(initApp(config, users, games, session, stores, lobbies));
  return app;
};

const captureLoginCookie = (done) => {
  app.post('/login')
    .send('username=root&password=root')
    .end((_, res) => {
      sessionId = res.header['set-cookie'];
      done();
    });
};

const hostGame = (done) => {
  app.get('/host')
    .set('cookie', sessionId)
    .end(done);
};

describe('Start Game', () => {

  beforeEach(initTestApp);
  beforeEach(captureLoginCookie);
  beforeEach(hostGame);

  it('should not start game if session is not present', (done) => {
    app.post('/api/start')
      .expect(401, done);
  });

  it('should not start if players are less than 3', (done) => {
    app.post('/api/start')
      .set('cookie', sessionId)
      .expect(200)
      .expect({ isStarted: false }, done);
  });

  it('should start', (done) => {
    const lobby = lobbies.findLobby(1);
    lobby.addJoinee('rishabh');
    lobby.addJoinee('subhash');

    app.post('/api/start')
      .set('cookie', sessionId)
      .expect(200)
      .expect(/"isStarted":true/, done);
  });
});
