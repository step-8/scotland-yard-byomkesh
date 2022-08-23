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
    .addClass('ticket-stat');

  let ticketElements = createMrXTickets(tickets);
  if (role !== 'Mr. X') {
    ticketElements = createDetectivesTickets(tickets);
  }

  ticketElements.forEach(ticketElement => {
    ticketStat.append(ticketElement);
  });
  return ticketStat.html;
};

const createHeader = ({ color, username }) => {
  const header = new Element('header')
    .addClass('profile');

  const marker = new Element('div')
    .addClass('marker')
    .addClass('fa-solid')
    .addClass('fa-location-dot')
    .addClass(color + '-text');

  const name = new Element('div')
    .addClass('name')
    .add('innerText', username);

  header.append(marker.html)
    .append(name.html);

  return header.html;
};

const createPlayerStat = (player) => {
  const div = new Element('div')
    .addClass('player-stat');
  const header = createHeader(player);
  const ticketStats = createTicketStat(player);

  div.append(header)
    .append(ticketStats);
  return div.html;
};

const createPlayersStats = (gameState) => {
  const { players } = gameState;
  return players.map(player => {
    return createPlayerStat(player);
  });
};

const updatePlayersStats = (gameState) => {
  const playerStats = createPlayersStats(gameState);
  const playerStatsSection = byId('players-stat');
  playerStatsSection.replaceChildren(...playerStats);
};
