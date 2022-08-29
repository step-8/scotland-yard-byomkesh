const { assert } = require('chai');
const sinon = require('sinon');

const { redirectToGame } = require('../../src/middleware/blockInvalidAccess.js');
const { Game } = require('../../src/models/game.js');
const { Player } = require('../../src/models/player.js');
const { mrX, red } = require('../../src/utils/roles.js');

const DETECTIVE_TICKETS = { taxi: 10, bus: 8, subway: 4, black: 0, twoX: 0 };
const MR_X_TICKETS = { taxi: 24, bus: 24, subway: 24, black: 5, twoX: 2 };

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

describe('Game', () => {
  let game;
  beforeEach(() => {
    const gameId = 1;
    const stops = {};
    game = new Game(gameId, stops);
  });

  it('Should add player.', () => {
    let currentPosition, role, color;
    const player = new Player('host');
    game.addPlayer(player);
    const expected = {
      players: [
        { currentPosition, isHost: false, log: [], role, username: 'host', color, tickets: undefined }
      ],
      isGameStarted: false
    };

    assert.deepStrictEqual(game.getStatus(), expected);
  });

  it('Should remove player ', () => {
    let currentPosition, role, color;
    const player = new Player('host');
    const player1 = new Player('joinee');
    game.addPlayer(player);
    game.addPlayer(player1);
    game.removePlayer('joinee');
    const expected = {
      players: [
        { currentPosition, isHost: false, log: [], role, username: 'host', color, tickets: undefined }
      ],
      isGameStarted: false
    };
    assert.deepStrictEqual(game.getStatus(), expected);
  });

  it('Should return true if the player is host', () => {
    const player = new Player('host');
    game.addPlayer(player);

    assert.ok(game.isHost('host'));
  });

  it('Should return false if game cannot started', () => {
    const host = new Player('host');
    game.addPlayer(host);
    assert.strictEqual(game.canGameStart(), false);
  });

  it('Should return true if game can be started', () => {
    const host = new Player('host');
    const player1 = new Player('player1');
    const player2 = new Player('player2');
    game.addPlayer(host);
    game.addPlayer(player1);
    game.addPlayer(player2);

    assert.strictEqual(game.canGameStart(), true);
  });

  it('Should return false if game is not full', () => {
    const host = new Player('host');
    game.addPlayer(host);

    assert.strictEqual(game.isGameFull(), false);
  });

  it('Should return true if game is full', () => {
    game.addPlayer(new Player('host'));
    game.addPlayer(new Player('player1'));
    game.addPlayer(new Player('player2'));
    game.addPlayer(new Player('player3'));
    game.addPlayer(new Player('player4'));
    game.addPlayer(new Player('player5'));
    game.addPlayer(new Player('player6'));

    assert.strictEqual(game.isGameFull(), true);
  });

  it('Should return players with roles', () => {
    game.addPlayer(new Player('host'));
    game.addPlayer(new Player('player1'));
    game.addPlayer(new Player('player2'));

    const roles = ['Mr. X', 'b', 'c', 'd'];
    let currentPosition, color;
    const expected = [
      { username: 'host', role: 'Mr. X', currentPosition, isHost: false, log: [], color: 'black', tickets: MR_X_TICKETS },
      { username: 'player1', role: 'b', currentPosition, isHost: false, log: [], color, tickets: DETECTIVE_TICKETS },
      { username: 'player2', role: 'c', currentPosition, isHost: false, log: [], color, tickets: DETECTIVE_TICKETS }
    ];
    game.assignRoles(roles);
    assert.deepStrictEqual(game.getPlayers(), expected);
  });

  it('Should return players with initial positions', () => {
    game.addPlayer(new Player('host'));
    game.addPlayer(new Player('player1'));
    game.addPlayer(new Player('player2'));

    const positions = [1, 2, 3];
    let role, color, tickets;
    const expected = [
      { username: 'host', role, currentPosition: 1, isHost: false, log: [], color, tickets },
      { username: 'player1', role, currentPosition: 2, isHost: false, log: [], color, tickets },
      { username: 'player2', role, currentPosition: 3, isHost: false, log: [], color, tickets }
    ];
    game.assignInitialPositions(positions);
    assert.deepStrictEqual(game.getPlayers(), expected);

  });

  it('Should update position and tickets of current player and change current player.', () => {
    game.addPlayer(new Player('host'));
    game.addPlayer(new Player('player1'));
    game.addPlayer(new Player('player2'));

    const tickets = { taxi: 10, bus: 8, subway: 4, black: 0, twoX: 0 };
    const expected = [
      { username: 'host', role: 'Mr. X', currentPosition: 1, isHost: false, log: [], color: 'black', tickets: { taxi: 24, bus: 24, subway: 24, black: 5, twoX: 2 } },
      { username: 'player1', role: 'Detective Red', currentPosition: 2, isHost: false, log: [], color: 'red', tickets },
      { username: 'player2', role: 'Detective Green', currentPosition: 3, isHost: false, log: [], color: 'green', tickets }
    ];

    const positions = [1, 2, 3];
    game.assignInitialPositions(positions);
    game.assignRoles(['Mr. X', 'Detective Red', 'Detective Green']);
    game.changeGameStatus();

    assert.deepStrictEqual(game.getPlayers(), expected);
  });

  it('Should initialize the game', () => {

    const gameData = {
      isGameStarted: true, players: [], currentPlayerIndex: 0, round: 0, gameOver: false,
      winningStatus: null, leftPlayers: [],
      twoXTakenAt: null
    };
    const game = new Game(1, {});
    game.init(gameData);
    const expected = {
      gameId: 1,
      isGameStarted: true,
      players: [],
      currentPlayerIndex: 0,
      round: 0,
      strandedPlayers: [],
      gameOver: false,
      twoXTakenAt: null,
      winningStatus: null,
      leftPlayers: []
    };

    assert.deepStrictEqual(game.getState(), expected);
  });

  it('Should send game over and winning status in game state', () => {
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
    const buses = [], subways = [], ferries = [];
    const stops = {
      19: { taxies: [1, 2, 32, 43], buses, subways, ferries },
      43: { taxies: [1, 2, 19, 74], buses, subways: [74], ferries },
      32: { taxies: [1, 2, 19], buses, subways, ferries },
      74: { taxies: [1, 2, 43], buses, subways: [43], ferries },
    };

    const player1 = createDummyPlayers('a', mrX, 43, mrXTickets);
    const player2 = createDummyPlayers('b', red, 43, tickets);
    const gameData = {
      isGameStarted: true,
      players: [player1, player2],
      currentPlayerIndex: 1, round: 0, gameOver: false,
      winningStatus: null,
      leftPlayers: []
    };

    const game = new Game(1, stops);
    game.init(gameData);
    game.changeCurrentPlayer();
    const { winningStatus, gameOver } = game.getState();
    assert.deepStrictEqual(winningStatus, 2);
    assert.deepStrictEqual(gameOver, true);
  });

  it('Should send game over and winning status for mrX in game state', () => {
    const tickets = {
      taxi: 0,
      bus: 0,
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
    const buses = [], subways = [], ferries = [];
    const stops = {
      19: { taxies: [1, 2, 32, 43], buses, subways, ferries },
      43: { taxies: [1, 2, 19, 74], buses, subways: [74], ferries },
      32: { taxies: [1, 2, 19], buses, subways, ferries },
      74: { taxies: [1, 2, 43], buses, subways: [43], ferries },
    };

    const player1 = createDummyPlayers('a', mrX, 32, mrXTickets);
    const player2 = createDummyPlayers('b', red, 43, tickets);
    const gameData = {
      isGameStarted: true,
      players: [player1, player2],
      currentPlayerIndex: 1, round: 2, gameOver: false,
      winningStatus: null,
      leftPlayers: []
    };

    const game = new Game(1, stops);
    game.init(gameData);
    game.changeCurrentPlayer();
    const { winningStatus, gameOver } = game.getState();
    assert.deepStrictEqual(winningStatus, 9);
    assert.deepStrictEqual(gameOver, true);
  });

  it('Should send game over and winning status when 24 rounds are over for mrX in game state', () => {
    const tickets = {
      taxi: 0,
      bus: 0,
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
    const buses = [], subways = [], ferries = [];
    const stops = {
      19: { taxies: [1, 2, 32, 43], buses, subways, ferries },
      43: { taxies: [1, 2, 19, 74], buses, subways: [74], ferries },
      32: { taxies: [1, 2, 19], buses, subways, ferries },
      74: { taxies: [1, 2, 43], buses, subways: [43], ferries },
    };

    const player1 = createDummyPlayers('a', mrX, 43, mrXTickets);
    const player2 = createDummyPlayers('b', red, 43, tickets);
    const gameData = {
      isGameStarted: true,
      players: [player1, player2],
      currentPlayerIndex: 1, round: 24, gameOver: false,
      winningStatus: null,
      leftPlayers: []
    };

    const game = new Game(1, stops);
    game.init(gameData);
    game.changeCurrentPlayer();
    const { winningStatus, gameOver } = game.getState();
    assert.deepStrictEqual(winningStatus, 2);
    assert.deepStrictEqual(gameOver, true);
  });

  it('should left the player from game', () => {
    const tickets = {};
    const mrXTickets = {};
    const stops = {
      19: {},
      43: {},
    };

    const player1 = createDummyPlayers('a', mrX, 43, mrXTickets);
    const player2 = createDummyPlayers('b', red, 43, tickets);
    const gameData = {
      isGameStarted: true,
      players: [player1, player2],
      currentPlayerIndex: 1, round: 24, gameOver: false,
      winningStatus: null,
      leftPlayers: []
    };

    const game = new Game(1, stops);
    game.init(gameData);
    game.addToInactive('a');
    const { leftPlayers } = game.getState();

    assert.deepEqual(leftPlayers[0, player1]);
  });

  it('should end the game ', () => {
    const tickets = {};
    const mrXTickets = {};
    const stops = {
      19: {},
      43: {},
    };

    const player1 = createDummyPlayers('a', mrX, 43, mrXTickets);
    const player2 = createDummyPlayers('b', red, 43, tickets);
    const gameData = {
      isGameStarted: true,
      players: [player1, player2],
      currentPlayerIndex: 1, round: 24, gameOver: false,
      leftPlayers: [],
      winningStatus: null
    };

    const game = new Game(1, stops);
    game.init(gameData);
    game.setGameOver(1);
    const { gameOver, winningStatus } = game.getState();

    assert.deepEqual(gameOver, true);
    assert.deepEqual(winningStatus, 1);
  });

  it('should return true when all the detectives are left ', () => {
    const tickets = {};
    const mrXTickets = {};
    const stops = {
      19: {},
      43: {},
    };

    const player1 = createDummyPlayers('a', mrX, 43, mrXTickets);
    const player2 = createDummyPlayers('b', red, 43, tickets);
    const gameData = {
      isGameStarted: true,
      players: [player1, player2],
      currentPlayerIndex: 1, round: 24, gameOver: false,
      leftPlayers: [player2],
      winningStatus: null
    };

    const game = new Game(1, stops);
    game.init(gameData);
    const expected = game.haveAllDetectivesLeft();

    assert.ok(expected);
  });

  it('should return true when all the detectives are left ', () => {
    const tickets = {};
    const mrXTickets = {};
    const stops = {
      19: {},
      43: {},
    };

    const player1 = createDummyPlayers('a', mrX, 43, mrXTickets);
    const player2 = createDummyPlayers('b', red, 43, tickets);
    const gameData = {
      isGameStarted: true,
      players: [player1, player2],
      currentPlayerIndex: 1, round: 24, gameOver: false,
      leftPlayers: [],
      winningStatus: null
    };

    const game = new Game(1, stops);
    game.init(gameData);
    const expected = game.haveAllDetectivesLeft();

    assert.deepEqual(expected, false);
  });

});

describe('game', () => {
  it('should redirect to /game from game', () => {
    const req = { session: {} };
    const res = {};
    const next = sinon.stub();

    redirectToGame(req, res, next);
    assert.ok(next.calledOnce);

  });

  it('should redirect to /game from game on invalid request', () => {
    const req = { session: { game: { isStarted: true } } };
    const res = { redirect: sinon.stub() };
    const next = () => { };

    redirectToGame(req, res, next);
    assert.ok(res.redirect.calledOnce);

  });

  it('should invoke next when player is not in game ', () => {
    const req = { url: '/login', session: {} };
    const res = {};
    const next = sinon.stub();

    redirectToGame(req, res, next);
    assert.ok(next.calledOnce);

  });
});
