const request = require('supertest');
const expressSession = require('express-session');

const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const { initApp } = require('../../src/app.js');
const Datastore = require('../../src/models/datastore.js');

const mockClient = () => {
  const p = new Promise((res, rej) => res());
  return { hGet: () => p, hSet: () => p, hDel: () => p };
};

describe('Logout', () => {
  let app, config;
  beforeEach(() => {

    config = { mode: 'test', views: './views' };
    const root = { root: { username: 'root', password: 'root' } };
    const users = new Users(root);
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