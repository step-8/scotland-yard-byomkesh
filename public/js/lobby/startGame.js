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

const startGame = (status, rawResponse) => {
};

const sendStartRequest = () => {
  const request = {
    method: 'POST',
    url: '/api/start',
  };
  sendRequest(request, startGame);
};
