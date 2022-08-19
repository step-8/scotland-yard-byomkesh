
const createHomeLink = () => {
  const link = new Element('a');
  link.add('href', '/end');
  link.addClass('game-end');
  link.add('innerText', 'Home');
  return link.html;
};

const endGame = poller => gameState => {
  const { winningStatus, gameOver } = gameState;
  if (!gameOver) {
    return;
  }
  poller.pause();
  const banner = createBanner('Detectives Won!', 'blue');
  const homeLink = createHomeLink();
  banner.appendChild(homeLink);
  const map = query('.map');

  map.append(banner);
};
