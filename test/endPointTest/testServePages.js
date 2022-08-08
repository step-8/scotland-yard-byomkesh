const request = require('supertest');

const { initApp } = require('../../src/app.js');

describe('servePages', () => {
  it('Should serve landing page on /', (done) => {
    const config = { mode: 'test' };
    const app = request(initApp(config));
    app.get('/')
      .expect('content-type', /html/)
      .expect(200, done);
  });
});
