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

const showPopup = () => {
  query('body').prepend(createPopup());
};

const displayJoinError = () => {
  const rawCookie = document.cookie;
  const cookie = new URLSearchParams(rawCookie);

  if (cookie.get('joinError')) {
    showPopup();
    query('.popup-error').innerText = cookie.get('joinError');
    document.cookie = 'joinError=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
};

const main = () => {
  const req = { method: 'GET', url: '/user-name' };
  sendRequest(req, updateName);

  const joinButton = byId('join-game');
  joinButton.addEventListener('click', showPopup);

  displayJoinError();
};

window.onload = main;
