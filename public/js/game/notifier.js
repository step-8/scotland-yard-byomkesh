const removeBanner = () => {
  query('.banner').remove();
}

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

const roundNotifier = (gameState) => {
  const { role, color } = gameState.currentPlayer;
  let message = `${role}'s turn`;

  if (gameState.isMyTurn()) {
    message = 'Your turn';
  }

  notifier(message, color);
};