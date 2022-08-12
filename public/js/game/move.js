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
  removePin(gameState.currentPlayer.color);
  putPinInMap(stop, gameState.currentPlayer.color);
  Object.values(gameState.possibleRoutes).forEach((stops) => {
    removeClickEvent(stops);
  });
};

const getPossibleTickets = (stop) => {
  const routes = gameState.possibleRoutes;
  // const tickets = Object.keys(routes);

  return Object.entries(routes).reduce((transports, [ticket, stations]) => {
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
  }

  return obj[pluralTicket];
};

const sendMoveRequest = (stop) => {
  removeTicketPopup();
  createTicketPopup(getPossibleTickets(stop), (pluralTicket) => {
    const ticket = ticketNameMapper(pluralTicket);
    const body = JSON.stringify({ destination: stop, ticket });
    const requestDetails = {
      method: 'post',
      body,
      headers: { 'Content-Type': "application/json" }
    };

    fetch('/api/move', requestDetails)
      .then((res) => res.json())
      .then((res) => movePin(stop, res))
      .then((res) => {
        removeAllHighlight();
        removeTicketPopup();
      });
  });

};

const initiateMove = () => {
  Object.values(gameState.possibleRoutes).forEach((stops) => {
    addClickEvent(sendMoveRequest, stops);
  });
};
