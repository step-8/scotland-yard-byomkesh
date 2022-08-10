const main = () => {
  updateProfile();

  const req = { method: 'GET', url: '/api/lobby-stats' };
  sendRequest(req, initiateLobby);
};

window.onload = main;