const request = require('supertest');
const { initApp } = require('./../../src/app.js');
const { Users } = require('../../src/models/users.js');
const { it } = require('mocha');

describe('Login', () => {
  let app, config;
  beforeEach(() => {
    config = { mode: 'test', views: './views' };
    const users = new Users();
    app = request(initApp(config, users));
  });

  it('should serve the login page', (done) => {
    app.get('/login')
      .expect(/<title>Login<\/title>/)
      .expect(200, done);
  });

  it('should redirect to the login if all credentials are missing', (done) => {
    const body = '';
    app.post('/login')
      .send(body)
      .expect('set-cookie', /loginError=Please%20enter%20all%20credentials/)
      .expect('location', '/login')
      .expect(302, done);
  });

  it('should redirect to the login if any credential is missing', (done) => {
    const body = 'username=Raju';
    app.post('/login')
      .send(body)
      .expect('set-cookie', /loginError=Please%20enter%20all%20credentials/)
      .expect('location', '/login')
      .expect(302, done);
  });

  it('should redirect to the login if credentials did not match', (done) => {
    const body = 'username=Raju&password=1';
    app.post('/login')
      .send(body)
      .expect('set-cookie', /loginError=Invalid%20credentials/)
      .expect('location', '/login')
      .expect(302, done);
  });

  it('should redirect to the origin', (done) => {
    const body = 'username=root&password=root';
    app.post('/login')
      .send(body)
      .expect('location', '/')
      .expect(302, done);
  });
});
