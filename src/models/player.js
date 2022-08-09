class Player {
  #username;
  #role;
  #currentPosition;

  constructor(username) {
    this.#username = username;
  }

  assignRole(role) {
    if (!this.#role) {
      this.#role = role;
    }
  }

  updatePosition(currentPosition) {
    this.#currentPosition = currentPosition;
  }

  get info() {
    return {
      username: this.#username,
      role: this.#role,
      currentPosition: this.#currentPosition
    }
  }
}

module.exports = { Player };