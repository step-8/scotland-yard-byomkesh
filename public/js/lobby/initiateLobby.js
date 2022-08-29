const leaveLobby = () => {
  const form = document.querySelector('form');
  form.submit();
};

const createRoomId = (gameId) => {
  const roomIdDes = createEl('span');
  roomIdDes.innerText = 'Game ID : ';

  const roomId = createEl('span');
  roomId.id = 'game-id';
  roomId.innerText = gameId;

  const roomIdEle = byId('room-id');
  roomIdEle.appendChild(roomIdDes);
  roomIdEle.appendChild(roomId);
};

const setGameId = () =>
  fetch('/api/user-name', { method: 'GET' })
    .then((res) => res.json())
    .then((res) => {
      createRoomId(res.lobbyId);
      byId('copy-btn').onclick =
        () => copyToClipboard(res.lobbyId);
    });

const initiateLobby = (lobbyState) => {
  const updateLobbyPromise = new Promise((res, rej) => {
    res(lobbyState);
  });

  updateLobbyPromise
    .then(showPlayerCard)
    .then(displayMessage)
    .then(activatePlayBtn)
    .then(showLeftPlayer);
};
