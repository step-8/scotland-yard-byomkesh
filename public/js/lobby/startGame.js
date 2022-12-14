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

const removePlay = () => {
  const playButton = byId('play');

  if (!playButton) {
    return;
  }
  playButton.classList.add('hide');
};

const removeLeaveButton = () => {
  const leaveButton = byId('leave-lobby');
  leaveButton.replaceChildren('');
};

const activatePlayBtn = (lobbyState) => {
  const playButton = byId('play');
  const { isHost } = lobbyState.myData();

  if (isHost && lobbyState.canGameStart() && !lobbyState.isStarted()) {
    playButton.classList.remove('hide');
  } else {
    playButton.classList.add('hide');
  }

  return lobbyState;
};

const markVisible = (button) =>
  button.classList.remove('hide');

const markInVisible = (button) =>
  button.classList.add('hide');

const sendStartRequest = () => API.postStartReq();
