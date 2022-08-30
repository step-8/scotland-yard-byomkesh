const assert = require("assert");
const { mrX, red, green } = require('../../src/utils/roles.js');
const { loadGame, serveLoadGamePage } = require("../../src/handlers/loadGameHandler");
const { Game } = require("../../src/models/game.js");

const createDummyPlayers = (username, role, position, tickets) => {
  const player = {
    username,
    role,
    currentPosition: position,
    isHost: true,
    color: 'green',
    tickets,
    log: []
  };
  return player;
};

const createGame = () => {
  const tickets = {
    taxi: 10,
    bus: 4,
    subway: 0,
    black: 0,
    twoX: 0
  };
  const mrXTickets = {
    taxi: 10,
    bus: 4,
    subway: 0,
    black: 0,
    twoX: 0
  };

  const player1 = createDummyPlayers('a', mrX, 19, mrXTickets);
  const player2 = createDummyPlayers('b', red, 43, tickets);
  const player3 = createDummyPlayers('c', green, 32, tickets);
  const gameData = {
    isGameStarted: true,
    players: [player1, player2, player3],
    currentPlayerIndex: 0, round: 0, gameOver: false,
    winningStatus: null
  };
  const game = new Game({}, 1);
  game.init(gameData);
  return game;
};

describe('loadGame', () => {
  it('Should redirect to /load-game and set a cookie', () => {
    const game = createGame();
    const games = {
      findGame: () => game
    };

    const req = { body: { gameId: 1, scenario: 'scenario 1' } };
    const res = {
      cookie: (key, value) => {
        assert.strictEqual(key, 'success');
        assert.strictEqual(value, 'Loaded game.');
      },
      redirect: (url) => assert.strictEqual(url, '/load-game')
    };
    const gameLoader = loadGame(games, (_, cb) => cb());
    gameLoader(req, res);
  });

  it('Should redirect to /load-game and set a cookie containing error', () => {
    const game = createGame();
    const games = {
      findGame: () => game
    };

    const req = { body: { gameId: 1 } };
    const res = {
      cookie: (key, value) => {
        assert.strictEqual(key, 'loadGameError');
        assert.strictEqual(value, 'Something went wrong. Try again.');
      },
      redirect: (url) => assert.strictEqual(url, '/load-game')
    };
    const gameLoader = loadGame(games, (_, cb) => cb());
    gameLoader(req, res);
  });

  it('Should change the game state', () => {
    const game = createGame();
    const games = {
      findGame: () => game
    };

    const req = { body: { gameId: 1, scenario: 'scenario 1' } };
    const res = {
      cookie: () => { },
      redirect: (url) => assert.strictEqual(url, '/load-game')
    };
    const gameLoader = loadGame(games, (_, cb) => cb());
    gameLoader(req, res);

    assert.deepStrictEqual(
      game.getPlayers()[1].tickets,
      { taxi: 1, bus: 0, subway: 0, black: 0, twoX: 0 }
    );
  });
});

describe('serveLoadGamePage', () => {
  it('Should serve load-game page', () => {
    const res = {
      sendFile: (filename, { root }) => {
        assert.strictEqual(filename, 'loadGame.html');
        assert.strictEqual(root, '/public');
      }
    };
    const pageServer = serveLoadGamePage('/public');
    pageServer({}, res);
  });
});
