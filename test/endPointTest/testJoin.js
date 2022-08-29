const request = require('supertest');
const expressSession = require('express-session');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');
const Datastore = require('../../src/models/datastore.js');
const { Lobbies } = require('../../src/models/lobbies.js');
const { Lobby } = require('../../src/models/lobby.js');

const mockClient = () => {
  const p = new Promise((res) => res());
  return { hGet: () => p, hSet: () => p, hDel: () => p };
};

describe('Join', () => {
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
      lobbiesStore: new Datastore('lobbies', mockClient()),
    };
    app = request(initApp(config, users, games, session, store, lobbies));
  });

  it('should redirect to login, if user is not logged in', (done) => {
    const game = games.createGame();
    const gameId = game.gameId;
    const host = new Player('host');
    game.addPlayer(host);

    app.get(`/join?gameId=${gameId}`)
      .expect('location', '/login')
      .expect(302, done);
  });

  it('should send user to lobby, when user is logged in and enter valid room id', (done) => {
    const lobby = new Lobby(1, 'rishabh', { min: 1, max: 4 });
    lobbies.addLobby(lobby);

    app.post('/login')
      .send('username=root&password=root')
      .end((_, res) => {
        const cookie = res.header['set-cookie'];

        app.get('/join?lobbyId=1')
          .set('cookie', cookie)
          .expect('location', '/lobby')
          .expect(302, done);
      });
  });

  it('should set error cookie if user tries to enter game with max players(6)', (done) => {
    const lobby = new Lobby(1, 'rishabh', { min: 1, max: 1 });
    lobbies.addLobby(lobby);

    app.post('/login')
      .send('username=root&password=root')
      .end((_, res) => {
        const cookie = res.header['set-cookie'];

        app.get('/join?lobbyId=1')
          .set('cookie', cookie)
          .expect('location', '/')
          .expect('set-cookie', /Room%20is%20already%20full/)
          .expect(302, done);
      });
  });

  it('should set error cookie when user enters non existent room id', (done) => {
    app.post('/login')
      .send('username=root&password=root')
      .end((_, res) => {
        const cookie = res.header['set-cookie'];
        app.get('/join?gameId=1')
          .set('cookie', cookie)
          .expect('location', '/')
          .expect('set-cookie', /Invalid.*room.*id/)
          .expect(302, done);
      });
  });

  it('should set error cookie if game tries to join game which is started', (done) => {
    const lobby = new Lobby(1, 'rishabh', { min: 1, max: 2 });
    lobbies.addLobby(lobby);
    lobby.closeLobby('rishabh');

    app.post('/login')
      .send('username=root&password=root')
      .end((_, res) => {
        const cookie = res.header['set-cookie'];

        app.get('/join?lobbyId=1')
          .set('cookie', cookie)
          .expect('location', '/')
          .expect('set-cookie', /Room.*is.*not.*available.*anymore/)
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

        game.changeGameStatus();
        game.addPlayer(player);

        app.get(`/join?gameId=${gameId}`)
          .set('cookie', cookie)
          .expect('location', '/game', done);
      });
  });
});
