const API = {
  getLobbyStats: () => fetch('/api/lobby-stats', { method: 'GET' }),
  postStartReq: () => fetch('/api/start', { method: 'POST' }),
  enterGameReq: () => fetch('/api/enter-game', { method: 'PUT' }),
  initialStatReq: () => fetch('/api/initial-stats', { method: 'GET' })
};

const showPlayerInitialStats = ({ players, user }) => {
  const playersContainer = byId('players-container');

  const robberEle = new Element('div')
    .addClass('robber-container')
    .addClass('center-flex');

  const vsImg = '<img src="/images/versus.png" class="vs-img">';
  const vs = new Element('div')
    .addClass('vs')
    .add('innerHTML', vsImg);

  const detectivesEle = new Element('div')
    .addClass('detectives-container')
    .addClass('horizontal-flex')
    .addClass('vertical-middle');

  players.forEach(player => {
    const playerCard = createCharacterCard(player, user);
    if (player.role === 'Mr. X') {
      playerCard.classList.add('robber-card');
      robberEle.append(playerCard);
      return;
    }
    playerCard.classList.add('detective-card');
    detectivesEle.append(playerCard);
  });
  playersContainer.replaceChildren(robberEle.html, vs.html, detectivesEle.html);
};

const updateLobbyOnStart = (poller) => (lobbyState) => {
  if (!lobbyState.isStarted()) {
    return;
  }

  // API.enterGameReq()
  // .then(() => API.initialStatReq())
  API.initialStatReq()
    .then((res) => res.json())
    .then((res) => {
      showPlayerInitialStats(res);
    });
  removeGameLink();
  startCountDown();
  removeLeaveButton();

  poller.pause();
};

const main = () => {
  const lobbyState = new LobbyState();
  const poller = new Poller(API.getLobbyStats,
    (data) => lobbyState.initialize(data));

  lobbyState.addHandler(initiateLobby);
  lobbyState.addHandler(updateLobbyOnStart(poller));

  poller.resume();
  setGameId();
};

window.onload = main;
