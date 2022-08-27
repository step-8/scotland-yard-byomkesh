const { assert } = require('chai');
const sinon = require('sinon');
const { leaveGame, makePlayerLeft, addPlayerAsLeft } = require('../../src/handlers/leaveGame.js');


describe('Game', () => {
  it('Should left the player from game', () => {
    const game = {
      addAsLeft: sinon.stub(),
      areAllDetectivesLeft: () => false,
      gameOver: () => { }
    };
    const player = { isMrX: sinon.stub() }
    makePlayerLeft(game, player);
    assert.ok(game.addAsLeft.calledOnce);
    assert.ok(player.isMrX.calledOnce);
  });

  it('Should finish the game when all the detectives are left', () => {
    const game = {
      addAsLeft: () => { },
      areAllDetectivesLeft: () => true,
      gameOver: sinon.stub()
    };
    const player = { isMrX: sinon.stub() }
    makePlayerLeft(game, player);
    assert.ok(game.gameOver.calledOnce);
    assert.ok(player.isMrX.calledOnce);
  });

  it('Should left the player from the game when player leave the game', () => {
    const leftPlayer = { isMrX: sinon.stub() };

    const game = {
      areAllDetectivesLeft: sinon.stub(),
      addAsLeft: () => { },
      gameOver: () => { },
      findPlayer: () => { return leftPlayer },
    };
    const player = {}
    addPlayerAsLeft(game, player);
    assert.ok(leftPlayer.isMrX.calledOnce);
    assert.ok(game.areAllDetectivesLeft.calledOnce);
  });

  it('Should finish the game when Mr. X left the game', () => {
    const leftPlayer = { isMrX: () => true };

    const game = {
      areAllDetectivesLeft: sinon.stub(),
      addAsLeft: () => { },
      gameOver: sinon.stub(),
      findPlayer: () => { return leftPlayer },
    };
    const player = {}
    addPlayerAsLeft(game, player);
    assert.ok(game.gameOver.calledOnce);
  });

  it('Player should go to landing page when player leaves the game', () => {
    const persistGames = sinon.stub();
    const leftPlayer = { isMrX: sinon.stub() };

    const req = {
      session: {
        username: 'a',
        game: {
          areAllDetectivesLeft: () => false,
          addAsLeft: () => { },
          gameOver: () => { },
          findPlayer: () => { return leftPlayer },
        },
        gameId: 1
      }
    };

    const res = {
      redirect: sinon.stub()
    };

    leaveGame(persistGames)(req, res);
    assert.ok(persistGames.calledOnce);

  });
});
