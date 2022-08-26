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

describe('Host', () => {
  let app, config, users, games, session;
  beforeEach(() => {

    config = { mode: 'test', views: './views' };
    const root = { root: { username: 'root', password: 'root' } };
    users = new Users(root);
    games = new Games();
    session = expressSession({
      secret: 'test', resave: false, saveUninitialized: false
    });

    const store = {
      gamesStore: new Datastore('games', mockClient()),
    };
    app = request(initApp(config, users, games, session, store));
  });

  it('should redirect to login, if user is not logged in', (done) => {
    app.get('/host')
      .expect('location', '/login')
      .expect(302, done);
  });

  it('should host a game and send user to lobby, when user is logged in and enter valid room id', (done) => {
    app.post('/login')
      .send('username=root&password=root')
      .end((err, res) => {
        const cookie = res.header['set-cookie'];

        app.get('/host')
          .set('cookie', cookie)
          .expect('location', '/lobby')
          .expect(302, done);
      });
  });

  it('Should redirect me to /game if game is started', (done) => {
    const game = games.createGame();
    const gameId = game.gameId;

    app.post('/login')
      .send('username=root&password=root')
      .end((err, res) => {
        const cookie = res.header['set-cookie'];

        app.get(`/join?gameId=${gameId}`)
          .set('cookie', cookie)
          .end(() => {

            game.changeGameStatus();

            app.get('/host')
              .set('cookie', cookie)
              .expect('location', '/game', done);
          });
      });
  });
});
