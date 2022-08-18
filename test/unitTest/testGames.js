const { Games } = require('../../src/models/games');
const assert = require('assert');

describe('games', () => {
  it('Should initialize game with given game data', () => {
    const playerData = {
      role: 'Mr. X',
      username: 'user',
      tickets: { taxi: 24, bus: 24, subway: 24, black: 5, twoX: 2 },
      isHost: true,
      color: 'black',
      currentPosition: 2,
      log: []
    };
    const gameData = {
      games: [
        {
          gameId: 1,
          isGameStarted: true,
          players: [playerData],
          currentPlayerIndex: 1
        }
      ],
      newGameId: 2
    };

    const stops = [];
    const games = new Games(stops);
    games.init(gameData);

    const game = games.findGame(1);
    const expected = {
      isGameStarted: true,
      players: [playerData]
    };

    assert.deepStrictEqual(game.getStatus(), expected);
  });

  it('Should create game', () => {
    const games = new Games({});
    const game = games.createGame();
    const expected = {
      isGameStarted: false,
      players: []
    };

    assert.deepStrictEqual(game.getStatus(), expected);
    assert.deepStrictEqual(game.gameId, 1);
  });

  it('Should return game with given gameId', () => {
    const games = new Games({});
    games.createGame();
    const game = games.findGame(1);
    const expected = {
      isGameStarted: false,
      players: []
    };

    assert.deepStrictEqual(game.getStatus(), expected);
    assert.deepStrictEqual(game.gameId, 1);
  });

  it('Should delete game', () => {
    const games = new Games({});
    games.createGame();
    games.deleteGame(1);
    const game = games.findGame(1);

    assert.ok(!game);
  });

  it('Should return all the games', () => {
    const games = new Games({});
    games.createGame();

    assert.strictEqual(games.getAllGames().length, 1);
    assert.strictEqual(games.getAllGames()[0].gameId, 1);
  });

  it('Should return serialized data of games when there are no games', () => {
    const games = new Games();
    const actual = games.getState();
    const expected = { 'newGameId': 1, 'games': [] };

    assert.deepStrictEqual(actual, expected);
  });

  it('Should return state of games when there is one game', () => {
    const games = new Games();
    games.createGame();
    const actual = games.getState();
    const expected = {
      newGameId: 2, games: [
        {
          isGameStarted: false,
          players: [],
          gameId: 1,
          currentPlayerIndex: undefined,
          round: 0,
          strandedPlayers: []
        }
      ]
    };

    assert.deepStrictEqual(actual, expected);
  });
});
