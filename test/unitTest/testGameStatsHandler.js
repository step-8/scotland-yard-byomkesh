const assert = require('assert');

const { gameStats } = require('../../src/handlers/game.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');

const createDummyPlayers = (noOfPlayers) => {
  const roles = [
    'Mr. X', 'Det. red', 'Det. green',
    'Det. blue', 'Det. yellow', 'Det. purple'
  ];
  const initialPositions = [19, 43, 32, 74, 46, 73, 31];

  return Array(noOfPlayers).fill(0).map((_, index) => {
    const player = new Player(`player${index}`);

    player.assignRole(roles[index]);
    player.updatePosition(initialPositions[index]);

    return player;
  })
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
          role: 'Mr. X',
          currentPosition: 19,
          isHost: true,
          color: 'black',
        },
        {
          username: 'player1',
          role: 'Det. red',
          currentPosition: 43,
          isHost: false,
          color: 'red',
        },
        {
          username: 'player2',
          role: 'Det. green',
          currentPosition: 32,
          isHost: false,
          color: 'green',
        }
      ],
      playerName: 'player0',
      currentPlayer: {
        username: 'player0',
        role: 'Mr. X',
        currentPosition: 19,
        isHost: true,
        color: 'black',
      }
    }
    const mockedRequest = { session: { username: 'player0', game } };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData)
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
          username: 'player1',
          role: 'Det. red',
          currentPosition: 43,
          isHost: false,
          color: 'red',
        },
        {
          username: 'player2',
          role: 'Det. green',
          currentPosition: 32,
          isHost: false,
          color: 'green',
        }
      ],
      playerName: 'player1',
      currentPlayer: {
        username: 'player0',
        role: 'Mr. X',
        currentPosition: null,
        isHost: true,
        color: 'black',
      }
    }
    const mockedRequest = { session: { username: 'player1', game } };
    const mockedResponse = {
      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData)
      }
    };

    gameStats(mockedRequest, mockedResponse);
  });
});