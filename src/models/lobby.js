class Lobby {
  #lobbyId;
  #joinees;
  #limit;
  #isLobbyClosed;

  constructor(lobbyId, host, limit, isLobbyClosed = false) {
    this.#lobbyId = lobbyId;
    this.#joinees = [host];
    this.#limit = limit;
    this.#isLobbyClosed = isLobbyClosed;
  }

  isLobbyFull() {
    return this.#joinees.length === this.#limit.max;
  }

  addJoinee(joinee) {
    if (this.isLobbyFull()) {
      return;
    }

    this.#joinees.push(joinee);
  }

  #indexOfJoinee(username) {
    return this.#joinees.indexOf(username);
  }

  #getHost() {
    return this.#joinees[0];
  }

  isHost(username) {
    return this.#getHost() === username;
  }

  leave(username) {
    const indexOfJoinee = this.#indexOfJoinee(username);
    if (this.#joinees.length <= 1) {
      this.#isLobbyClosed = true;
    }
    this.#joinees.splice(indexOfJoinee, 1);
  }

  haveMinPlayersJoined() {
    return this.#limit.min <= this.#joinees.length;
  }

  canLobbyClose(username) {
    return this.isHost(username) && this.haveMinPlayersJoined();
  }

  getJoinees() {
    const joinees = this.#joinees.map(joinee => {
      return { username: joinee, isHost: false };
    });

    joinees[0].isHost = true;
    return joinees;
  }

  isMyLobbyId(lobbyId) {
    return this.#lobbyId === lobbyId;
  }

  isMyJoinee(username) {
    if (this.#isLobbyClosed) {
      return false;
    }
    return this.#joinees.includes(username);
  }

  closeLobby(username) {
    if (!this.canLobbyClose(username)) {
      return;
    }
    this.#isLobbyClosed = true;
  }

  canLobbySustain() {
    return this.#joinees.length > 0;
  }

  get isLobbyClosed() {
    return this.#isLobbyClosed;
  }

  get lobbyId() {
    return this.#lobbyId;
  }

  get joineeCount() {
    return this.#joinees.length;
  }

  getState() {
    const joinees = this.#joinees.slice(0);
    const lobbyId = this.#lobbyId;
    const limit = this.#limit;
    const isLobbyClosed = this.#isLobbyClosed;
    return { joinees, lobbyId, limit, isLobbyClosed };
  }

  forAPI() { // Change this name because model doesn't care about api.
    const joinees = this.getJoinees();
    const isLobbyClosed = this.#isLobbyClosed;
    const lobbyId = this.#lobbyId;
    return { joinees, isLobbyClosed, lobbyId };
  }
}

module.exports = { Lobby };
