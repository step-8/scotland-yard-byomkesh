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
    const player = new Player('host')
    game.addPlayer(player);
    const expected = { players: [{ currentPosition: undefined, isHost: true, role: undefined, username: 'host' }], isGameStarted: false };

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
});