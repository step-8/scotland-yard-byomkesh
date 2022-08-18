const createRoomId = (gameId) => {
  const roomIdDes = createEl('span');
  roomIdDes.innerText = 'Game Id : ';

  const roomId = createEl('span');
  roomId.id = 'game-id';
  roomId.innerText = gameId;

  const roomIdEle = byId('room-id');
  roomIdEle.appendChild(roomIdDes);
  roomIdEle.appendChild(roomId);
};

const activatePlayBtn = () => {
  const btn = byId('play');
  if (!btn) {
    return;
  }
  btn.classList.remove('hide');
};

const setGameId = () =>
  fetch('/api/user-name', { method: 'GET' })
    .then((res) => res.json())
    .then((res) => {
      createRoomId(res.gameId);
      byId('copy-btn').onclick = () => copyToClipboard(res.gameId);
    });

const updateGameId = () => {
  const req = { method: 'GET', url: '/api/user-name' };
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
  setGameId();

  // starting page refresh each second
  const intervalId = setInterval(() => refreshPage(intervalId), 1000);
};
