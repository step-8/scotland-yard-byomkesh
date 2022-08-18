const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

class LobbyState {
  #players;
  #handlers;
  #isHost;
  #username;
  #isGameStarted;

  constructor() {
    this.#players = null;
    this.#handlers = [];
  }

  initialize({ players, isHost, username, isGameStarted }) {
    this.#players = players;
    this.#isHost = isHost;
    this.#username = username;
    this.#isGameStarted = isGameStarted;

    this.#emit();
  }

  addHandler(handler) {
    this.#handlers.push(handler);
  }

  #emit() {
    this.#handlers.forEach(handler => handler(this));
  }

  getPlayers() {
    return cloneObject(this.#players);
  }

  myData() {
    const currentUser = this.#players.find(player =>
      player.username === this.#username
    );

    return cloneObject(currentUser);
  }

  isStarted() {
    return this.#isGameStarted;
  }

  canGameStart() {
    return this.#players.length > 2;
  }
}
