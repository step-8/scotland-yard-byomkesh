const getDetectives = players => players.filter(
  player => player.role.includes('Detective')
);

const getName = (role, detectiveName, playerName) => {
  const [, name] = role.split(' ');
  return detectiveName === playerName ? name + ' **' : name;
};

const createTd = (text) => {
  const td = new Element('td');
  td.add('innerText', text);
  return td.html;
};

const createRow = (...columns) => {
  const row = new Element('tr');
  const entries = columns.map(createTd);
  row.replace(...entries);
  return row;
};

const createDetectivesLog = (detectives, user, currentPlayer, strandedPlayers) => {
  return detectives.map(detective => {
    const { role, tickets, username } = detective;
    const { taxi, bus, subway } = tickets;
    const name = getName(role, username, user);
    const row = createRow(name, taxi, bus, subway);

    if (isPlayerStranded(strandedPlayers, detective)) {
      row.addClass('dark-grey');
      row.addClass('white-text');
      return row.html;
    }

    if (currentPlayer === username) {
      row.addClass('dark-' + detective.color);
      row.addClass('white-text');
    }
    return row.html;
  });
};

const updateDetectivesLog = (gameState) => {
  const { players, playerName, currentPlayer, strandedPlayers } = gameState;
  const currentPlayerName = currentPlayer.username;

  const detectives = getDetectives(players);
  const rows = createDetectivesLog(detectives, playerName, currentPlayerName, strandedPlayers);
  const tbody = query('.detectives-log tbody');

  tbody.replaceChildren(...rows);
};
