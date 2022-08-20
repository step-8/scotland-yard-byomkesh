const request = require('supertest');
const expressSession = require('express-session');
const { initApp } = require('./../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const Datastore = require('../../src/models/datastore.js');


const mockClient = () => {
  const p = new Promise((res, rej) => res());
  return { hGet: () => p, hSet: () => p, hDel: () => p };
};

describe('Login', () => {
  let app, config;
  beforeEach(() => {
    config = { mode: 'test', views: './views' };
    const users = new Users(
      { root: { username: 'root', password: 'root' } }
    );
    const games = new Games();
    const session = expressSession({
      secret: 'test', resave: false, saveUninitialized: false
    });
    const stores = {
      gamesStore: new Datastore('games', mockClient()),
      usersStore: new Datastore('users', mockClient()),
    };
    app = request(initApp(config, users, games, session, stores));
  });

  it('should serve the login page', (done) => {
    app.get('/login')
      .expect(/<title>Login<\/title>/)
      .expect(200, done);
  });

  it('should redirect to the login if all credentials are missing', (done) => {
    const body = '';
    app.post('/login')
      .send(body)
      .expect('set-cookie', /loginError=Please%20enter%20all%20credentials/)
      .expect('location', '/login')
      .expect(302, done);
  });

  it('should redirect to the login if any credential is missing', (done) => {
    const body = 'username=Raju';
    app.post('/login')
      .send(body)
      .expect('set-cookie', /loginError=Please%20enter%20all%20credentials/)
      .expect('location', '/login')
      .expect(302, done);
  });

  it('should redirect to the login if credentials did not match', (done) => {
    const body = 'username=Raju&password=1';
    app.post('/login')
      .send(body)
      .expect('set-cookie', /loginError=Invalid%20credentials/)
      .expect('location', '/login')
      .expect(302, done);
  });

  it('should redirect to the origin', (done) => {
    const body = 'username=root&password=root';
    app.post('/login')
      .send(body)
      .expect('location', '/')
      .expect(302, done);
  });

  it('should redirect to landing page if user is already logged in', (done) => {
    const body = 'username=root&password=root';
    let sessionId;
    app.post('/login')
      .send(body)
      .end((err, res) => {
        sessionId = res.headers['set-cookie'];

        app.get('/login')
          .set('Cookie', sessionId)
          .expect('location', '/')
          .expect(302, done);
      });
  });
});
