const createElem = (value, className) => {
  const playerNameTag = createEl('div');
  playerNameTag.className = className;
  playerNameTag.innerText = value;

  return playerNameTag;
};

const createCharacterCard = ({ username, currentPosition, color }, user) => {
  const playerCard = createEl('div');
  const name = createElem(username, 'name');
  playerCard.appendChild(name);
  const at = createElem('at', 'at small');
  const position = createElem(currentPosition, 'position');

  playerCard.appendChild(at);
  playerCard.appendChild(position);

  const classes = color;
  playerCard.className = classes;

  playerCard.classList.add('character-card');
  if (username === user) {
    playerCard.classList.add('me');
  }
  return playerCard;
};

const createPlayerCard = ({ username, isHost }, user) => {
  const playerCard = createEl('div');

  if (username === user) {
    playerCard.classList.add('me');
  }

  username += isHost ? ' (host)' : '';
  const name = createElem(username, 'name inline');
  playerCard.appendChild(name);

  playerCard.classList.add('player-card');

  return playerCard;
};

const createPlaceHolder = () => {
  const placeHolder = createEl('div');
  placeHolder.className = 'place-holder';
  return placeHolder;
};

const showPlayerCard = (players, isGameStarted, user) => {
  const playersContainer = byId('players-container');
  playersContainer.innerHTML = '';

  if (!isGameStarted) {
    players.forEach(player => {
      const playerInfo = createPlayerCard(player, user);
      playersContainer.appendChild(playerInfo);
    });

    for (let i = 1; i <= 6 - players.length; i += 1) {
      const placeHolder = createPlaceHolder();
      playersContainer.appendChild(placeHolder);
    };
  } else {
    const robberEle = createEl('div');
    robberEle.className = 'robber-container';

    const vs = createEl('div');
    vs.className = 'vs';
    vs.innerText = 'vs';

    const detectivesEle = createEl('div');
    detectivesEle.className = 'detectives-container';

    players.forEach(player => {
      if (player.role === 'Mr. X') {
        const robberCard = createCharacterCard(player, user);
        robberCard.classList.add('robber-card');
        robberEle.appendChild(robberCard);
      } else {
        const playerCard = createCharacterCard(player, user);
        playerCard.classList.add('detective-card');
        detectivesEle.appendChild(playerCard);
      }
    });
    playersContainer.appendChild(robberEle);
    playersContainer.appendChild(vs);
    playersContainer.appendChild(detectivesEle);
  }
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
  const { players, isGameStarted, isHost, username } = JSON.parse(res);
  showPlayerCard(players, isGameStarted, username);
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