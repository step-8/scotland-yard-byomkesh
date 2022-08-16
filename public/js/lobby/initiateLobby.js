const createRoomId = (gameId) => {
  const roomId = createEl('p');
  roomId.innerText = 'Game Id : ' + gameId;

  const roomIdEle = byId('room-id');
  roomIdEle.appendChild(roomId);
};

const activatePlayBtn = () => {
  const btn = byId('play');
  if (!btn) {
    return;
  }
  btn.classList.remove('hide');
};

const setGameId = () => {
  fetch('/user-name', { method: 'GET' })
    .then((res) => res.json())
    .then((res) => {
      createRoomId(res.gameId);
      byId('copy-btn').onclick = () => copyToClipboard(res.gameId);
    })
};

const refreshPage = (intervalId) => {
  const req = { method: 'GET', url: '/api/lobby-stats' };
  sendRequest(req, updatePlayers(intervalId));
};

const initiateLobby = (status, res) => {
  const { isHost } = JSON.parse(res);
  console.log(res);
  if (!isHost) {
    removePlayButton();
  }
  // calling atleast once
  refreshPage();
  setGameId();

  // starting page refresh each second
  const intervalId = setInterval(() => refreshPage(intervalId), 1000);
};
