const showPopup = () => {
  query('body').prepend(createPopup());
  query('.popup>input[type=text]').focus();
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
  const req = { method: 'GET', url: '/api/user-name' };
  sendRequest(req, updateNav);

  const joinButton = byId('join-game');
  joinButton.addEventListener('click', showPopup);

  serveConnectionError();
  displayJoinError();
};

window.onload = main;
