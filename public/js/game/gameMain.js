const main = () => {
  reqGameStats();

  const poll = new Poller('/api/game-stats', { method: 'GET' });
  poll.addObserver(turnNotifier);
  poll.startPolling();
};

window.onload = main;
