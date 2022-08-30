const exitGame = () => {
  const exitBtn = query('.game-end');
  exitBtn.addEventListener('click', () => { });
  const form = document.querySelector('form');
  form.submit();
};

const winningMessagesLookup = (winningStatus) => {
  const lookup = [
    'Detectives blocked Mr. X',
    'Detective Red caught Mr. X',
    'Detective Green caught Mr. X',
    'Detective Purple caught Mr. X',
    'Detective Blue caught Mr. X',
    'Detective Orange caught Mr. X',
    'Mr. X left the game',
    'All Detectives are stranded',
    'All Detectives ran out of tickets',
    'Mr. X escaped',
    'All Detectives left the game'
  ];

  return lookup[winningStatus - 1];
};

const createHomeLink = () => {
  const link = new Element('div')
    .addEvent('click', exitGame)
    .addClass('game-end')
    .addClass('center-flex')
    .add('innerText', 'Home');
  return link.html;
};

const createWinningPop = (message, color, description) => {
  const winningPopupBody = new Element('div')
    .addClass('winning-popup-body')
    .addClass('center-flex');

  const winningPopup = new Element('div')
    .addClass('winning-popup')
    .addClass('vertical-flex')
    .addClass('both-middle')
    .addClass(color);

  const heading = new Element('h1')
    .addClass('heading')
    .add('innerText', message);

  const desc = new Element('p')
    .addClass('description')
    .add('innerText', description);

  const homeLink = createHomeLink();

  winningPopup.replace(heading.html, desc.html, homeLink);
  winningPopupBody.append(winningPopup.html);
  return winningPopupBody.html;
};

const endGame = poller => gameState => {
  const { winningStatus, gameOver, mrX } = gameState;

  if (!gameOver) {
    return;
  }

  removePopUp();
  poller.pause();
  let description = winningMessagesLookup(winningStatus);
  let message = 'Mr. X Won!';
  const color = 'black';

  if (winningStatus < 8) {
    message = 'Detectives Won!';
  }

  if (winningStatus < 7)
    description += ` at ${mrX.currentPosition}`;

  const popup = createWinningPop(message, color, description);
  const map = query('.map');

  map.append(popup);
  generateSparks(1);
};
