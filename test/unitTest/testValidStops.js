const assert = require('assert');

const { validStops } = require('../../src/handlers/gameAPI.js');
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

describe('Valid stops', () => {
  let game;
  beforeEach(() => {
    const stops = {
      19: { taxies: [1, 2, 32, 43] },
      43: { taxies: [1, 2, 19, 74] },
      32: { taxies: [1, 2, 19] },
      74: { taxies: [1, 2, 43] },
    }
    const games = new Games(stops);
    game = games.createGame();
    createDummyPlayers(3).forEach(player => game.addPlayer(player));
    game.changeGameStatus();
  })

  it('Should provide all connected stops as valid stops to Mr. X', () => {
    const expectedData = { taxies: [1, 2] };

    const mockedRequest = { session: { username: 'player0', game } };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };

    validStops(mockedRequest, mockedResponse);
  });

  it('should provide valid stops of detective which are not blocked by other detectives', () => {
    const expectedData = {
      taxies: [1, 2, 19, 74]
    };

    const mockedRequest = { session: { username: 'player1', game } };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };
    validStops(mockedRequest, mockedResponse);
  });

  it('should provide valid stops of detective even Mr. X is present on a stop', () => {
    const expectedData = {
      taxies: [1, 2, 19]
    };

    const mockedRequest = { session: { username: 'player2', game } };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };
    validStops(mockedRequest, mockedResponse);
  });
});
