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
  const position = createElem(`at ${currentPosition}`, 'position');

  playerCard.appendChild(position);

  const classes = color;
  playerCard.className = classes;

  playerCard.classList.add('character-card');
  playerCard.classList.add('vertical-flex');
  playerCard.classList.add('both-middle');

  if (username === user.username) {
    playerCard.classList.add('me');
  }
  return playerCard;
};

const createPlayerCard = ({ username, isHost }, user) => {
  const playerCard = createEl('div');

  if (username === user.username) {
    playerCard.classList.add('me');
  }

  const name = isHost ? username + ' (host)' : username;
  const nameEle = createElem(name, 'name inline');
  playerCard.appendChild(nameEle);

  playerCard.classList.add('player-card');
  playerCard.classList.add('center-flex');

  return playerCard;
};

const createPlaceHolder = () => {
  const placeHolder = createEl('div');
  placeHolder.className = 'place-holder';
  return placeHolder;
};

const createPlayersContainer = (players, user) => {
  const playerCards = [];

  players.forEach(player => {
    const playerInfo = createPlayerCard(player, user);
    playerCards.push(playerInfo);
  });

  for (let i = 1; i <= 6 - players.length; i += 1) {
    const placeHolder = createPlaceHolder();
    playerCards.push(placeHolder);
  }

  return playerCards;
};

const showPlayerCard = (lobbyState) => {
  const user = lobbyState.myData();
  const players = lobbyState.getPlayers();
  const isGameStarted = lobbyState.isStarted();

  const playersContainer = byId('players-container');

  if (!isGameStarted) {
    const playerCards = createPlayersContainer(players, user);
    playersContainer.replaceChildren(...playerCards);
  } else {
    //   const robberEle = new Element('div')
    //     .addClass('robber-container')
    //     .addClass('center-flex');

    //   const vsImg = '<img src="/images/versus.png" class="vs-img">';
    //   const vs = new Element('div')
    //     .addClass('vs')
    //     .add('innerHTML', vsImg);

    //   const detectivesEle = new Element('div')
    //     .addClass('detectives-container')
    //     .addClass('horizontal-flex')
    //     .addClass('vertical-middle');

    //   players.forEach(player => {
    //     const playerCard = createCharacterCard(player, user);
    //     if (player.role === 'Mr. X') {
    //       playerCard.classList.add('robber-card');
    //       robberEle.append(playerCard);
    //       return;
    //     }
    //     playerCard.classList.add('detective-card');
    //     detectivesEle.append(playerCard);
    //   });
    //   playersContainer.replaceChildren(robberEle.html, vs.html, detectivesEle.html);
  }

  return lobbyState;
};

const displayMessage = (lobbyState) => {
  const { isHost } = lobbyState.myData();
  const totalPlayer = lobbyState.totalPlayers();

  const messageContainer = byId('message-container');
  let gif = '';
  let message = 'You can start the game or wait for other players';

  if (!isHost) {
    gif = '<img src="/images/loading.gif" class="loading-gif">';
    message = 'Waiting for host to start...';
  }

  if (totalPlayer < 3) {
    const playersNeeded = 3 - totalPlayer;
    gif = '<img src="/images/loading.gif" class="loading-gif">';

    message = `Waiting for atleast ${playersNeeded} `;
    message += playersNeeded === 1 ? 'player ...' : 'players ...';
  }

  if (totalPlayer === 6 && isHost) {
    message = 'Max players joined. Please start the Game.';
  }

  const messageDiv = createElem(message, 'message');

  messageContainer.replaceChildren();

  messageContainer.innerHTML = gif;
  messageContainer.appendChild(messageDiv);

  return lobbyState;
};

const showLeftPlayer = (lobbyState) => {
  const leftPlayerContainer = byId('left-player');
  const leftPlayer = lobbyState.whoLeft();

  if (!leftPlayer || lobbyState.isStarted()) {
    return;
  }

  leftPlayerContainer.innerText = leftPlayer + ' left the lobby';
  leftPlayerContainer.classList.add('left-player-msg');

  setTimeout(() => {
    leftPlayerContainer.innerText = '';
    leftPlayerContainer.classList.remove('left-player-msg');
  }, 2000);

  if (!lobbyState.canGameStart()) {
    removePlay();
  }

  return lobbyState;
};
