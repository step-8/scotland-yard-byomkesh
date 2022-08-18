const assert = require('assert');
const { validStops } = require('../../src/handlers/gameAPI.js');
const { Games } = require('../../src/models/games.js');
const { green, mrX, red } = require('../../src/utils/roles.js');

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

describe('Valid stops', () => {
  let games;
  let tickets;
  const buses = [], subways = [], ferries = [];

  beforeEach(() => {
    const stops = {
      19: { taxies: [1, 2, 32, 43], buses, subways, ferries },
      43: { taxies: [1, 2, 19, 74], buses, subways: [74], ferries },
      32: { taxies: [1, 2, 19], buses, subways, ferries },
      74: { taxies: [1, 2, 43], buses, subways: [43], ferries },
    };
    tickets = {
      taxi: 10,
      bus: 8,
      subway: 4,
      black: 0,
      twoX: 0
    };
    games = new Games(stops);
  });

  it('Should provide all connected stops as valid stops to Mr. X', () => {
    const player1 = createDummyPlayers(mrX, 74, tickets);
    const gamesData = {
      newGameId: 2,
      games: [{
        players: [player1],
        isGameStarted: true,
        gameId: 1,
        currentPlayerIndex: 0
      }]
    };

    games.init(gamesData);
    const expectedData = { taxies: [1, 2, 43], buses, subways: [43], ferries };
    const mockedRequest = {
      session: { username: 'a', game: games.findGame(1) }
    };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };

    validStops(mockedRequest, mockedResponse);
  });

  it('should provide valid stops of detective which are not blocked by other detectives', () => {
    const player1 = createDummyPlayers(green, 74, tickets);
    const player2 = createDummyPlayers(red, 43, tickets);
    const gamesData = {
      newGameId: 2,
      games: [{
        players: [player1, player2],
        isGameStarted: true,
        gameId: 1,
        currentPlayerIndex: 0
      }]
    };

    games.init(gamesData);

    const expectedData = {
      taxies: [1, 2], buses, subways, ferries
    };
    const mockedRequest = {
      session: { username: 'a', game: games.findGame(1) }
    };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };
    validStops(mockedRequest, mockedResponse);
  });

  it('should provide valid stops of detective even Mr. X is present on a stop', () => {
    const player1 = createDummyPlayers(green, 74, tickets);
    const player2 = createDummyPlayers(mrX, 43, tickets);
    const gamesData = {
      newGameId: 2,
      games: [{
        players: [player1, player2],
        isGameStarted: true,
        gameId: 1,
        currentPlayerIndex: 0
      }]
    };

    games.init(gamesData);

    const expectedData = {
      taxies: [1, 2, 43], buses, subways: [43], ferries
    };
    const mockedRequest = {
      session: { username: 'a', game: games.findGame(1) }
    };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };
    validStops(mockedRequest, mockedResponse);
  });

  it('should not give stops for which user doesn\'t have tickets', () => {
    const tickets = {
      taxi: 10,
      bus: 8,
      subway: 0,
      black: 0,
      twoX: 0
    };
    const player = createDummyPlayers(green, 74, tickets);
    const gamesData = {
      newGameId: 2,
      games: [{
        players: [player],
        isGameStarted: true,
        gameId: 1,
        currentPlayerIndex: 0
      }]
    };

    games.init(gamesData);

    const expectedData = {
      taxies: [1, 2, 43], buses, subways, ferries
    };
    const mockedRequest = {
      session: { username: 'a', game: games.findGame(1) }
    };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };

    validStops(mockedRequest, mockedResponse);
  });
});
