class GameState {
  #players;
  #currentPlayer;
  #playerName;

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

  getPossibleRoutes() { }
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

const reqGameStats = () => {
  fetch('/api/game-stats', { method: 'GET' })
    .then((res) => res.json())
    .then(data => {
      gameState.initialize(data);
    })
    .then(_ => updatePins());
};

const main = () => {
  reqGameStats();
};

window.onload = main;
