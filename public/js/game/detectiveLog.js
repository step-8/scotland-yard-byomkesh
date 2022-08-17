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

const createDetectivesLog = (detectives, user, currentPlayer) => {
  return detectives.map(detective => {
    const { role, tickets, username } = detective;
    const { taxi, bus, subway } = tickets;
    const name = getName(role, username, user);
    const row = createRow(name, taxi, bus, subway);

    if (currentPlayer === username) {
      row.addClass(detective.color);
    }

    return row.html;
  });
};

const updateDetectivesLog = () => {
  const { players, playerName, currentPlayer } = gameState;
  const currentPlayerName = currentPlayer.username;

  const detectives = getDetectives(players);
  const rows = createDetectivesLog(detectives, playerName, currentPlayerName);
  const tbody = query('.detectives-log tbody');

  tbody.replaceChildren(...rows);
};
