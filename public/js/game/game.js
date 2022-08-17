class GameState {
  #players;
  #currentPlayer;
  #playerName;
  #possibleRoutes;
  #robberLog;

  constructor() {
    this.#players = null;
    this.#currentPlayer = null;
    this.#playerName = null;
    this.#robberLog = [];
  }

  initialize({ players, currentPlayer, playerName, robberLog }) {
    this.#players = players;
    this.#currentPlayer = currentPlayer;
    this.#playerName = playerName;
    this.#robberLog = robberLog;
  }

  getLocations() {
    return this.#players.map(({ color, currentPosition }) => ({ color, currentPosition }));
  }

  isMyTurn() {
    return this.#playerName === this.#currentPlayer.username;
  }

  set possibleRoutes(stops) {
    this.#possibleRoutes = stops;
  }

  get possibleRoutes() {
    return this.#possibleRoutes;
  }

  get currentPlayer() {
    return this.#currentPlayer;
  }

  get players() {
    return this.#players;
  }

  get playerName() {
    return this.#playerName;
  }

  get robberLog() {
    return this.#robberLog;
  }
}

const gameState = new GameState();

const removePin = (color) => {
  const pin = byId(color);
  pin && pin.remove();
};

const putPinInMap = (currentPosition, color) => {
  const newPin = createPin(color);
  placePin(currentPosition, newPin);
  byId('map').appendChild(newPin);
};

const updatePins = () => {
  const locations = gameState.getLocations();
  locations.forEach(({ currentPosition, color }) => {
    if (currentPosition === null) {
      return;
    }
    removePin(color);
    putPinInMap(currentPosition, color);
  });
};

const highlightStops = () => {
  const validRoutes = gameState.possibleRoutes;
  const validStops = Object.values(validRoutes).flat();
  validStops.forEach(stopNo => {
    if (byId(stopNo)) {
      highlightPoint(stopNo);
    }
  });
};

const reqValidStops = () => {
  fetch('/api/valid-stops', { method: 'GET' })
    .then(res => res.json())
    .then(validRoutes => {
      gameState.possibleRoutes = validRoutes;

      highlightStops();
      initiateMove();
    });
};

