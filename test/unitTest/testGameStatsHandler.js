const assert = require('assert');

const { getRobberLog, gameStats } = require('../../src/handlers/game.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');
const { roles, mrX } = require('../../src/utils/roles.js');

const DETECTIVE_TICKETS = { taxi: 10, bus: 8, subway: 4, black: 0, twoX: 0 };
const MR_X_TICKETS = { taxi: 24, bus: 24, subway: 24, black: 5, twoX: 2 };

const createDummyPlayers = (noOfPlayers) => {
  const initialPositions = [19, 43, 32, 74, 46, 73, 31];

  return Array(noOfPlayers).fill(0).map((_, index) => {
    const player = new Player(`player${index}`);

    player.assignRole(roles[index]);
    player.updatePosition(initialPositions[index]);

    return player;
  });
};

describe('gameStats handler', () => {
  it('Should return the stats for Mr. X.', () => {
    const games = new Games();
    const game = games.createGame();
    createDummyPlayers(3).forEach(player => game.addPlayer(player));
    game.changeGameStatus();

    const expectedData = {
      players: [
        {
          username: 'player0',
          role: mrX,
          currentPosition: 19,
          isHost: false,
          log: [],
          color: 'black',
          tickets: MR_X_TICKETS,
        },
        {
          username: 'player1',
          role: 'Detective Red',
          currentPosition: 43,
          isHost: false,
          log: [],
          color: 'red',
          tickets: DETECTIVE_TICKETS
        },
        {
          username: 'player2',
          role: 'Detective Green',
          currentPosition: 32,
          isHost: false,
          log: [],
          color: 'green',
          tickets: DETECTIVE_TICKETS
        }
      ],
      playerName: 'player0',
      currentPlayer: {
        username: 'player0',
        role: mrX,
        currentPosition: 19,
        isHost: false,
        log: [],
        color: 'black',
        tickets: MR_X_TICKETS
      },
      strandedPlayers: [],
      robberLog: [],
      round: 0,
      gameOver: false,
      winningStatus: null,
      leftPlayers: [],
      twoXTakenAt: null
    };
    const mockedRequest = { session: { username: 'player0', game } };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };

    gameStats(mockedRequest, mockedResponse);
  });

  it('Should return the stats for detective', () => {
    const games = new Games();
    const game = games.createGame();
    createDummyPlayers(3).forEach(player => game.addPlayer(player));
    game.changeGameStatus();

    const expectedData = {
      players: [
        {
          username: 'player0',
          role: 'Mr. X',
          currentPosition: null,
          isHost: false,
          log: [],
          color: 'black',
          tickets: MR_X_TICKETS
        },
        {
          username: 'player1',
          role: 'Detective Red',
          currentPosition: 43,
          isHost: false,
          log: [],
          color: 'red',
          tickets: DETECTIVE_TICKETS
        },
        {
          username: 'player2',
          role: 'Detective Green',
          currentPosition: 32,
          isHost: false,
          log: [],
          color: 'green',
          tickets: DETECTIVE_TICKETS
        }
      ],
      playerName: 'player1',
      currentPlayer: {
        username: 'player0',
        role: mrX,
        currentPosition: null,
        isHost: false,
        log: [],
        color: 'black',
        tickets: MR_X_TICKETS
      },
      robberLog: [],
      round: 0,
      strandedPlayers: [],
      gameOver: false,
      winningStatus: null,
      leftPlayers: [],
      twoXTakenAt: null
    };

    const mockedRequest = { session: { username: 'player1', game } };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };

    gameStats(mockedRequest, mockedResponse);
  });
});

describe('robberLog', () => {
  it('Should return empty array before robber\'s first move', () => {
    const players = [
      { username: 'player0', role: 'Mr. X', log: [] },
      { username: 'player1', role: 'Detective Red', log: [] },
      { username: 'player2', role: 'Detective Green', log: [] }
    ];
    const expected = [];
    assert.deepStrictEqual(getRobberLog(players), expected);
  });

  it('Should return taxi after robber used taxi in first move', () => {
    const players = [
      { username: 'player0', role: 'Mr. X', log: ['taxi'] },
      { username: 'player1', role: 'Detective Red', log: [] },
      { username: 'player2', role: 'Detective Green', log: [] }
    ];
    const expected = ['taxi'];
    assert.deepStrictEqual(getRobberLog(players), expected);
  });

  it('Should return taxi after robber used taxi in first move', () => {
    const players = [
      { username: 'player1', role: 'Detective Red', log: [] },
      { username: 'player2', role: 'Detective Green', log: [] }
    ];
    const expected = [];
    assert.deepStrictEqual(getRobberLog(players), expected);
  });
});
