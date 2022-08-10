const request = require('supertest');
const expressSession = require('express-session');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');

describe('servePages', () => {
  let config, session, games;
  beforeEach(() => {
    config = { mode: 'test', views: './views' };
    games = new Games();
    session = expressSession({
      secret: 'test', resave: false, saveUninitialized: false
    });
  });
  describe('serveLandingPage', () => {
    it('Should serve landing page on /', (done) => {
      const users = new Users({});
      const app = request(initApp(config, users, games, session));
      app.get('/')
        .expect('content-type', /html/)
        .expect(200, done);
    });
  });

  describe('validateAnchor', () => {
    it('Should redirect to lobby page on /host', (done) => {
      const root = { root: { username: 'root', password: 'root' } };
      const users = new Users(root);
      const app = request(initApp(config, users, games, session, () => { }));
      const body = 'username=root&password=root';

      app.post('/login')
        .send(body)
        .expect('location', '/')
        .expect(302)
        .end((err, res) => {

          const cookies = res.header['set-cookie'];

          app.get('/host')
            .set('cookie', cookies)
            .expect('location', '/lobby/1')
            .expect(302, done);
        });

    });

    it('Should redirect on login page if not logged in', (done) => {
      const users = new Users({});
      const app = request(initApp(config, users, games, session));

      app.get('/host')
        .expect(302, done);
    });
  });

  describe('serveLobby', () => {
    let users, app;
    beforeEach(() => {
      users = new Users({});
      app = request(initApp(config, users, games, session, () => { }));
    });
    it('Should redirect on home page if not logged in', (done) => {
      app.get('/lobby/1')
        .expect('location', '/')
        .expect(302, done);
    });

    it('Should not serve lobby page on /lobby/1 to non-player', (done) => {
      const body = 'username=root&password=root';

      app.post('/login')
        .send(body)
        .expect('location', '/')
        .expect(302)
        .end((err, res) => {
          const cookies = res.header['set-cookie'];
          app.get('/lobby/1')
            .set('cookie', cookies)
            .expect('location', '/')
            .expect(302, done);
        });
    });

    it('Should send player of game 1 to lobby of game 1 on /lobby/1', (done) => {
      const root = { root: { username: 'root', password: 'root' } };
      const users = new Users(root);
      const app = request(initApp(config, users, games, session));
      const game = games.createGame();
      const gameId = game.gameId;
      const host = new Player('host');
      game.addPlayer(host);

      app.post('/login')
        .send('username=root&password=root')
        .expect('location', '/')
        .expect(302)
        .end((err, res) => {
          const cookie = res.header['set-cookie'];

          app.get(`/join?gameId=${gameId}`)
            .set('cookie', cookie)
            .expect('location', `/lobby/${gameId}`)
            .expect(302, done);
        });
    });
  });
  describe('serveErrorPage', () => {
    it('Should serve error page on invalid request', (done) => {
      const users = new Users({});
      const app = request(initApp(config, users, games, session));
      app.get('/abc')
        .expect('content-type', /html/)
        .expect(404, done);
    });
  });
});
