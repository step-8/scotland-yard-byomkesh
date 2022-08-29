const { mrX } = require('./roles.js');

const lastRound = (gameData) => {
  const round = gameData.currentPlayerIndex === 0 ? 23 : 24;
  gameData.round = round;

  gameData.players.forEach(player => {
    if (player.role === mrX) {
      player.log = Array(round).fill('taxi');
      player.tickets.twoX = 0;
      player.twoXTakenAt = 20;
      player.tickets.taxi -= round;
      return;
    }
    player.tickets = { taxi: 1, bus: 0, subway: 0, black: 0, twoX: 0 };
  });

  return gameData;
};

const detectiveLeftWithOneTicket = (gameData) => {
  const positions = [13, 66, 65, 68, 102, 51];
  gameData.players.forEach((player, index) => {
    player.currentPosition = positions[index];
    if (player.role === mrX) {
      player.log = Array(21).fill('taxi');
      player.tickets = { ...player.tickets };
      player.tickets.taxi = 3;
      return;
    }
    player.tickets = { taxi: 1, bus: 0, subway: 0, black: 0, twoX: 0 };
  });
  gameData.currentPlayerIndex = 0;
  gameData.round = 21;

  return gameData;
};

const twoXRevealationRound = (gameData) => {
  gameData.round = 2;
  gameData.currentPlayerIndex = 0;

  gameData.players.forEach(player => {
    if (player.role === mrX) {
      player.log = Array(2).fill('taxi');
      player.tickets = { ...player.tickets };
      player.tickets.taxi = 22;
      return;
    }
    player.tickets = { taxi: 8, bus: 8, subway: 4, black: 0, twoX: 0 };
  });

  return gameData;
};

const mrXOnFerryStop = (gameData) => {
  const mrX = gameData.players[0];
  mrX.currentPosition = 194;

  return gameData;
};

const mrXStranded = (gameData) => {
  const positions = [21, 32, 11, 46, 47, 34];

  gameData.players.forEach((player, index) => {
    player.currentPosition = positions[index];
    if (player.role === mrX) {
      player.log = Array(6).fill('taxi');
      player.tickets = { ...player.tickets };
      player.tickets.taxi = 18;
      return;
    }
    player.tickets = { taxi: 5, bus: 8, subway: 4, black: 0, twoX: 0 };

  });
  gameData.currentPlayerIndex = 1;
  gameData.round = 6;

  return gameData;
};

const scenarios = {
  'scenario 1': lastRound,
  'scenario 2': detectiveLeftWithOneTicket,
  'scenario 3': twoXRevealationRound,
  'scenario 4': mrXOnFerryStop,
  'scenario 5': mrXStranded
};

module.exports = {
  scenarios, lastRound,
  detectiveLeftWithOneTicket, twoXRevealationRound,
  mrXOnFerryStop, mrXStranded
};
