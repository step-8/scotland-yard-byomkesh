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
  roomIdEle.replaceChildren(roomIdDes, roomId);
};

const setGameId = (lobbyState) => {
  const { lobbyId } = lobbyState;
  createRoomId(lobbyId);
  byId('copy-btn').onclick = () => copyToClipboard(lobbyId);
};

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
