const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

class LobbyState {
  #lobbyId;
  #joinees;
  #handlers;
  #isHost;
  #username;
  #isLobbyClosed;
  #oldState;

  constructor() {
    this.#joinees = null;
    this.#handlers = [];
    this.#oldState = {};
    this.#lobbyId = null;
  }

  initialize(newState) {
    this.#oldState = {
      lobbyId: this.#lobbyId,
      joinees: this.#joinees,
      isHost: this.#isHost,
      username: this.#username,
      isGameStarted: this.#isLobbyClosed
    };

    const { joinees, isHost, username, isLobbyClosed, lobbyId } = newState;
    this.#lobbyId = lobbyId;
    this.#joinees = joinees;
    this.#isHost = isHost;
    this.#username = username;
    this.#isLobbyClosed = isLobbyClosed;

    this.#emit();
  }

  addHandler(handler) {
    this.#handlers.push(handler);
  }

  #emit() {
    this.#handlers.forEach(handler => handler(this));
  }

  getPlayers() {
    return cloneObject(this.#joinees);
  }

  totalPlayers() {
    return this.#joinees.length;
  }

  myData() {
    const currentUser = this.#joinees.find(player =>
      player.username === this.#username
    );

    return cloneObject(currentUser);
  }

  isStarted() {
    return this.#isLobbyClosed;
  }

  canGameStart() {
    return this.#joinees.length > 2;
  }

  whoLeft() {
    const oldPlayers = this.#oldState.joinees;
    const currentPlayers = this.#joinees;

    if (!oldPlayers) {
      return;
    }

    const leftPlayer = oldPlayers.find((x, i) => {
      return !(x.username === currentPlayers[i]?.username);
    });
    return leftPlayer?.username;
  }

  get lobbyId() {
    return this.#lobbyId;
  }
}
