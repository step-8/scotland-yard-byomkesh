const logout = () => {
  const logoutButton = createEl('a');
  logoutButton.href = '/logout';
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

const updateNav = (status, res) => {
  const playerName = JSON.parse(res).username;
  if (!playerName) {
    return;
  }
  const profileName = profile(playerName);
  const logoutButton = logout();
  const nav = byId('auth');
  nav.replaceChildren(profileName, logoutButton);
};
