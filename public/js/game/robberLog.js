const getImage = ticket => {
  const filename = {
    'taxi': 'taxies.svg',
    'bus': 'buses.svg',
    'subway': 'subways.svg',
    'black': 'ferries.svg',
    'twoX': 'twoX.svg'
  };
  return filename[ticket];
};

const createImage = ticket => {
  const ticketImg = getImage(ticket);
  const icon = new Element('img')
    .add('src', `/images/${ticketImg}`);

  return icon.html;
};

const updateRobberLog = (gameState) => {
  const robberLog = gameState.robberLog;
  const logBoard = byId('log-board');
  const logsElement = logBoard.children;

  robberLog.forEach((ticket, index) => {
    const image = createImage(ticket);

    const div = new Element('div')
      .addClass('transport')
      .addClass('center-flex')
      .append(image);

    logsElement[index].replaceWith(div.html);
  });
};
