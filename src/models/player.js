const DETECTIVE_TICKETS = { taxi: 10, bus: 8, subway: 4, black: 0, twoX: 0 };
const MR_X_TICKETS = { taxi: 0, bus: 0, subway: 0, black: 5, twoX: 2 };

class Player {
  #username;
  #role;
  #currentPosition;
  #isHost;
  #color;
  #tickets;

  constructor(username) {
    this.#username = username;
    this.#isHost = false;
  }

  assignRole(role) {
    if (!this.#role) {
      this.#role = role;
      this.#color = getColor(role);
      this.#tickets = role === 'Mr. X' ? MR_X_TICKETS : DETECTIVE_TICKETS;
    }
  }

  updatePosition(currentPosition) {
    this.#currentPosition = currentPosition;
  }

  setHost() {
    this.#isHost = true;
  }

  get tickets() {
    return this.#tickets;
  }

  get info() {
    return {
      username: this.#username,
      role: this.#role,
      currentPosition: this.#currentPosition,
      isHost: this.#isHost,
      color: this.#color,
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