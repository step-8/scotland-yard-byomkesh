const { detectiveLeftWithOneTicket } = require('../../src/utils/preLoadedScenarios.js');
const { twoXRevealationRound, } = require('../../src/utils/preLoadedScenarios.js');
const { mrXOnFerryStop } = require('../../src/utils/preLoadedScenarios.js');
const { mrXStranded } = require('../../src/utils/preLoadedScenarios.js');
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
    bus: 8,
    subway: 4,
    black: 0,
    twoX: 0
  };
  const mrXTickets = {
    taxi: 24,
    bus: 24,
    subway: 24,
    black: 5,
    twoX: 2
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

  it('Should change player taxi ticket to 1', () => {
    const gameData = createGameData();
    const newData = lastRound(gameData, 1);
    const expectedTickets = { taxi: 1, bus: 0, subway: 0, black: 0, twoX: 0 };

    assert.deepStrictEqual(newData.players[1].tickets, expectedTickets);
    assert.deepStrictEqual(newData.players[2].tickets, expectedTickets);
  });

});

describe('detectiveLeftWithOneTicket', () => {
  it('Should change detectives taxi ticket to 1', () => {
    const gameData = createGameData();
    const newData = detectiveLeftWithOneTicket(gameData, 1);

    const expectedTickets = { taxi: 1, bus: 0, subway: 0, black: 0, twoX: 0 };

    const positions = [13, 66, 65, 68, 102, 51];
    newData.players.forEach((player, index) => {
      assert.strictEqual(player.currentPosition, positions[index]);
    });
    assert.deepStrictEqual(newData.players[1].tickets, expectedTickets);
    assert.deepStrictEqual(newData.players[2].tickets, expectedTickets);
    assert.strictEqual(newData.currentPlayerIndex, 0);
    assert.strictEqual(newData.players[0].log.length, 21);
    assert.ok(
      newData.players[0].log.every(transport => transport === 'taxi')
    );
  });
});

describe('twoXRevealationRound', () => {
  it('Should change round to 2 and add 2 taxi in log', () => {
    const gameData = createGameData();
    const newData = twoXRevealationRound(gameData, 1);
    const expectedTickets = { taxi: 8, bus: 8, subway: 4, black: 0, twoX: 0 };

    assert.deepStrictEqual(newData.players[1].tickets, expectedTickets);
    assert.deepStrictEqual(newData.players[2].tickets, expectedTickets);
    assert.strictEqual(newData.round, 2);
    assert.strictEqual(newData.players[0].log.length, 2);
    assert.ok(
      newData.players[0].log.every(transport => transport === 'taxi')
    );
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
    const expectedTickets = { taxi: 5, bus: 8, subway: 4, black: 0, twoX: 0 };

    const positions = [21, 32, 11, 46, 47, 34];
    newData.players.forEach((player, index) => {
      assert.strictEqual(player.currentPosition, positions[index]);
    });
    assert.deepStrictEqual(newData.players[1].tickets, expectedTickets);
    assert.deepStrictEqual(newData.players[2].tickets, expectedTickets);
    assert.strictEqual(newData.round, 6);
    assert.strictEqual(newData.currentPlayerIndex, 1);
    assert.strictEqual(newData.players[0].log.length, 6);
    assert.ok(
      newData.players[0].log.every(transport => transport === 'taxi')
    );
  });
});
