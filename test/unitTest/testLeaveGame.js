const { assert } = require('chai');
const sinon = require('sinon');
const { leaveGame, makeDetectiveLeft } = require('../../src/handlers/leaveGame');


describe('Game', () => {
  it('Should left the player from game', () => {
    const game = {
      addAsLeft: sinon.stub(),
      areAllDetectivesLeft: () => false,
      gameOver: () => { }
    };
    const player = {}
    makeDetectiveLeft(game, player);
    assert.ok(game.addAsLeft.calledOnce);

  });

  it('Should finish the game when all the detectives are left', () => {
    const game = {
      addAsLeft: () => { },
      areAllDetectivesLeft: () => true,
      gameOver: sinon.stub()
    };
    const player = {}
    makeDetectiveLeft(game, player);
    assert.ok(game.gameOver.calledOnce);

  });
});
