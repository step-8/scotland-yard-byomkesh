const startCountDown = () => {
  let timeLeft = 10;
  const countDown = byId('message-container');
  countDown.innerText = `Game starts in ${timeLeft} seconds`;
  const intervalId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(intervalId);
      window.location.href = '/game';
    }
    countDown.innerText = `Game starts in ${timeLeft} seconds`;
  }, 1000);
};

const removeGameLink = () => {
  const link = byId('game-link');
  if (!link) {
    return;
  }
  link.classList.add('hide');
};

const removePlayButton = () => {
  const play = byId('play-button');
  if (!play) {
    return;
  }
  play.classList.add('hide');
};

const removeLeaveButton = () => {
  const leaveButton = byId('leave-lobby');
  console.log(leaveButton);
  leaveButton.replaceChildren('');
};

const updateLobbyOnStart = (poller) => (lobbyState) => {
  if (!lobbyState.isStarted()) {
    return;
  }

  removePlayButton();
  removeGameLink();
  startCountDown();
  removeLeaveButton();

  poller.pause();
};

const activatePlayBtn = (lobbyState) => {
  const btn = byId('play');
  if (!btn) {
    return;
  }

  if (lobbyState.canGameStart()) {
    markVisible(btn);
  }

  return lobbyState;
};

const markVisible = (button) =>
  button.classList.remove('hide');

const sendStartRequest = () => API.postStartReq();