const logout = () => {
  const logoutButton = createEl('a');
  logoutButton.href = '#';
  const span = createEl('span');
  span.innerText = 'Logout';
  logoutButton.appendChild(span);
  return logoutButton;
};

const profile = (playerName) => {
  const profileName = createEl('div');
  profileName.classList.add('user-name');
  profileName.innerText = 'Hi ' + playerName;
  return profileName;
};

const updateName = (status, res) => {
  if (status !== 200) {
    return;
  }
  const playerName = JSON.parse(res).username;
  const profileName = profile(playerName);
  const logoutButton = logout();
  const nav = byId('auth');
  nav.replaceChildren(profileName, logoutButton);
  return;
};

const main = () => {
  const req = { method: 'GET', url: '/user-name' };
  sendRequest(req, updateName);
};

window.onload = main;
