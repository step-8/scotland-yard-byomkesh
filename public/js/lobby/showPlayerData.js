const createElem = (value, className) => {
  const playerNameTag = createEl('div');
  playerNameTag.className = className;
  playerNameTag.innerText = value;

  return playerNameTag;
};

const createPlayerCard = ({ username, role, currentPosition, isHost }) => {
  const playerCard = createEl('div');

  username += isHost ? ' (host)' : '';
  const name = createElem(username, 'name inline');
  playerCard.appendChild(name);

  if (role && currentPosition) {
    const is = createElem('is', 'is small inline');
    const character = createElem(role, 'role inline');
    const at = createElem('at position', 'at small inline');
    const position = createElem(currentPosition, 'position inline');

    playerCard.appendChild(is);
    playerCard.appendChild(character);
    playerCard.appendChild(at);
    playerCard.appendChild(position);

    const classes = role === 'Mr. X' ? 'black' : '';
    playerCard.className = classes;
  }

  playerCard.classList.add('player-card');
  return playerCard;
};


const showPlayerCard = (players) => {
  const playersContainer = byId('players-container');
  playersContainer.innerHTML = '';

  players.forEach(player => {
    const playerInfo = createPlayerCard(player);
    playersContainer.appendChild(playerInfo);
  });
};

const updatePlayers = intervalId => (status, res) => {
  if (status !== 200) {
    return;
  }
  const { players, isGameStarted } = JSON.parse(res);
  showPlayerCard(players);

  if (players.length > 2) {
    activatePlayBtn();
  }

  if (isGameStarted) {
    removePlayButton();
    removeGameLink();
    startCountDown();
    clearInterval(intervalId);
    return;
  }
}