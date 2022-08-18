class GameState {
  #players;
  #currentPlayer;
  #playerName;
  #possibleRoutes;
  #robberLog;
  #handlers;

  constructor() {
    this.#players = null;
    this.#currentPlayer = null;
    this.#playerName = null;
    this.#robberLog = [];
    this.#handlers = [];
  }

  initialize({ players, currentPlayer, playerName, robberLog }) {
    this.#players = players;
    this.#currentPlayer = currentPlayer;
    this.#playerName = playerName;
    this.#robberLog = robberLog;

    this.#emit();
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

  addHandler(handler) {
    this.#handlers.push(handler);
  }

  #emit() {
    this.#handlers.forEach(handler => handler(this));
  }
}

