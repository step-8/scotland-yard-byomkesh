const leaveGame = () => {
  const form = document.querySelector('form');
  form.submit();
  removePopUp();
};

const handleLeaveGame = () => {
  const message = 'Are you sure you want to leave the Game?';
  createConfirmationPopup(message, leaveGame, removePopUp)
};

const API = {
  getGameStat: () => fetch('/api/game-stats'),
  getValidStops: () => fetch('/api/valid-stops', { method: 'GET' }),
  postMoveReq: (reqDetails) => fetch('/api/move', reqDetails),
  skipTurnReq: () => fetch('/api/skip-turn', { method: 'POST' }),
  enableTwoX: (reqDetails) => fetch('/api/enable-two-x', reqDetails),
  getMap: () => fetch('/api/game-map').then((res) => res.text())
};

const skipStuckPlayer = gameState => {
  const { currentPlayer } = gameState;
  if (!gameState.isPlayerStranded(currentPlayer)) {
    return gameState;
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      API.skipTurnReq();
      resolve(gameState);
    }, 3000);
  });
};

const main = () => {
  const gameState = new GameState();

  const initGame = (data) => gameState.initialize(data);
  const poller = new Poller(API.getGameStat, initGame);

  gameState.addHandler(updateRobberLog);
  gameState.addHandler(updatePlayersStats);
  gameState.addHandler(updatePins);
  gameState.addHandler(endGame(poller));
  gameState.addHandler(roundNotifier);
  gameState.addHandler(showTwoX);
  gameState.addHandler(handleTwoX);
  gameState.addHandler(showTwoXNotification);
  gameState.addHandler((gameState) => {
    if (!gameState.isMyTurn()) {
      return;
    }

    if (gameState.gameOver) {
      return;
    }

    reqValidStops(gameState)
      .then(skipStuckPlayer)
      .then(highlightStops)
      .then(initiateMove);
  });

  API.getMap().then((res) => {
    query('.map').innerHTML += res;
  }).then(() => {
    poller.resume();
    loadSvgEvents();
  });
};

window.onload = main;
