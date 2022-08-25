const { mrX } = require('./roles.js');

const firstDetectiveStranded = (gameData) => {
  const firstDetective = gameData.players[1];
  firstDetective.tickets = { taxi: 0, bus: 0, subway: 0, black: 0, twoX: 0 };

  return gameData;
};

const allPlayerStranded = (gameData) => {
  gameData.players.forEach(player => {
    if (player.role === mrX) {
      return;
    }
    player.tickets = { taxi: 0, bus: 0, subway: 0, black: 0, twoX: 0 };
  });

  return gameData;
};

const lastRound = (gameData) => {
  const mrX = gameData.players[0];
  const round = gameData.currentPlayerIndex === 0 ? 23 : 24;
  mrX.log = Array(round).fill('taxi');
  gameData.round = round;
  mrX.tickets.twoX = 0;
  mrX.twoXTakenAt = null;

  return gameData;
};

const detectiveLeftWithOneTicket = (gameData) => {
  gameData.players.forEach(player => {
    if (player.role === mrX) {
      return;
    }
    player.tickets = { taxi: 1, bus: 0, subway: 0, black: 0, twoX: 0 };
  });

  return gameData;
};

const twoXRevealationRound = (gameData) => {
  const mrX = gameData.players[0];
  mrX.log = Array(2).fill('taxi');
  gameData.round = 2;
  gameData.currentPlayerIndex = 0;

  return gameData;
};

const mrXOnFerryStop = (gameData) => {
  const mrX = gameData.players[0];
  mrX.currentPosition = 194;

  return gameData;
};

const mrXStranded = (gameData) => {
  const positions = [21, 33, 11, 46, 47, 34];

  gameData.players.forEach((player, index) => {
    player.currentPosition = positions[index];
  });
  gameData.currentPlayerIndex = 2;

  return gameData;
};

const detectivesCanWin = (gameData) => {
  const positions = [67, 66, 65, 68, 102, 51];

  gameData.players.forEach((player, index) => {
    player.currentPosition = positions[index];
    if (player.role === mrX) {
      return;
    }
    player.tickets = { taxi: 1, bus: 1, subway: 1, twoX: 0, black: 0 }
  });
  gameData.currentPlayerIndex = 1;

  return gameData;
};

const scenarios = {
  'scenario 1': firstDetectiveStranded,
  'scenario 2': allPlayerStranded,
  'scenario 3': lastRound,
  'scenario 4': detectiveLeftWithOneTicket,
  'scenario 5': twoXRevealationRound,
  'scenario 6': mrXOnFerryStop,
  'scenario 7': mrXStranded,
  'scenario 8': detectivesCanWin,
};

module.exports = {
  scenarios, firstDetectiveStranded, allPlayerStranded, lastRound,
  detectiveLeftWithOneTicket, twoXRevealationRound,
  mrXOnFerryStop, mrXStranded, detectivesCanWin
};
