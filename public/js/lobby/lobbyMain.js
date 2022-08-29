const API = {
  getLobbyStats: () => fetch('/api/lobby-stats', { method: 'GET' }),
  postStartReq: () => fetch('/api/start', { method: 'POST' }),
  initialStatReq: () => fetch('/api/initial-stats', { method: 'GET' })
};

const createVs = () => {
  const upperLine = new Element('div')
    .addClass('line');

  const lowerLine = new Element('div')
    .addClass('line');

  const vs = new Element('div')
    .addClass('vs-text')
    .add('innerText', 'VS');

  const vsEle = new Element('div')
    .addClass('vs')
    .addClass('center-flex')
    .addClass('vertical-flex')
    .append(upperLine.html)
    .append(vs.html)
    .append(lowerLine.html);

  return vsEle;
};

const showPlayerInitialStats = ({ players, user }) => {
  const playersContainer = byId('players-container');

  const robberEle = new Element('div')
    .addClass('robber-container')
    .addClass('center-flex');

  const vsEle = createVs();

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
  playersContainer.replaceChildren(robberEle.html, vsEle.html, detectivesEle.html);
};

const updateLobbyOnStart = (poller) => (lobbyState) => {
  if (!lobbyState.isStarted()) {
    return;
  }

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

  lobbyState.addHandler(setGameId);
  lobbyState.addHandler(initiateLobby);
  lobbyState.addHandler(updateLobbyOnStart(poller));

  poller.resume();
  // setGameId();
};

window.onload = main;
