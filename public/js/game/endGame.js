
const createHomeLink = () => {
  const link = new Element('a')
    .add('href', '/end')
    .addClass('game-end')
    .addClass('center-flex')
    .add('innerText', 'Home');
  return link.html;
};

const endGame = poller => gameState => {
  const { winningStatus, gameOver } = gameState;
  if (!gameOver) {
    return;
  }
  poller.pause();

  let message = 'Detectives Won!';
  let color = 'blue';
  if (winningStatus >= 3) {
    message = 'Mr. X Won!';
    color = 'black';
  }

  const banner = createBanner(message, color);
  const homeLink = createHomeLink();
  banner.appendChild(homeLink);
  const map = query('.map');

  map.append(banner);
};
