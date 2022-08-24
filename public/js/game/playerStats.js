const createTicketElement = (name, count) => {
  const div = new Element('div')
    .addClass('ticket');

  const ticketImg = getImage(name);
  const image = new Element('img')
    .add('src', `/images/${ticketImg}`);

  const countEle = new Element('div')
    .addClass('count')
    .add('innerText', count);

  div.append(image.html)
    .append(countEle.html);

  return div.html;
};

const createDetectivesTickets = (tickets) => {
  const ticketsArray = Object.entries(tickets);
  const detectiveTickets = ticketsArray.filter(([name]) => {
    return name !== 'black' && name !== 'twoX';
  });

  return detectiveTickets.map(([name, count]) => {
    return createTicketElement(name, count);
  });
};

const createMrXTickets = (tickets) => {
  const ticketsArray = Object.entries(tickets);
  return ticketsArray.map(([name, count]) => {
    return createTicketElement(name, count);
  });
};

const createTicketStat = ({ role, tickets }) => {
  const ticketStat = new Element('div')
    .addClass('ticket-stat')
    .addClass('horizontal-flex');

  let ticketElements = createMrXTickets(tickets);
  if (role !== 'Mr. X') {
    ticketElements = createDetectivesTickets(tickets);
  }

  ticketElements.forEach(ticketElement => {
    ticketStat.append(ticketElement);
  });
  return ticketStat.html;
};

const createHeader = ({ color, username }, isMyScreen) => {
  const displayName = isMyScreen ? username + ' (you)' : username;

  const header = new Element('header')
    .addClass('profile')
    .addClass('horizontal-flex');

  const marker = new Element('div')
    .addClass('marker')
    .addClass('fa-solid')
    .addClass('fa-location-dot')
    .addClass(color + '-text');

  const name = new Element('div')
    .addClass('name')
    .add('innerText', displayName);

  header.append(marker.html)
    .append(name.html);

  return header.html;
};

const createPlayerStat = (player, { isMyScreen, isCurrentPlayer, isStranded }) => {
  const div = new Element('div')
    .addClass('player-stat')
    .addClass('vertical-flex');

  const header = createHeader(player, isMyScreen);
  const ticketStats = createTicketStat(player);

  div.append(header)
    .append(ticketStats);

  if (isCurrentPlayer) {
    div.addClass('dark-' + player.color);
  }

  if (isStranded) {
    div.addClass('stranded')
      .addClass('linear-gradiant');
  }
  return div.html;
};

const createPlayersStats = (gameState) => {
  const { players } = gameState;
  return players.map(player => {
    const { username } = player;
    const isMyScreen = gameState.isMyScreen(username);
    const isStranded = gameState.isPlayerStranded(player);
    const isCurrentPlayer = gameState.isCurrentPlayer(username);
    return createPlayerStat(player, { isMyScreen, isCurrentPlayer, isStranded });
  });
};

const updatePlayersStats = (gameState) => {
  const playerStats = createPlayersStats(gameState);
  const playerStatsSection = byId('players-stat');
  playerStatsSection.replaceChildren(...playerStats);
};
