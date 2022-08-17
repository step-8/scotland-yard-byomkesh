const request = require('supertest');
const expressSession = require('express-session');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');

describe('Join', () => {
  let app, config, users, games, session;
  beforeEach(() => {

    config = { mode: 'test', views: './views' };
    const root = { root: { username: 'root', password: 'root' } };
    users = new Users(root);
    games = new Games();
    session = expressSession({
      secret: 'test', resave: false, saveUninitialized: false
    });
    app = request(initApp(config, users, games, session, () => { }));
  });

  it('should redirect to login, if user is not logged in', (done) => {
    const game = games.createGame();
    const gameId = game.gameId;
    const host = new Player('host');
    game.addPlayer(host);

    app.get(`/join?gameId=${gameId}`)
      .expect('location', `/login`)
      .expect(302, done);
  });

  it('should send user to lobby, when user is logged in and enter valid room id', (done) => {
    const game = games.createGame();
    const gameId = game.gameId;
    const host = new Player('host');
    game.addPlayer(host);

    app.post('/login')
      .send('username=root&password=root')
      .expect('location', '/')
      .expect(302)
      .end((err, res) => {
        const cookie = res.header['set-cookie'];

        app.get(`/join?gameId=${gameId}`)
          .set('cookie', cookie)
          .expect('location', `/lobby`)
          .expect(302, done);
      });
  });

  it('should set error cookie if user tries to enter game with max players(6)', (done) => {
    const game = games.createGame();
    const gameId = game.gameId;
    const host = new Player('host');
    const player1 = new Player('player1');
    const player2 = new Player('player2');
    const player3 = new Player('player3');
    const player4 = new Player('player4');
    const player5 = new Player('player5');
    const player6 = new Player('player6');
    game.addPlayer(host);
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.addPlayer(player4);
    game.addPlayer(player5);
    game.addPlayer(player6);

    app.post('/login')
      .send('username=root&password=root')
      .expect('location', '/')
      .expect(302)
      .end((err, res) => {
        const cookie = res.header['set-cookie'];

        app.get(`/join?gameId=${gameId}`)
          .set('cookie', cookie)
          .expect('location', `/`)
          .expect('set-cookie', /Room%20is%20already%20full/)
          .expect(302, done);
      });
  });


  it('should set error cookie when user enters non existent room id', (done) => {
    const gameId = 1;

    app.post('/login')
      .send('username=root&password=root')
      .expect('location', '/')
      .expect(302)
      .end((err, res) => {
        const cookie = res.header['set-cookie'];

        app.get(`/join?gameId=${gameId}`)
          .set('cookie', cookie)
          .expect('location', `/`)
          .expect('set-cookie', /Invalid.*room.*id/)
          .expect(302, done);
      });
  });

  it('should set error cookie if game tries to join game which is started', (done) => {
    const game = games.createGame();
    const gameId = game.gameId;

    app.post('/login')
      .send('username=root&password=root')
      .expect('location', '/')
      .expect(302)
      .end((err, res) => {
        const cookie = res.header['set-cookie'];

        game.changeGameStatus();

        app.get(`/join?gameId=${gameId}`)
          .set('cookie', cookie)
          .expect('location', `/`)
          .expect('set-cookie', /Room.*is.*not.*available.*anymore/)
          .expect(302, done);
      });
  });
});
