const createRoomId = (gameId) => {
  const roomId = createEl('p');
  roomId.innerText = 'Game Id : ' + gameId;

  const roomIdEle = byId('room-id');
  roomIdEle.appendChild(roomId);
};

const createRoomLink = (gameId) => {
  const roomLink = createEl('span');
  roomLink.id = 'link-text';
  roomLink.innerText = 'http://localhost:8000/join?gameId=' + gameId;

  const gameLinkEle = byId('game-link');
  gameLinkEle.prepend(roomLink);
};

const showGameId = (status, res) => {
  if (status !== 200) {
    return;
  }
  const { gameId } = JSON.parse(res);

  createRoomId(gameId);
  createRoomLink(gameId);
};

const activatePlayBtn = () => {
  const btn = byId('play');
  if (!btn) {
    return;
  }
  btn.style.visibility = 'visible';
};

const updateGameId = () => {
  const req = { method: 'GET', url: '/user-name' };
  sendRequest(req, showGameId);
};

const refreshPage = (intervalId) => {
  const req = { method: 'GET', url: '/api/lobby-stats' };
  sendRequest(req, updatePlayers(intervalId));
};

const initiateLobby = (status, res) => {
  const { isHost } = JSON.parse(res);
  if (!isHost) {
    removePlayButton();
  }
  // calling atleast once
  refreshPage();
  updateGameId();

  // starting page refresh each second
  const intervalId = setInterval(() => refreshPage(intervalId), 1000);
}
