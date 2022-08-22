const removeBanner = () => {
  query('.banner').remove();
};

const createBanner = (message, color) => {
  const bannerBody = new Element('div')
    .addClass('notification-banner')
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

const isPlayerStranded = (strandedPlayers, currentPlayer) => {
  return strandedPlayers.some(player => player.role === currentPlayer.role);
};

const roundNotifier = (gameState) => {
  const { strandedPlayers, currentPlayer, gameOver } = gameState;
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

  if (isPlayerStranded(strandedPlayers, currentPlayer)) {
    message = `${role} is stranded`;
    bannerColor = 'grey';
  }

  notifier(message, bannerColor);
};
