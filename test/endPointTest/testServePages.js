const request = require('supertest');
const expressSession = require('express-session');
const sinon = require('sinon');
const { assert } = require('chai');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const Datastore = require('../../src/models/datastore.js');
const { Lobbies } = require('../../src/models/lobbies.js');
const { Lobby } = require('../../src/models/lobby.js');
const { redirectToGame } = require('../../src/middleware/blockInvalidAccess.js');

const mockClient = () => {
  const p = new Promise((res) => res());
  return { hGet: () => p, hSet: () => p, hDel: () => p };
};

describe('servePages', () => {
  let config, session, games, app;
  beforeEach(() => {
    config = { mode: 'test', views: './views' };
    games = new Games();
    session = expressSession({
      secret: 'test', resave: false, saveUninitialized: false
    });

    const root = { root: { username: 'root', password: 'root' } };
    const users = new Users(root);
    const lobbies = new Lobbies();
    app = request(initApp(config, users, games, session, () => { }, lobbies));
  });

  const afterLogin = (postLoginAction) => {
    const body = 'username=root&password=root';
    app.post('/login')
      .send(body)
      .end((_, res) => {
        const cookie = res.header['set-cookie'];
        postLoginAction(cookie);
      });
  };

  describe('serveLandingPage', () => {
    it('Should redirect to login page on /, if user is not logged in', (done) => {
      const users = new Users({});
      const lobbies = new Lobbies();

      const stores = {
        gamesStore: new Datastore('games', mockClient()),
        usersStore: new Datastore('users', mockClient()),
      };

      const app = request(initApp(config, users, games, session, stores, lobbies));
      app.get('/')
        .expect('location', '/login')
        .expect(302, done);
    });

    it('Should serve landing page on /, if user is logged in', (done) => {
      const root = { root: { username: 'root', password: 'root' } };
      const users = new Users(root);
      const lobbies = new Lobbies();
      const stores = {
        gamesStore: new Datastore('games', mockClient()),
        usersStore: new Datastore('users', mockClient()),
      };
      const app = request(initApp(config, users, games, session, stores, lobbies));
      const body = 'username=root&password=root';

      app.post('/login')
        .send(body)
        .expect('location', '/')
        .expect(302)
        .end((_, res) => {
          const cookie = res.header['set-cookie'];
          app.get('/')
            .set('cookie', cookie)
            .expect('content-type', /html/)
            .expect(/<title>Scotland Yard<\/title>/)
            .expect(200, done);
        });

    });
  });

  describe('serveLobby', () => {
    let users, app, lobbies;
    beforeEach(() => {
      const root = { root: { username: 'root', password: 'root' } };
      users = new Users(root);
      lobbies = new Lobbies();

      const stores = {
        lobbiesStore: new Datastore('lobbies', mockClient()),
        usersStore: new Datastore('users', mockClient()),
      };
      app = request(initApp(config, users, games, session, stores, lobbies));
    });

    it('Should redirect on home page if not logged in', (done) => {
      app.get('/lobby')
        .expect('location', '/')
        .expect(302, done);
    });

    it('Should not serve lobby page on /lobby to non-player', (done) => {
      afterLogin((cookie) => {
        app.get('/lobby')
          .set('cookie', cookie)
          .expect('location', '/')
          .expect(302, done);
      });
    });

    it('Should serve lobby of game 1 on /lobby', (done) => {
      const lobby = new Lobby(1, 'rishabh', { min: 1, max: 2 });
      lobbies.addLobby(lobby);

      afterLogin((cookie) => {
        app.get('/join?lobbyId=1')
          .set('cookie', cookie)
          .expect('location', '/lobby')
          .expect(302, done);
      });
    });

    it('Should block invalid access from game page', () => {

      const mockReq = {
        url: '',
        session: {
          game: {}
        }
      };
      const redirect = sinon.stub();
      const mockRes = { redirect };
      const next = {};

      redirectToGame(mockReq, mockRes, next);
      assert.ok(mockRes.redirect.calledOnce);

    });

    describe('serveErrorPage', () => {
      it('Should serve error page on invalid request', (done) => {
        app.get('/abc')
          .expect('content-type', /html/)
          .expect(404, done);
      });
    });
  });
});
