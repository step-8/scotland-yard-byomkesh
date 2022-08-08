const request = require('supertest');

const { initApp } = require('../../src/app.js');
const { Users } = require('../../src/models/users.js');

describe('signupHandler', () => {
  let app, config;
  beforeEach(() => {
    config = { mode: 'test', views: './views' };
    const users = new Users();
    app = request(initApp(config, users));
  });

  it('Should respond with 200 when user is added ', (done) => {
    const username = 'user';
    const password = 'user';
    const body = `username=${username}&password=${password}`;

    app.post('/signup')
      .send(body)
      .expect(200, done);
  });

  it('Should respond with 400 when user already exists', (done) => {
    const username = 'root';
    const password = 'root';
    const body = `username=${username}&password=${password}`;

    app.post('/signup')
      .send(body)
      .expect(400, done);
  });

  it('Should respond with 400 when password not provided', (done) => {
    const username = 'user';
    const password = '';
    const body = `username=${username}&password=${password}`;

    app.post('/signup')
      .send(body)
      .expect(400, done);
  });

  it('Should respond with 400 when username not provided', (done) => {
    const username = '';
    const password = 'user';
    const body = `username=${username}&password=${password}`;

    app.post('/signup')
      .send(body)
      .expect(400, done);
  });

  it('Should return signup page', (done) => {
    app.get('/signup')
      .expect(200)
      .expect('content-type', /html/, done);
  });

});
