const showTwoX = (gameState) => {
  if (!gameState.amIMrX()) {
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
  if (!gameState.isMrXTurn()) {
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
  if (gameState.hasTaken2XInThisRound()) {
    notifier('Mr X is using 2x', 'black');
  }
};
