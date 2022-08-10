const assert = require('assert');

const { Users } = require('../../src/models/users.js');

describe('Users', () => {
  let users;

  beforeEach(() => {
    const root = { root: { username: 'root', password: 'root' } };
    users = new Users(root)
  });

  describe('haveUser', () => {
    it('Should return true if username present', () => {
      assert.ok(users.haveUser('root'));
    });
    it('Should return true if username present but have different case', () => {
      assert.ok(users.haveUser('RoOt'));
    });
    it('Should return false if username is not present', () => {
      assert.ok(!users.haveUser('user'));
    });
  });
  describe('addUser', () => {
    it('Should add user if user is not present', () => {
      const username = 'user';
      const password = 'user';

      assert.ok(users.addUser(username, password));
    });
    it('Should return false if user is present', () => {
      const username = 'root';
      const password = 'root';

      assert.ok(!users.addUser(username, password));
    });
    it('Should return false if existant username provided in different case', () => {
      const username = 'Root';
      const password = 'root';

      assert.ok(!users.addUser(username, password));
    });
  });

  describe('authUser', () => {
    it('Should return true if user authenticated successfully', () => {
      const username = 'Root';
      const password = 'root';

      assert.ok(users.authUser(username, password));
    });
    it('Should return false if user fails to authenticate', () => {
      const username = 'user';
      const password = 'user';

      assert.ok(!users.authUser(username, password));
    });
  });

});
