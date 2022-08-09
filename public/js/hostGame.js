const host = (playerName) => {
  const hostName = createEl('div');
  hostName.classList.add('user-name');
  hostName.innerText = playerName + ' (Host)';
  return hostName;
};

const createRoomId = (gameId) => {
  const roomId = createEl('p');
  roomId.innerText = 'Room Id : ' + gameId;
  return roomId;
};

const createRoomLink = (gameId) => {
  const roomLink = createEl('span');
  roomLink.id = 'link-text';
  roomLink.innerText = 'http://localhost:8000/join?gameId=' + gameId;
  return roomLink;
};

const showGameId = (status, res) => {
  if (status !== 200) {
    return;
  }
  const { username, gameId } = JSON.parse(res);
  const hostName = host(username);
  const roomId = createRoomId(gameId);
  const roomLink = createRoomLink(gameId);

  // const nav = byId('players-container');
  // nav.appendChild(hostName);

  const roomIdEle = byId('room-id');
  roomIdEle.appendChild(roomId);

  const gameLinkEle = byId('game-link');
  gameLinkEle.prepend(roomLink);
  return;
};

const generatePlayersHtml = players => {
  const html = [];
  players.forEach(({ username, isHost }) => {
    const div = createEl('div');
    div.innerText = isHost ? username + ' (host)' : username;
    html.push(div);
  });
  return html;
};

const showPlayers = (status, res) => {
  if (status !== 200) {
    return;
  }
  const { players } = JSON.parse(res);
  const playersEle = generatePlayersHtml(players);

  const playersContainer = byId('players-container');
  playersContainer.replaceChildren(...playersEle);
  return;
};

const updateGameId = () => {
  const req = { method: 'GET', url: '/user-name' };
  sendRequest(req, showGameId);
};

const updatePage = () => {
  const req = { method: 'GET', url: '/api/lobby-stats' };
  sendRequest(req, showPlayers);
};

const main = () => {
  updateProfile();
  updateGameId();
  updatePage();
};

window.onload = main;