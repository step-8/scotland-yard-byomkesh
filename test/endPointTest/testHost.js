const request = require('supertest');
const expressSession = require('express-session');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');
const Datastore = require('../../src/models/datastore.js');
const { Lobbies } = require('../../src/models/lobbies.js');

const mockClient = () => {
  const p = new Promise((res) => res());
  return { hGet: () => p, hSet: () => p, hDel: () => p };
};

describe('Host', () => {
  let app, config, users, games, session, lobbies;
  beforeEach(() => {

    config = { mode: 'test', views: './views' };
    const root = { root: { username: 'root', password: 'root' } };
    users = new Users(root);
    games = new Games();
    lobbies = new Lobbies();
    session = expressSession({
      secret: 'test', resave: false, saveUninitialized: false
    });

    const store = {
      gamesStore: new Datastore('games', mockClient()),
    };
    app = request(initApp(config, users, games, session, store, lobbies));
  });

  it('should redirect to login, if user is not logged in', (done) => {
    app.get('/host')
      .expect('location', '/login')
      .expect(302, done);
  });

  it('should host a game and send user to lobby, when user is logged in and enter valid room id', (done) => {
    app.post('/login')
      .send('username=root&password=root')
      .end((_, res) => {
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
    const player = new Player('root');

    app.post('/login')
      .send('username=root&password=root')
      .end((_, res) => {
        const cookie = res.header['set-cookie'];

        app.get(`/join?gameId=${gameId}`)
          .set('cookie', cookie)
          .end(() => {

            game.changeGameStatus();
            game.addPlayer(player);

            app.get('/host')
              .set('cookie', cookie)
              .expect('location', '/game', done);
          });
      });
  });
});
