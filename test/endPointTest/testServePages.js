const request = require('supertest');
const expressSession = require('express-session');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');

describe('servePages', () => {
  describe('serveLandingPage', () => {
    it('Should serve landing page on /', (done) => {
      const config = { mode: 'test', views: './views' };
      const users = new Users();
      const games = new Games();
      const session = expressSession({
        secret: 'test', resave: false, saveUninitialized: false
      });
      const app = request(initApp(config, users, games, session));
      app.get('/')
        .expect('content-type', /html/)
        .expect(200, done);
    });
  });

  describe('validateAnchor', () => {
    it('Should redirect to lobby page on /host', (done) => {
      const config = { mode: 'test', views: './views' };
      const users = new Users();
      const games = new Games();
      const session = expressSession({
        secret: 'test', resave: false, saveUninitialized: false
      });
      const app = request(initApp(config, users, games, session));
      const body = 'username=user1&password=user1';
      app.post('/signup')
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
      const config = { mode: 'test', views: './views' };
      const users = new Users();
      const games = new Games();
      const session = expressSession({
        secret: 'test', resave: false, saveUninitialized: false
      });
      const app = request(initApp(config, users, games, session));
      app.get('/host')
        .expect(302, done);
    });
  });

  describe('serveLobby', () => {
    it('Should redirect on home page if not logged in', (done) => {
      const config = { mode: 'test', views: './views' };
      const users = new Users();
      const games = new Games();
      const session = expressSession({
        secret: 'test', resave: false, saveUninitialized: false
      });
      const app = request(initApp(config, users, games, session));
      app.get('/lobby/1')
        .expect('location', '/')
        .expect(302, done);
    });

    it('Should serve lobby page on /lobby/1', (done) => {
      const config = { mode: 'test', views: './views' };
      const users = new Users();
      const games = new Games();
      const session = expressSession({
        secret: 'test', resave: false, saveUninitialized: false
      });
      const app = request(initApp(config, users, games, session));
      const body = 'username=user1&password=user1';
      app.post('/signup')
        .send(body)
        .expect('location', '/')
        .expect(302)
        .end((err, res) => {
          const cookies = res.header['set-cookie'];
          app.get('/lobby/1')
            .set('cookie', cookies)
            .expect('content-type', /html/)
            .expect(200, done);
        });
    });
  });
});
