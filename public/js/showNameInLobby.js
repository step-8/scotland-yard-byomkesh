const profile = (playerName) => {
  const profileName = createEl('div');
  profileName.classList.add('user-name');
  profileName.innerText = 'Hi ' + playerName;
  return profileName;
};

const showProfile = (status, res) => {
  if (status !== 200) {
    return;
  }
  const playerName = JSON.parse(res).username;
  const profileName = profile(playerName);
  const nav = byId('greet');
  nav.replaceChildren(profileName);
  return;
};

const updateProfile = () => {
  const req = { method: 'GET', url: '/user-name' };
  sendRequest(req, showProfile);
};
