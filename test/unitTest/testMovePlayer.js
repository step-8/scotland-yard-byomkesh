const { assert } = require('chai');

const { movePlayer } = require('../../src/handlers/gameAPI.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');
const { roles } = require('../../src/utils/roles.js');

const createDummyPlayers = (noOfPlayers) => {

  const initialPositions = [19, 43, 32, 74, 46, 73, 31];

  return Array(noOfPlayers).fill(0).map((_, index) => {
    const player = new Player(`player${index}`);

    player.assignRole(roles[index]);
    player.updatePosition(initialPositions[index]);

    return player;
  });
};

describe('Move Player', () => {
  let game;
  beforeEach(() => {
    const stops = {
      19: { taxies: [1, 2, 32, 43] },
      43: { taxies: [1, 2, 19, 74] },
      32: { taxies: [1, 2, 19] },
      74: { taxies: [1, 2, 43] },
    };
    const games = new Games(stops);
    game = games.createGame();
    createDummyPlayers(3).forEach(player => game.addPlayer(player));
    game.changeGameStatus();
  });

  it('Should move to destination if it is a valid stop', () => {
    const expectedData = { isMoved: true };

    const body = { destination: 1, ticket: 'taxi' };
    const mockedRequest = { session: { username: 'player0', game }, body };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };

    movePlayer(() => { })(mockedRequest, mockedResponse);
  });

  it('Should not move to destination if it is not a valid stop', () => {
    const expectedData = { isMoved: false };

    const body = { destination: 74 };
    const mockedRequest = { session: { username: 'player0', game }, body };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };

    movePlayer(() => { })(mockedRequest, mockedResponse);
  });

  it('Should not move to destination if current player is not requested player', () => {
    const expectedData = { isMoved: false };

    const body = { destination: 1 };
    const mockedRequest = { session: { username: 'player1', game }, body };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };

    movePlayer(() => { })(mockedRequest, mockedResponse);
  });

  it('Should change the current player and let the next player move', () => {
    // player0 plays
    let expectedData = { isMoved: true };
    let body = { destination: 1, ticket: 'taxi' };

    let mockedRequest = { session: { username: 'player0', game }, body };
    let mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };
    movePlayer(() => { })(mockedRequest, mockedResponse);
    // player0 played sucessfully
    //-----------
    // player1 plays
    expectedData = { isMoved: true };
    body = { destination: 2, ticket: 'taxi' };

    mockedRequest = { session: { username: 'player1', game }, body };
    mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };
    movePlayer(() => { })(mockedRequest, mockedResponse);
    // player1 played sucessfully
  });
});
