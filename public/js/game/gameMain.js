const main = () => {
  const poll = new Poller('/api/game-stats', { method: 'GET' });
  poll.addObserver(turnNotifier);
  poll.addObserver(updatePins);
  poll.addObserver(updateDetectivesLog);
  poll.addObserver(() => {
    if (gameState.isMyTurn()) {
      reqValidStops();
    }
  });
  poll.startPolling();
};

window.onload = main;
