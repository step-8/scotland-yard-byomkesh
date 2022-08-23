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
  const playButton = byId('play-button');
  if (!playButton) {
    return;
  }
  playButton.classList.add('hide');
};

const removePlay = () => {
  const playButton = byId('play-button');
  if (!playButton) {
    return;
  }

  playButton.style.display = 'none';
}

const removeLeaveButton = () => {
  const leaveButton = byId('leave-lobby');
  leaveButton.replaceChildren('');
};

const updateLobbyOnStart = (poller) => (lobbyState) => {
  if (!lobbyState.isStarted()) {
    return;
  }

  removePlay();
  removeGameLink();
  startCountDown();
  removeLeaveButton();

  poller.pause();
};

const activatePlayBtn = (lobbyState) => {
  const btn = byId('play');
  const playBtn = byId('play-button');
  const { isHost } = lobbyState.myData();

  if (lobbyState.canGameStart() && isHost) {
    markVisible(btn);
    markVisible(playBtn);
  }

  return lobbyState;
};

const markVisible = (button) =>
  button.classList.remove('hide');

const sendStartRequest = () => API.postStartReq();
