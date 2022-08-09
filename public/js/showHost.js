const host = (playerName) => {
  const hostName = createEl('div');
  hostName.classList.add('user-name');
  hostName.innerText = playerName + ' (Host)';
  return hostName;
};

const showHost = (status, res) => {
  if (status !== 200) {
    return;
  }
  const playerName = JSON.parse(res).username;
  const hostName = host(playerName);
  const nav = byId('players-container');
  nav.appendChild(hostName);
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