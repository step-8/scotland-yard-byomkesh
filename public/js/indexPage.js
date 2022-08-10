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
  sendRequest(req, updateNav);

  const joinButton = byId('join-game');
  joinButton.addEventListener('click', showPopup);

  displayJoinError();
};

window.onload = main;
