class GameState {
  #players;
  #currentPlayer;
  #playerName;
  #possibleRoutes;

  constructor() {
    this.#players = null;
    this.#currentPlayer = null;
    this.#playerName = null;
  }

  initialize({ players, currentPlayer, playerName }) {
    this.#players = players;
    this.#currentPlayer = currentPlayer;
    this.#playerName = playerName;
  }

  getLocations() {
    return this.#players.map(({ color, currentPosition }) => ({ color, currentPosition }));
  }

  isMyTurn() {
    return this.#playerName === this.#currentPlayer.username;
  }

  get possibleRoutes() {
    return this.#possibleRoutes;
  }

  get currentPlayerColor() {
    return this.#currentPlayer.color;
  }

  set possibleRoutes(stops) {
    this.#possibleRoutes = stops;
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
    // const stop = byId(stopNo);
    // stop.addEventListener('click', highlightSelectedPoint(stopNo, validStops));
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

const reqGameStats = () => {
  fetch('/api/game-stats', { method: 'GET' })
    .then((res) => res.json())
    .then(data => {
      gameState.initialize(data);
      if (gameState.isMyTurn()) {
        // stop polling
        reqValidStops();
      }
    })
    .then(_ => updatePins());
};
