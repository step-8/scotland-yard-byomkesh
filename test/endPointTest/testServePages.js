const request = require('supertest');

const { initApp } = require('../../src/app.js');

describe('servePages', () => {
  describe('serveLandingPage', () => {
    it('Should serve landing page on /', (done) => {
      const config = { mode: 'test', views: './views' };
      const app = request(initApp(config));
      app.get('/')
        .expect('content-type', /html/)
        .expect(200, done);
    });
  });

  describe('serveLobby', () => {
    it('Should serve lobby page on /host', (done) => {
      const config = { mode: 'test', views: './views' };
      const app = request(initApp(config));
      app.get('/')
        .expect('content-type', /html/)
        .expect(200, done);
    });
  });
});
