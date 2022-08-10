const assert = require('assert');
const { Game } = require('../../src/models/game.js');
const { Player } = require('../../src/models/player.js');

describe('Game', () => {
  let game;
  beforeEach(() => {
    const gameId = 1;
    const stops = {};

    game = new Game(gameId, stops);
  });

  it('Should add player.', () => {
    let currentPosition, role, color;
    const player = new Player('host')
    game.addPlayer(player);
    const expected = {
      players: [
        { currentPosition, isHost: true, role, username: 'host', color }
      ],
      isGameStarted: false
    };

    assert.deepStrictEqual(game.getStatus(), expected);
  });

  it('Should return false if game cannot started', () => {
    const host = new Player('host');
    game.addPlayer(host);
    assert.strictEqual(game.canGameStart(), false);
  });

  it('Should return true if game can be started', () => {
    const host = new Player('host');
    const player1 = new Player('player1');
    const player2 = new Player('player2');
    game.addPlayer(host);
    game.addPlayer(player1);
    game.addPlayer(player2);

    assert.strictEqual(game.canGameStart(), true);
  });

  it('Should return false if game is not full', () => {
    const host = new Player('host');
    game.addPlayer(host);

    assert.strictEqual(game.isGameFull(), false);
  });

  it('Should return true if game is full', () => {
    game.addPlayer(new Player('host'));
    game.addPlayer(new Player('player1'));
    game.addPlayer(new Player('player2'));
    game.addPlayer(new Player('player3'));
    game.addPlayer(new Player('player4'));
    game.addPlayer(new Player('player5'));
    game.addPlayer(new Player('player6'));

    assert.strictEqual(game.isGameFull(), true);
  });

  it('Should return players with roles', () => {
    game.addPlayer(new Player('host'));
    game.addPlayer(new Player('player1'));
    game.addPlayer(new Player('player2'));

    const roles = ['a', 'b', 'c', 'd'];
    let currentPosition, color;
    const expected = [
      { username: 'host', role: 'a', currentPosition, isHost: true, color },
      { username: 'player1', role: 'b', currentPosition, isHost: false, color },
      { username: 'player2', role: 'c', currentPosition, isHost: false, color }
    ];
    game.assignRoles(roles);
    assert.deepStrictEqual(game.getPlayers(), expected);
  });

  it('Should return players with initial positions', () => {
    game.addPlayer(new Player('host'));
    game.addPlayer(new Player('player1'));
    game.addPlayer(new Player('player2'));

    const positions = [1, 2, 3];
    let role, color;
    const expected = [
      { username: 'host', role, currentPosition: 1, isHost: true, color },
      { username: 'player1', role, currentPosition: 2, isHost: false, color },
      { username: 'player2', role, currentPosition: 3, isHost: false, color }
    ];
    game.assignInitialPositions(positions);
    assert.deepStrictEqual(game.getPlayers(), expected);

  });
});