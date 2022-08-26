const request = require('supertest');
const expressSession = require('express-session');
const assert = require('assert');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { Games } = require('../../src/models/games.js');
const Datastore = require('../../src/models/datastore.js');

const mockWfs = (expectedFilename, expectedData, expectedEncoding) => {
  return (actualFilename, actualData, actualEncoding) => {
    assert.strictEqual(actualFilename, expectedFilename);
    assert.strictEqual(actualData, expectedData);
    assert.strictEqual(actualEncoding, expectedEncoding);
  };
};

const mockClient = () => {
  const p = new Promise((res, rej) => res());
  return { hGet: () => p, hSet: () => p, hDel: () => p };
};

describe('signupHandler', () => {
  let app, config, usersObj, users, games, session;
  beforeEach(() => {

    config = {
      mode: 'test', views: './views', userDb: './db/users.json'
    };
    usersObj = { root: { username: 'root', password: 'root' } };
    users = new Users(usersObj);
    games = new Games();
    session = expressSession({
      secret: 'test', resave: false, saveUninitialized: false
    });
    const stores = {
      gamesStore: new Datastore('games', mockClient()),
      usersStore: new Datastore('users', mockClient()),
    };

    app = request(initApp(config, users, games, session, stores));
  });

  it('Should respond with 302 when user is added ', (done) => {
    const updatedUsers = {
      ...usersObj,
      user: {
        username: 'user',
        password: 'user'
      }
    };
    const stores = {
      gamesStore: new Datastore('games', mockClient()),
      usersStore: new Datastore('users', mockClient()),
    };
    const app = request(initApp(config, users, games, session, stores));
    const username = 'user';
    const password = 'user';
    const body = `username=${username}&password=${password}`;

    app.post('/signup')
      .send(body)
      .expect(302)
      .expect('location', '/', done);
  });

  it('Should respond with 302 when user already exists', (done) => {
    const username = 'root';
    const password = 'root';
    const body = `username=${username}&password=${password}`;

    app.post('/signup')
      .send(body)
      .expect(302)
      .expect('location', /signup/, done);
  });

  it('Should respond with 302 when password not provided', (done) => {
    const username = 'user';
    const password = '';
    const body = `username=${username}&password=${password}`;

    app.post('/signup')
      .send(body)
      .expect(302)
      .expect('location', /signup/, done);
  });

  it('Should respond with 302 when username not provided', (done) => {
    const username = '';
    const password = 'user';
    const body = `username=${username}&password=${password}`;

    app.post('/signup')
      .send(body)
      .expect(302)
      .expect('location', /signup/, done);
  });

  it('Should respond with 302 when username & password contain spaces.', (done) => {
    const username = '    ';
    const password = '    ';
    const body = `username=${username}&password=${password}`;

    app.post('/signup')
      .send(body)
      .expect(302)
      .expect('set-cookie', /Please.*enter.*all.*credentials/)
      .expect('location', /signup/, done);
  });

  it('Should return signup page', (done) => {
    app.get('/signup')
      .expect(200)
      .expect('content-type', /html/, done);
  });

  it('Should redirect to landing page if user logged in.', (done) => {
    const username = 'user1';
    const password = 'pword';
    const body = `username=${username}&password=${password}`;

    app.post('/signup')
      .send(body)
      .expect(302)
      .expect('location', '/')
      .end((err, res) => {
        const cookie = res.headers['set-cookie'];
        app.get('/signup')
          .set('cookie', cookie)
          .expect(302)
          .expect('location', '/', done);
      });
  });

  it('Should redirect to landing page if new user goes to /host.', (done) => {
    const updatedUsers = {
      ...usersObj,
      user1: {
        username: 'user1',
        password: 'pword1'
      }
    };
    const stores = {
      gamesStore: new Datastore('games', mockClient()),
      usersStore: new Datastore('users', mockClient()),
    };
    // const userDb = './db/users.json';
    // const writeFile = mockWfs(userDb, JSON.stringify(updatedUsers), 'utf8');
    const app = request(initApp(config, users, games, session, stores));

    const username = 'user1';
    const password = 'pword1';
    const body = `username=${username}&password=${password}`;

    app.get('/host')
      .expect(302)
      .expect('location', '/login')
      .end((_, res) => {
        app
          .post('/signup')
          .send(body)
          .expect(302)
          .expect('location', '/', done);
      });
  });
});
