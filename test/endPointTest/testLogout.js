const request = require('supertest');
const expressSession = require('express-session');

const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const { initApp } = require('../../src/app.js');

describe('Logout', () => {
  let app, config;
  beforeEach(() => {

    config = { mode: 'test', views: './views' };
    const users = new Users();
    const games = new Games();
    const session = expressSession({
      secret: 'test', resave: false, saveUninitialized: false
    });
    app = request(initApp(config, users, games, session));
  });

  it('Should redirect to / if user is logged in', (done) => {
    const body = 'username=root&password=root';
    app.post('/login')
      .send(body)
      .end((err, res) => {
        const sessionId = res.headers['set-cookie'];

        app.get('/logout')
          .set('Cookie', sessionId)
          .expect('location', '/')
          .expect(302, done);
      });
  });

  it('Should redirect to / if user is not logged in', (done) => {
    app.get('/logout')
      .expect('location', '/')
      .expect(302, done);
  });
});