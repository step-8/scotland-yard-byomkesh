const { assert } = require('chai');
const { skipTurn } = require('../../src/handlers/gameAPI.js');
const { Games } = require('../../src/models/games.js');
const { green, mrX } = require('../../src/utils/roles.js');

const createDummyPlayers = (role, position, tickets) => {
  const player = {
    username: 'a',
    role,
    currentPosition: position,
    isHost: true,
    color: 'green',
    tickets,
    log: []
  };
  return player;
};

describe('Skip Turn', () => {
  let games;
  const buses = [], subways = [], ferries = [];

  beforeEach(() => {
    const stops = {
      19: { taxies: [1, 2, 32, 43], buses, subways, ferries },
      43: { taxies: [1, 2, 19, 74], buses, subways: [74], ferries },
      32: { taxies: [1, 2, 19], buses, subways, ferries },
      74: { taxies: [1, 2, 43], buses, subways: [43], ferries },
    };
    games = new Games(stops);
  });

  it('Should pass the turn to next player', () => {
    const player1 = createDummyPlayers(mrX, 74, {});
    const player2 = createDummyPlayers(green, 43, {});
    const gamesData = {
      newGameId: 2,
      games: [{
        players: [player1, player2],
        isGameStarted: true,
        gameId: 1,
        currentPlayerIndex: 0,
        leftPlayers: []
      }]
    };

    games.init(gamesData);

    const expectedData = createDummyPlayers(green, 43, {});
    const mockedRequest = {
      session: { username: 'a', game: games.findGame(1) }
    };

    const mockedResponse = {

      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };

    skipTurn(() => { })(mockedRequest, mockedResponse);
  });
});
