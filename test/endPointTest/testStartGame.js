const request = require('supertest');
const expressSession = require('express-session');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');

let app, sessionId, games;

const initTestApp = () => {
  const config = { mode: 'test', views: './views' };
  const root = { root: { username: 'root', password: 'root' } };
  const users = new Users(root);
  games = new Games();
  const session = expressSession({
    secret: 'test', resave: false, saveUninitialized: false
  });
  app = request(initApp(config, users, games, session));
  return app;
};

const captureLoginCookie = (done) => {
  app.post('/login')
    .send('username=root&password=root')
    .end((err, res) => {
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
      .expect(200)
      .expect('content-type', /json/, done);
  });

  it('should not start if players are less than 3', (done) => {
    app.post('/api/start')
      .set('cookie', sessionId)
      .expect(200)
      .expect({ isStarted: false }, done);
  });

  it('should start', (done) => {
    const game = games.findGame(1);
    game.addPlayer(new Player('p1'));
    game.addPlayer(new Player('p2'));
    game.addPlayer(new Player('p3'));

    app.post('/api/start')
      .set('cookie', sessionId)
      .expect(200)
      .expect(/"isStarted":true/, done);
  });
});