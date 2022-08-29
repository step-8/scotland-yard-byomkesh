const { assert } = require('chai');
const { Lobby } = require('../../src/models/lobby.js');

describe('Lobby', () => {
  it('Should create new lobby instace.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });
    const expected = {
      isLobbyClosed: false,
      lobbyId: 1, joinees: ['rishabh'], limit: { min: 3, max: 6 }
    };

    assert.deepStrictEqual(lobby.getState(), expected);
  });

  it('Should add new joinee in lobby.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });
    lobby.addJoinee('subhash');

    const expected = {
      isLobbyClosed: false,
      lobbyId: 1,
      joinees: ['rishabh', 'subhash'],
      limit: { min: 3, max: 6 }
    };

    assert.deepStrictEqual(lobby.getState(), expected);
  });

  it('Should add new joinee in lobby.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });
    lobby.addJoinee('subhash');
    lobby.leave('rishabh');

    const expected = {
      isLobbyClosed: false,
      lobbyId: 1,
      joinees: ['subhash'],
      limit: { min: 3, max: 6 }
    };

    assert.deepStrictEqual(lobby.getState(), expected);
  });

  it('Should return true if lobby can close.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });
    lobby.addJoinee('subhash');

    assert.ok(lobby.getJoinees());
  });

  it('Should return joinees.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });
    lobby.addJoinee('subhash');

    const expected = [{ username: 'rishabh', isHost: true }, { username: 'subhash', isHost: false }];

    assert.deepStrictEqual(lobby.getJoinees(), expected);
  });

  it('Should return joinees.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });
    lobby.addJoinee('subhash');

    const expected = [{ username: 'rishabh', isHost: true }, { username: 'subhash', isHost: false }];

    assert.deepStrictEqual(lobby.getJoinees(), expected);
  });

  it('Should assert if given id is same.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });

    assert.ok(lobby.isMyLobbyId(1));
  });

  it('Should close lobby if requested by host.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 1, max: 6 });
    lobby.closeLobby('rishabh');

    assert.ok(lobby.isLobbyClosed);
  });

  it('Should not close lobby if requested by joinee.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 1, max: 6 });
    lobby.addJoinee('subhash');
    lobby.closeLobby('subhash');

    assert.notOk(lobby.isLobbyClosed);
  });

  it('Should not close lobby if minimum joinee have not joined.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 2, max: 6 });
    lobby.closeLobby('rishabh');

    assert.notOk(lobby.isLobbyClosed);
  });
});
