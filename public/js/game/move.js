const addClickEvent = (stop, gameState) => {
  const stopElem = byId(stop);
  if (stopElem) {
    stopElem.onclick = showTickets(stop, gameState);
  }
};

const removeClickEvent = (stops) => {
  stops.forEach(stop => {
    const stopElem = byId(stop);
    if (stopElem) {
      stopElem.onclick = null;
    }
  });
};

const movePin = (stop) => (gameState) => {
  const activePlayerColor = gameState.currentPlayer.color
  removePin(activePlayerColor);
  putPinInMap(stop, activePlayerColor);

  const possibleRoutes = gameState.possibleRoutes;
  const allStops = Object.values(possibleRoutes).flat();
  const stops = unique(allStops);

  removeClickEvent(stops);

  return gameState;
};

const getPossibleTickets = (stop, gameState) => {
  const routes = gameState.possibleRoutes;
  const routeEntries = Object.entries(routes);

  return routeEntries.reduce((transports, [ticket, stations]) => {
    if (stations.includes(stop)) {
      transports.push(ticket);
    }
    return transports;
  }, []);
};

const ticketNameMapper = (pluralTicket) => {
  const obj = {
    'buses': 'bus',
    'subways': 'subway',
    'taxies': 'taxi'
  };

  return obj[pluralTicket];
};

const validateMove = (isMoved) => {
  if (!isMoved) {
    throw new Error('Failed to move.')
  }
};

const sendMoveReq = (stop, gameState) => (pluralTicket) => {
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
    .then(movePin(stop))
    .then(removeAllHighlight)
    .then(removeTicketPopup)
    .then(removeEvent)
    .catch((err) => alert(err.message));
};

const showTickets = (stop, gameState) => () => {
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
