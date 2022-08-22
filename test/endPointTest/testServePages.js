const request = require('supertest');
const expressSession = require('express-session');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');
const Datastore = require('../../src/models/datastore.js');


const mockClient = () => {
  const p = new Promise((res, rej) => res());
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
    app = request(initApp(config, users, games, session, () => { }));
  });

  const afterLogin = (postLoginAction) => {
    const body = 'username=root&password=root';
    app.post('/login')
      .send(body)
      .end((err, res) => {
        const cookie = res.header['set-cookie'];
        postLoginAction(cookie);
      })
  };

  describe('serveLandingPage', () => {
    it('Should redirect to login page on /, if user is not logged in', (done) => {
      const users = new Users({});

      const stores = {
        gamesStore: new Datastore('games', mockClient()),
        usersStore: new Datastore('users', mockClient()),
      };

      const app = request(initApp(config, users, games, session, stores));
      app.get('/')
        .expect('location', '/login')
        .expect(302, done);
    });

    it('Should serve landing page on /, if user is logged in', (done) => {
      const root = { root: { username: 'root', password: 'root' } };
      const users = new Users(root);
      const stores = {
        gamesStore: new Datastore('games', mockClient()),
        usersStore: new Datastore('users', mockClient()),
      };
      const app = request(initApp(config, users, games, session, stores));
      const body = 'username=root&password=root';

      app.post('/login')
        .send(body)
        .expect('location', '/')
        .expect(302)
        .end((err, res) => {
          const cookie = res.header['set-cookie'];
          app.get('/')
            .set('cookie', cookie)
            .expect('content-type', /html/)
            .expect(/<title>Scotland Yard<\/title>/)
            .expect(200, done);
        })

    });
  });

  describe('serveLobby', () => {
    let users, app;
    beforeEach(() => {
      const root = { root: { username: 'root', password: 'root' } };
      users = new Users(root);

      const stores = {
        gamesStore: new Datastore('games', mockClient()),
        usersStore: new Datastore('users', mockClient()),
      };
      app = request(initApp(config, users, games, session, stores));
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
      })
    });

    it('Should serve lobby of game 1 on /lobby', (done) => {
      const game = games.createGame();
      const gameId = game.gameId;
      const host = new Player('host');
      game.addPlayer(host);

      afterLogin((cookie) => {
        app.get(`/join?gameId=${gameId}`)
          .set('cookie', cookie)
          .expect('location', `/lobby`)
          .expect(302, done);
      })
    });

    it('Should block invalid access from lobby', (done) => {
      const game = games.createGame();
      const gameId = game.gameId;
      const host = new Player('host');
      game.addPlayer(host);

      afterLogin((cookie) => {
        app.get(`/join?gameId=${gameId}`)
          .set('cookie', cookie)
          .expect('location', '/lobby')
          .expect(302, done)
      })
    });

    it('Should block invalid access from game page', (done) => {

      const game = games.createGame();
      const gameId = game.gameId;
      const host = new Player('host');
      game.addPlayer(host);

      afterLogin((cookie) => {
        app.get(`/join?gameId=${gameId}`)
          .set('cookie', cookie)
          .expect('location', '/lobby')
          .expect(302)
          .end((err, res) => {
            game.changeGameStatus();
            app.get('/')
              .set('cookie', cookie)
              .expect('location', '/game')
              .expect(302)
              .end(() => app.get('/logout')
                .set('cookie', cookie)
                .expect('location', '/game')
                .expect(302, done)
              );
          });
      })
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