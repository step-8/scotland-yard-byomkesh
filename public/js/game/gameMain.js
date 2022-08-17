const main = () => {
  const poll = new Poller('/api/game-stats', { method: 'GET' });
  poll.addObserver(updateRobberLog);
  poll.addObserver(updateDetectivesLog);
  poll.addObserver(updatePins);
  poll.addObserver(turnNotifier);
  poll.addObserver(() => {
    if (gameState.isMyTurn()) {
      reqValidStops();
    }
  });
  poll.startPolling();
};

window.onload = main;
