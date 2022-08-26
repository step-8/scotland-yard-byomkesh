const removeBanner = () => {
  query('.banner').remove();
};

const createBanner = (message, color) => {
  const bannerBody = new Element('div')
    .addClass('notification-banner')
    .addClass('center-flex')
    .addClass(color)
    .add('innerText', message);

  const banner = new Element('div')
    .addClass('banner')
    .append(bannerBody.html);

  return banner.html;
};

const notifier = (message, color) => {
  const banner = createBanner(message, color);
  const map = query('.map');

  map.append(banner);
  setTimeout(removeBanner, 2000);
};

const roundNotifier = (gameState) => {
  const { currentPlayer, gameOver } = gameState;
  const { role, color } = currentPlayer;
  let bannerColor = color;
  let message = `${role}'s turn`;

  if (gameState.isTwoXInAction()) {
    return;
  }

  if (gameOver) {
    return;
  }

  if (gameState.isMyTurn()) {
    message = 'Your turn';
  }

  if (gameState.isPlayerStranded(currentPlayer)) {
    message = `${role} is stranded`;
    bannerColor = 'grey';
  }
  if (!gameState.isPlayerLeft()) {
    notifier(message, bannerColor);
  }
};
