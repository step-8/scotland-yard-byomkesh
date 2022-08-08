const request = require('supertest');
const expressSession = require('express-session');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');

describe('servePages', () => {
  describe('serveLandingPage', () => {
    it('Should serve landing page on /', (done) => {
      const config = { mode: 'test', views: './views' };
      const users = new Users();
      const session = expressSession({
        secret: 'test', resave: false, saveUninitialized: false
      });
      const app = request(initApp(config, users, session));
      app.get('/')
        .expect('content-type', /html/)
        .expect(200, done);
    });
  });

  describe('serveLobby', () => {
    it('Should serve lobby page on /host', (done) => {
      const config = { mode: 'test', views: './views' };
      const users = new Users();
      const session = expressSession({
        secret: 'test', resave: false, saveUninitialized: false
      });
      const app = request(initApp(config, users, session));
      app.get('/')
        .expect('content-type', /html/)
        .expect(200, done);
    });
  });
});
