const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

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

  addHandler(handler) {
    this.#handlers.push(handler);
  }

  #emit() {
    this.#handlers.forEach(handler => handler(this));
  }

  set possibleRoutes(stops) {
    this.#possibleRoutes = stops;
  }

  get possibleRoutes() {
    return cloneObject(this.#possibleRoutes);
  }

  get currentPlayer() {
    return cloneObject(this.#currentPlayer);
  }

  get players() {
    return cloneObject(this.#players);
  }

  get playerName() {
    return this.#playerName;
  }

  get robberLog() {
    return cloneObject(this.#robberLog);
  }

  get robber() {
    const players = this.#players;
    const robber = players.find(({ role }) => role === 'Mr. X');
    return robber;
  }
}

