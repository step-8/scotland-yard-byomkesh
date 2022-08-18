const API = {
  getGameStat: () => fetch('/api/game-stats'),
  getValidStops: () => fetch('/api/valid-stops', { method: 'GET' }),
  postMoveReq: (reqDetails) => fetch('/api/move', reqDetails)
};

const main = () => {
  const gameState = new GameState();

  const initGame = (data) => gameState.initialize(data);
  const poller = new Poller(API.getGameStat, initGame);

  gameState.addHandler(updateRobberLog);
  gameState.addHandler(updateSpecialTickets);
  gameState.addHandler(updateDetectivesLog);
  gameState.addHandler(updatePins);
  gameState.addHandler(roundNotifier);
  gameState.addHandler((gameState) => {
    if (!gameState.isMyTurn()) {
      return;
    }

    reqValidStops(gameState)
      .then(highlightStops)
      .then(initiateMove);
  });

  poller.resume();
};

window.onload = main;
