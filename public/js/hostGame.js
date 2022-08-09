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
  roomLink.innerText = 'http://localhost:8000/join/' + gameId;
  return roomLink;
};

const showHost = (status, res) => {
  if (status !== 200) {
    return;
  }
  const { username, gameId } = JSON.parse(res);
  const hostName = host(username);
  const roomId = createRoomId(gameId);
  const roomLink = createRoomLink(gameId);

  const nav = byId('players-container');
  nav.appendChild(hostName);

  const roomIdEle = byId('room-id');
  roomIdEle.appendChild(roomId);

  const gameLinkEle = byId('game-link');
  gameLinkEle.prepend(roomLink);
  return;
};

const updateHost = () => {
  const req = { method: 'GET', url: '/user-name' };
  sendRequest(req, showHost);
};

const main = () => {
  updateProfile();
  updateHost();
};

window.onload = main;