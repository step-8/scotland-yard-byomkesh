const createElem = (value, className) => {
  const playerNameTag = createEl('div');
  playerNameTag.className = className;
  playerNameTag.innerText = value;

  return playerNameTag;
};

const createPlayerCard = ({ username, role, currentPosition, isHost }) => {
  const playerCard = createEl('div');

  if (!role) {
    username += isHost ? ' (host)' : '';
  }
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

const displayMessage = (totalPlayer, isHost) => {
  let message = 'Waiting for host to start...';
  if (isHost) {
    message = 'You can start the game or wait for other players';
  }
  if (totalPlayer < 3) {
    const playersNeeded = 3 - totalPlayer;
    message = `Waiting for atleast ${playersNeeded} `;
    message += playersNeeded === 1 ? 'player ...' : 'players ...';
  }
  if (totalPlayer === 6 && isHost) {
    message = `Max players joined. Please start the Game.`;
  }

  const messageDiv = byId('message');
  messageDiv.innerText = message;
};

const updatePlayers = intervalId => (status, res) => {
  if (status !== 200) {
    return;
  }
  const { players, isGameStarted, isHost } = JSON.parse(res);
  showPlayerCard(players);
  displayMessage(players.length, isHost);

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