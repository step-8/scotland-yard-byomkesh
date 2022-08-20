const { SessionStore } = require('../../src/sessionStore/store.js');
const assert = require('assert');
const Datastore = require('../../src/models/datastore.js');
const sinon = require('sinon');

const mockWriteSession = expected => (session) => {
  assert.deepStrictEqual(session, expected);
  return new Promise((res, rej) => res());
}
describe('Session Store', () => {
  it('Should store the modified data', () => {
    const p = new Promise((res, rej) => res());
    const set = sinon.mock('set')
      .exactly(1)
      .withArgs('sourav', JSON.stringify({ name: 'sourav' }))
      .returns(p);

    const mockedDatastore = { set };
    const sessionStore = new SessionStore(mockedDatastore);
    const mockedCallback = sinon.mock('callback').exactly(1);

    sessionStore.set('sourav', { name: 'sourav' }, mockedCallback);
  });

  it('Should return the session value', () => {
    const p =
      new Promise((res, rej) => res(JSON.stringify({ name: 'sourav' })));
    const get = sinon.mock('get')
      .exactly(1)
      .withArgs('sourav')
      .returns(p);

    const mockedDatastore = { get };
    const sessionStore = new SessionStore(mockedDatastore);
    const mockedCallback = sinon.mock('callback')
      .exactly(1)
      .withArgs(null, { name: 'sourav' });

    sessionStore.get('sourav', mockedCallback);
  });

  it('Should destroy the session', () => {
    const p =
      new Promise((res, rej) => res());
    const mockedDatastore = {
      delete: sinon.mock('destroy')
        .exactly(1)
        .withArgs('sourav')
        .returns(p)
    };

    const sessionStore = new SessionStore(mockedDatastore);
    const mockedCallback = sinon.mock('callback')
      .exactly(1)
      .withArgs(null);

    sessionStore.destroy('sourav', mockedCallback);
  });
});