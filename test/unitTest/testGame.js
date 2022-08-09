const assert = require('assert');
const { Game } = require('../../src/models/game.js');

describe('Games', () => {
  let game;
  beforeEach(() => {
    const gameId = 1;
    const stops = {};

    game = new Game(gameId, stops);
  });

  it('Should add player.', () => {
    game.addPlayer('host');
    const expected = ['host'];

    assert.deepStrictEqual(game.getPlayers(), expected);
  });

  it('Should return false if game cannot started', () => {
    game.addPlayer('host');
    assert.strictEqual(game.canGameStart(), false);
  });

  it('Should return true if game can be started', () => {
    game.addPlayer('host');
    game.addPlayer('player1');
    game.addPlayer('player2');

    assert.strictEqual(game.canGameStart(), true);
  });

  it('Should return true if game can be started', () => {
    game.addPlayer('host');
    game.addPlayer('player1');
    game.addPlayer('player2');

    assert.strictEqual(game.canGameStart(), true);
  });

  it('Should return false if game is not full', () => {
    game.addPlayer('host');

    assert.strictEqual(game.isGameFull(), false);
  });

  it('Should return true if game is full', () => {
    game.addPlayer('host');
    game.addPlayer('player1');
    game.addPlayer('player2');
    game.addPlayer('player3');
    game.addPlayer('player4');
    game.addPlayer('player5');

    assert.strictEqual(game.isGameFull(), true);
  });
});