const { assert } = require('chai');
const sinon = require('sinon');
const { redirectToLobby } = require('../../src/middleware/blockInvalidAccess.js');
const { Lobbies } = require('../../src/models/lobbies.js');

describe('Lobby', () => {
  it('should redirect to /lobby from lobby', () => {
    const req = { session: {} };
    const lobbies = new Lobbies();
    const res = {};
    const next = sinon.stub();
    const redierctor = redirectToLobby(lobbies);
    redierctor(req, res, next);
    assert.ok(next.calledOnce);

  });

  it('should redirect to /lobby from lobby on invalid request', () => {
    const lobbies = new Lobbies();
    const req = { session: { lobbyId: 1 } };
    const res = { redirect: sinon.stub() };
    const next = () => { };

    const redierctor = redirectToLobby(lobbies);
    redierctor(req, res, next);
    assert.ok(res.redirect.calledOnce);

  });

  it('should invoke next when player is not in lobby ', () => {
    const lobbies = new Lobbies();
    const req = { url: '/login', session: {} };
    const res = {};
    const next = sinon.stub();

    const redierctor = redirectToLobby(lobbies);
    redierctor(req, res, next);
    assert.ok(next.calledOnce);

  });
});
