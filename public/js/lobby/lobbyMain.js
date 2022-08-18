const API = {
  getLobbyStats: () => fetch('/api/lobby-stats', { method: 'GET' }),
  postStartReq: () => fetch('/api/start', { method: 'POST' })
};

const main = () => {
  const lobbyState = new LobbyState();
  const poller = new Poller(API.getLobbyStats,
    (data) => lobbyState.initialize(data));

  lobbyState.addHandler(initiateLobby);
  lobbyState.addHandler(updateLobbyOnStart(poller));

  poller.resume();
  setGameId();
};

window.onload = main;