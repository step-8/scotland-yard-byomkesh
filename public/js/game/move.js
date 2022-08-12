const addClickEvent = (eventHandler, stops) => {
  stops.forEach(stop => {
    const stopElem = byId(stop);
    if (!stopElem) {
      return;
    }
    stopElem.onclick = () => eventHandler(stop);
  });
};

const removeClickEvent = (stops) => {
  stops.forEach(stop => {
    const stopElem = byId(stop);
    if (!stopElem) {
      return;
    }
    stopElem.onclick = null;
  });
};

const movePin = (stop, res) => {
  if (!res.isMoved) {
    return;
  }
  // Add code to restart polling
  removePin(gameState.currentPlayerColor);
  putPinInMap(stop, gameState.currentPlayerColor);
  Object.values(gameState.possibleRoutes).forEach((stops) => {
    removeClickEvent(stops);
  });
};

const sendMoveRequest = (stop) => {
  const body = JSON.stringify({ destination: stop });
  const requestDetails = {
    method: 'post',
    body,
    headers: { 'Content-Type': "application/json" }
  };

  fetch('/api/move', requestDetails)
    .then((res) => res.json())
    .then((res) => movePin(stop, res));
};

const initiateMove = (res) => {
  gameState.possibleRoutes = res;

  Object.values(gameState.possibleRoutes).forEach((stops) => {
    addClickEvent(sendMoveRequest, stops);
  });
};

const getValidStops = () => {
  fetch('/api/valid-stops')
    .then((res) => res.json())
    .then(initiateMove)
};