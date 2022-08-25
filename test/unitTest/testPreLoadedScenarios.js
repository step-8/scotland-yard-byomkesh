const { firstDetectiveStranded, detectivesCanWin } = require('../../src/utils/preLoadedScenarios.js');
const { detectiveLeftWithOneTicket } = require('../../src/utils/preLoadedScenarios.js');
const { twoXRevealationRound, } = require('../../src/utils/preLoadedScenarios.js');
const { mrXOnFerryStop } = require('../../src/utils/preLoadedScenarios.js');
const { mrXStranded } = require('../../src/utils/preLoadedScenarios.js');
const { allPlayerStranded } = require('../../src/utils/preLoadedScenarios.js');
const { lastRound } = require('../../src/utils/preLoadedScenarios.js');

const { mrX, red, green } = require('../../src/utils/roles.js');
const assert = require('assert');

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

const createGameData = () => {
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
  return gameData;
};

const createdExpectedData = (players) => {
  return {
    isGameStarted: true,
    players: players,
    currentPlayerIndex: 0, round: 0, gameOver: false,
    winningStatus: null
  };
};

describe('firstDetectiveStranded', () => {
  it('Should change all tickets of the first detective with zero', () => {
    //actual
    const gameData = createGameData();
    const newData = firstDetectiveStranded(gameData, 1);

    // expected
    const blankTickets = { taxi: 0, bus: 0, subway: 0, black: 0, twoX: 0 };
    const tickets = { taxi: 10, bus: 4, subway: 0, black: 0, twoX: 0 };
    const mrXTickets = { taxi: 10, bus: 4, subway: 0, black: 0, twoX: 0 };

    const player1 = createDummyPlayers('a', mrX, 19, mrXTickets);
    const player2 = createDummyPlayers('b', red, 43, blankTickets);
    const player3 = createDummyPlayers('c', green, 32, tickets);

    const expected = createdExpectedData([player1, player2, player3]);

    assert.deepStrictEqual(newData, expected);
  });
});

describe('allPlayerStranded', () => {
  it('Should change all tickets of all detectives with zero', () => {
    //actual
    const gameData = createGameData();
    const newData = allPlayerStranded(gameData, 1);

    // expected
    const blankTickets = { taxi: 0, bus: 0, subway: 0, black: 0, twoX: 0 };
    const mrXTickets = { taxi: 10, bus: 4, subway: 0, black: 0, twoX: 0 };

    const player1 = createDummyPlayers('a', mrX, 19, mrXTickets);
    const player2 = createDummyPlayers('b', red, 43, blankTickets);
    const player3 = createDummyPlayers('c', green, 32, blankTickets);

    const expected = createdExpectedData([player1, player2, player3]);

    assert.deepStrictEqual(newData, expected);
  });
});

describe('lastRound', () => {
  it('Should change round to 23 and fill log with 23 taxi', () => {
    const gameData = createGameData();
    const newData = lastRound(gameData, 1);

    assert.strictEqual(newData.round, 23);
    assert.strictEqual(newData.players[0].log.length, 23);
  });

  it('Should change round to 24 and fill log with 24 taxi', () => {
    const gameData = createGameData();
    gameData.currentPlayerIndex = 1;
    const newData = lastRound(gameData, 1);

    assert.strictEqual(newData.round, 24);
    assert.strictEqual(newData.players[0].log.length, 24);
  });
});

describe('detectiveLeftWithOneTicket', () => {
  it('Should change detectives taxi ticket to 1', () => {
    const gameData = createGameData();
    const newData = detectiveLeftWithOneTicket(gameData, 1);

    // expected
    const oneTaxiTickets = { taxi: 1, bus: 0, subway: 0, black: 0, twoX: 0 };
    const mrXTickets = { taxi: 10, bus: 4, subway: 0, black: 0, twoX: 0 };

    const player1 = createDummyPlayers('a', mrX, 19, mrXTickets);
    const player2 = createDummyPlayers('b', red, 43, oneTaxiTickets);
    const player3 = createDummyPlayers('c', green, 32, oneTaxiTickets);

    const expected = createdExpectedData([player1, player2, player3]);

    assert.deepStrictEqual(newData, expected);
  });
});

describe('twoXRevealationRound', () => {
  it('Should change round to 2 and add 2 taxi in log', () => {
    const gameData = createGameData();
    const newData = twoXRevealationRound(gameData, 1);

    assert.strictEqual(newData.round, 2);
    assert.strictEqual(newData.players[0].log.length, 2);
    assert.ok(newData.players[0].log.every(transport => transport === 'taxi'));
  });
});

describe('mrXOnFerryStop', () => {
  it('Should change round to 194', () => {
    const gameData = createGameData();
    const newData = mrXOnFerryStop(gameData, 1);

    assert.strictEqual(newData.players[0].currentPosition, 194);
  });
});

describe('mrXStranded', () => {
  it('Should change round to 194', () => {
    const gameData = createGameData();
    const newData = mrXStranded(gameData, 1);

    // expected
    const tickets = { taxi: 10, bus: 4, subway: 0, black: 0, twoX: 0 };
    const mrXTickets = { taxi: 10, bus: 4, subway: 0, black: 0, twoX: 0 };

    const player1 = createDummyPlayers('a', mrX, 21, mrXTickets);
    const player2 = createDummyPlayers('b', red, 33, tickets);
    const player3 = createDummyPlayers('c', green, 11, tickets);

    const expected = createdExpectedData([player1, player2, player3]);
    expected.currentPlayerIndex = 2;

    assert.deepStrictEqual(newData, expected);
  });
});

describe('detectivesCanWin', () => {
  it('Should detectives position and current player will be first detective', () => {
    const gameData = createGameData();
    const newData = detectivesCanWin(gameData, 1);

    // expected
    const tickets = { taxi: 1, bus: 1, subway: 1, black: 0, twoX: 0 };
    const mrXTickets = { taxi: 10, bus: 4, subway: 0, black: 0, twoX: 0 };

    const player1 = createDummyPlayers('a', mrX, 67, mrXTickets);
    const player2 = createDummyPlayers('b', red, 66, tickets);
    const player3 = createDummyPlayers('c', green, 65, tickets);

    const expected = createdExpectedData([player1, player2, player3]);
    expected.currentPlayerIndex = 1;

    assert.deepStrictEqual(newData, expected);
  });
});