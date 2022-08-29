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

describe('leave-lobby', () => {
  let config, session, games, appReq;
  beforeEach(() => {
    config = { mode: 'test', views: './views' };
    games = new Games();
    session = expressSession({
      secret: 'test', resave: false, saveUninitialized: false
    });

    const root = { root: { username: 'root', password: 'root' } };
    const users = new Users(root);
    const lobbies = new Lobbies();

    const stores = {
      lobbiesStore: new Datastore('lobbies', mockClient()),
      usersStore: new Datastore('users', mockClient()),
    };

    const app = initApp(config, users, games, session, stores, lobbies);
    appReq = request(app);
  });

  const afterLogin = (postLoginAction) => {
    const body = 'username=root&password=root';
    appReq.post('/login')
      .send(body)
      .end((_, res) => {
        const cookie = res.header['set-cookie'];
        postLoginAction(cookie);
      });
  };

  const afterJoin = (gameId, cookie, postJoinAction) => {
    appReq.get(`/join?gameId=${gameId}`)
      .set('cookie', cookie)
      .end(() => {
        postJoinAction(cookie);
      });
  };

  it('Joinee should be able to leave lobby when game is not started', (done) => {
    const game = games.createGame();
    const gameId = game.gameId;
    const host = new Player('host');
    game.addPlayer(host);

    const leaveLobbyReq = (cookie) => {
      appReq.post('/leave-lobby')
        .set('cookie', cookie)
        .expect('location', '/')
        .expect(302, done);
    };

    afterLogin((cookie) =>
      afterJoin(gameId, cookie, () =>
        leaveLobbyReq(cookie)));
  });

  it('Host should be able to leave lobby when game is not started', (done) => {
    const leaveLobbyReq = (cookie) => {
      appReq.post('/leave-lobby')
        .set('cookie', cookie)
        .expect('location', '/')
        .expect(302, done);
    };

    afterLogin((cookie) => {
      appReq.get('/host')
        .set('cookie', cookie)
        .end(() => leaveLobbyReq(cookie));
    });
  });
});
