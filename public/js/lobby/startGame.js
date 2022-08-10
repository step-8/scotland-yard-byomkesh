const startCountDown = () => {
  let timeLeft = 15;
  const countDown = byId('count-down');
  const intervalId = setInterval(() => {
    countDown.innerText = `Game starts in ${timeLeft} seconds`;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(intervalId);
      window.location.href = '/game';
    }
  }, 1000);
};

const removeGameLink = () => {
  const link = byId('game-link');
  link.remove();
};

const removePlayButton = () => {
  const play = byId('play-button');
  if (!play) {
    return;
  }
  play.remove();
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
