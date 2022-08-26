const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

class LobbyState {
  #players;
  #handlers;
  #isHost;
  #username;
  #isGameStarted;
  #oldState;

  constructor() {
    this.#players = null;
    this.#handlers = [];
    this.#oldState = {};
  }

  initialize(newState) {
    this.#oldState = {
      players: this.#players,
      isHost: this.#isHost,
      username: this.#username,
      isGameStarted: this.#isGameStarted
    };

    const { players, isHost, username, isGameStarted } = newState;
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

  whoLeft() {
    const oldPlayers = this.#oldState.players;
    const currentPlayers = this.#players;

    if (!oldPlayers) {
      return;
    }
    const leftPlayer = oldPlayers.find((x, i) => {
      return !(x.username === currentPlayers[i]?.username);
    });
    return leftPlayer?.username;
  }
}
