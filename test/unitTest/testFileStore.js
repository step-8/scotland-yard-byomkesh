const { SessionStore } = require('../../src/sessionStore/store.js');
const assert = require('assert');

const mockWriteSession = expected => (session) => {
  assert.deepStrictEqual(session, expected);
  return new Promise((res, rej) => res());
}
describe('File Store', () => {
  it('Should store the modified data', () => {
    const session = {};
    const writeSession = mockWriteSession({ name: 'sourav' });
    const fileStore = new SessionStore(session, writeSession);
    fileStore.set('name', 'sourav', () => { });
  });

  it('Should return the session value', () => {
    const session = { username: 'user' };
    const writeSession = mockWriteSession({});
    const fileStore = new SessionStore(session, writeSession);
    fileStore.get('username', (_, username) => {
      assert.strict(username, 'user');
    });
  });

  it('Should destroy the session', () => {
    const session = { username: 'user' };
    const writeSession = mockWriteSession({});
    const fileStore = new SessionStore(session, writeSession);
    fileStore.destroy('username', () => { });
  });
});