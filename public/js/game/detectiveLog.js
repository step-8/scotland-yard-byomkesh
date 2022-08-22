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

const createDetectivesLog = (gameState) => {
  const detectives = gameState.getDetectives();
  return detectives.map(detective => {
    const { role, tickets, username } = detective;
    const { taxi, bus, subway } = tickets;

    const name = getName(role, username, gameState.playerName);
    const row = createRow(name, taxi, bus, subway);

    if (gameState.isPlayerStranded(detective)) {
      row.addClass('dark-grey');
      row.addClass('white-text');
      return row.html;
    }

    if (gameState.isCurrentPlayer(username)) {
      row.addClass('dark-' + detective.color);
      row.addClass('white-text');
    }
    return row.html;
  });
};

const updateDetectivesLog = (gameState) => {
  const rows = createDetectivesLog(gameState);
  const tbody = query('.detectives-log tbody');

  tbody.replaceChildren(...rows);
};
