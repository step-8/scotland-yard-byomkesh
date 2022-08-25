const { assert } = require('chai');
const { Lobby } = require('../../src/models/lobby.js');
const { Lobbies } = require('../../src/models/lobbies.js');

describe('Lobbies', () => {
  it('Should add new lobby instance to lobbies.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });
    const lobbies = new Lobbies();
    lobbies.addLobby(lobby);

    const expected = {
      lobbies: [{ lobbyId: 1, joinees: ['rishabh'], limit: { min: 3, max: 6 } }],
      nextLobbyId: 2
    };

    assert.deepStrictEqual(lobbies.getState(), expected);
  });

  it('Should find the given lobby id.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });
    const lobbies = new Lobbies();
    lobbies.addLobby(lobby);

    assert.deepStrictEqual(lobbies.findLobby(1).getState(), lobby.getState());
  });

  it('Should remove the given lobby id.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });
    const lobbies = new Lobbies();
    lobbies.addLobby(lobby);
    lobbies.removeLobby(1);

    const expected = { lobbies: [], nextLobbyId: 2 };

    assert.deepStrictEqual(lobbies.getState(), expected);
  });

  it('Should initialize the lobbies instance.', () => {
    const lobby = new Lobby(1, 'rishabh', { min: 3, max: 6 });
    const lobbiesData = { lobbies: [lobby.getState()], nextLobbyId: 2 };

    const lobbies = Lobbies.init(lobbiesData);

    assert.deepStrictEqual(lobbies.getState(), lobbiesData);
  });
});
