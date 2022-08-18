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

const setGameId = () =>
  fetch('/api/user-name', { method: 'GET' })
    .then((res) => res.json())
    .then((res) => {
      createRoomId(res.gameId);
      byId('copy-btn').onclick =
        () => copyToClipboard(res.gameId);
    });

const initiateLobby = (lobbyState) => {
  const updateLobbyPromise = new Promise((res, rej) => {
    const { isHost } = lobbyState.myData();
    if (!isHost) {
      removePlayButton();
    }
    res(lobbyState);
  })

  updateLobbyPromise
    .then(showPlayerCard)
    .then(displayMessage)
    .then(activatePlayBtn);
};
