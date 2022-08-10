class Player {
  #username;
  #role;
  #currentPosition;
  #isHost;
  #color;

  constructor(username) {
    this.#username = username;
    this.#isHost = false;
  }

  assignRole(role) {
    if (!this.#role) {
      this.#role = role;
      this.#color = getColor(role);
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
      isHost: this.#isHost,
      color: this.#color  
    }
  }
}

const getColor = (role) => {
  const rolesColor = {
    'Mr. X': 'black',
    'Det. red': 'red',
    'Det. green': 'green',
    'Det. blue': 'blue',
    'Det. yellow': 'yellow',
    'Det. purple': 'purple'
  };
  return rolesColor[role];
}

module.exports = { Player };