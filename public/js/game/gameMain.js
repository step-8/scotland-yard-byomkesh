const API = {
  getGameStat: () => fetch('/api/game-stats'),
  getValidStops: () => fetch('/api/valid-stops', { method: 'GET' }),
  postMoveReq: (reqDetails) => fetch('/api/move', reqDetails),
  skipTurnReq: () => fetch('/api/skip-turn', { method: 'POST' }),
  enableTwoX: (reqDetails) => fetch('/api/enable-two-x', reqDetails)
};

const isUserMrX = (currentPlayer, playerName) => {
  if (currentPlayer.role !== 'Mr. X') {
    return false;
  }

  if (currentPlayer.username !== playerName) {
    return false;
  }

  return true;
};

const showTwoX = (gameState) => {
  const { currentPlayer, playerName } = gameState;
  if (!isUserMrX(currentPlayer, playerName)) {
    return;
  }

  const twoX = byId('two-x-btn');
  if (gameState.isTwoXAvailable()) {
    twoX.style.visibility = 'visible';
  }
};

const confirmTwoX = (event, gameState) => {
  event.target.style.visibility = 'hidden';
  const body = JSON.stringify({ round: gameState.round });
  const request = {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' }
  };
  API.enableTwoX(request);
  removePopUp();
};

const handleTwoXClick = gameState => (event) => {
  if (gameState.currentPlayer.role !== 'Mr. X') {
    return;
  }

  const message = 'Are you sure you want to use 2x?';
  createConfirmationPopup(message, () => confirmTwoX(event, gameState), removePopUp);
};

const handleTwoX = (gameState) => {
  const twoX = byId('two-x-btn');
  const eventHandler = handleTwoXClick(gameState);
  twoX.onclick = eventHandler;
};

const showTwoXNotification = gameState => {
  if (gameState.round === gameState.twoXTakenAt) {
    notifier('Mr X is using 2x', 'black');
  }
};

const skipStuckPlayer = gameState => {
  const { currentPlayer, strandedPlayers } = gameState;
  if (!isPlayerStranded(strandedPlayers, currentPlayer)) {
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
  gameState.addHandler(updateSpecialTickets);
  gameState.addHandler(updateDetectivesLog);
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

  poller.resume();
};

window.onload = main;
