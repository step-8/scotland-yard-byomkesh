const getImage = ticket => {
  const filename = {
    'taxi': 'taxies.svg',
    'bus': 'buses.svg',
    'subway': 'subways.svg',
    'black': 'ferries.jpeg',
    'twoX': 'twoX.svg'
  };
  return filename[ticket];
};

const createImage = ticket => {
  const ticketImg = getImage(ticket);
  const icon = new Element('img')
    .add('src', `/images/${ticketImg}`)
    .addClass('transport');

  return icon.html;
};

const updateRobberLog = (gameState) => {
  const robberLog = gameState.robberLog;
  const logBoard = byId('log-board');
  const logsElement = logBoard.children;

  robberLog.forEach((ticket, index) => {
    const image = createImage(ticket);

    logsElement[index].replaceWith(image);
  });
};
