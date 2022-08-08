const request = require('supertest');
const expressSession = require('express-session');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');

describe('signupHandler', () => {
  let app, config;
  beforeEach(() => {

    config = { mode: 'test', views: './views' };
    const users = new Users();
    const session = expressSession({
      secret: 'test', resave: false, saveUninitialized: false
    });
    app = request(initApp(config, users, session));
  });

  it('Should respond with 302 when user is added ', (done) => {
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

  it('Should respond with 302 when username & password are spaces.', (done) => {
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
          .expect('location', '/', done)
      });
  });

  it('Should redirect to /host if new user goes to /host.', (done) => {
    const username = 'user1';
    const password = 'pword1';
    const body = `username=${username}&password=${password}`;

    app.get('/host')
      .expect(302)
      .expect('location', '/login')
      .end((err, res) => {
        const cookie = res.header['set-cookie'];

        app
          .post('/signup')
          .set('cookie', cookie)
          .send(body)
          .expect(302)
          .expect('location', '/host', done)
      })
  });
});
