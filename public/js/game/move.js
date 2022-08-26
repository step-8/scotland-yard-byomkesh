const removeClickEvent = (stops) => {
  stops.forEach(stop => {
    const stopElem = byId(stop);
    if (stopElem) {
      stopElem.onclick = null;
    }
  });
};

const movePin = (stop, activePlayerColor) => (gameState) => {
  removePin(activePlayerColor);
  putPinInMap(stop, activePlayerColor);

  const possibleRoutes = gameState.possibleRoutes;
  const allStops = Object.values(possibleRoutes).flat();
  const stops = unique(allStops);

  removeClickEvent(stops);

  return gameState;
};

const isHidePossible = robberLog => {
  return robberLog[robberLog.length - 1] !== 'black';
};

const alreadyIncludesFerry = transports => {
  return transports.includes('ferries');
};

const canAddBlack = (role, tickets, robberLog, transports) => {
  if (role !== 'Mr. X') {
    return false;
  }
  if (tickets.black <= 0) {
    return false;
  }
  if (!isHidePossible(robberLog)) {
    return false;
  }
  if (alreadyIncludesFerry(transports)) {
    return false;
  }
  return true;
};

const getPossibleTickets = (stop, gameState) => {
  const routes = gameState.possibleRoutes;
  const robberLog = gameState.robberLog;
  const { role, tickets } = gameState.currentPlayer;
  const routeEntries = Object.entries(routes);

  const transports = routeEntries.reduce((transports, [ticket, stations]) => {
    if (stations.includes(stop)) {
      transports.push(ticket);
    }
    return transports;
  }, []);

  if (canAddBlack(role, tickets, robberLog, transports)) {
    transports.push('ferries');
  }
  return transports;
};

const ticketNameMapper = (pluralTicket) => {
  const obj = {
    'buses': 'bus',
    'subways': 'subway',
    'taxies': 'taxi',
    'ferries': 'black'
  };

  return obj[pluralTicket];
};

const validateMove = (isMoved) => {
  if (!isMoved) {
    throw new Error('Failed to move.');
  }
};

const sendMoveReq = (stop, gameState) => (pluralTicket) => {
  const activePlayerColor = gameState.currentPlayer.color;
  const ticket = ticketNameMapper(pluralTicket);
  const body = JSON.stringify({ destination: stop, ticket });
  const reqDetails = {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' }
  };

  API.postMoveReq(reqDetails)
    .then((res) => res.json())
    .then(({ isMoved }) => {
      validateMove(isMoved);
      return gameState;
    })
    .then(movePin(stop, activePlayerColor))
    .then(removeAllHighlight)
    .then(removeAllPointer)
    .then(removeTicketPopup)
    .then(removeEvent)
    .catch((err) => alert(err.message));
};

const addClickEvent = (stop, gameState) => {
  const stopElem = byId(stop);
  if (stopElem) {
    stopElem.onclick = selectStop(stop, gameState);
  }
};

const removeTwoX = () => {
  const twoX = byId('two-x-btn');
  if (twoX) {
    twoX.style.visibility = 'hidden';
  }
};

const selectStop = (stop, gameState) => () => {
  if (gameState.isMrXTurn()) {
    removeTwoX();
  }
  showTickets(stop, gameState);
};

const showTickets = (stop, gameState) => {
  const validRoutes = gameState.possibleRoutes;
  const validStops = Object.values(validRoutes).flat();

  highlightSelectedPoint(stop, validStops);
  removeTicketPopup();

  const moveReq = sendMoveReq(stop, gameState);
  const possibleTickets = getPossibleTickets(stop, gameState);

  createTicketPopup(possibleTickets, moveReq);
};

const unique = (numbers) => {
  return numbers.filter((num, i) => !numbers.includes(num, i + 1));
};

const initiateMove = (gameState) => {
  const possibleRoutes = gameState.possibleRoutes;
  const allStops = Object.values(possibleRoutes).flat();
  const stops = unique(allStops);

  stops.forEach(stop => addClickEvent(stop, gameState));
};

const reqValidStops = (gameState) => {
  return API.getValidStops()
    .then(res => res.json())
    .then(validRoutes => {
      gameState.possibleRoutes = validRoutes;

      return gameState;
    });
};
