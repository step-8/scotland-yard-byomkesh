class Player {
  #username;
  #role;
  #currentPosition;
  #isHost;

  constructor(username) {
    this.#username = username;
    this.#isHost = false;
  }

  assignRole(role) {
    if (!this.#role) {
      this.#role = role;
    }
  }

  updatePosition(currentPosition) {
    this.#currentPosition = currentPosition;
  }

  setHost() {
    this.#isHost = true;
  }

  get info() {
    return {
      username: this.#username,
      role: this.#role,
      currentPosition: this.#currentPosition,
      isHost: this.#isHost
    }
  }
}

module.exports = { Player };