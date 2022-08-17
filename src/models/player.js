const { mrX } = require('../utils/roles.js');

const ticketNameMapper = (pluralTicket) => {
  const obj = {
    'buses': 'bus',
    'subways': 'subway',
    'taxies': 'taxi',
    'ferries': 'ferry'
  };

  return obj[pluralTicket];
};

const getDetectiveTickets = () => {
  const DETECTIVE_TICKETS = { taxi: 10, bus: 8, subway: 4, black: 0, twoX: 0 };
  const { taxi, bus, subway, black, twoX } = DETECTIVE_TICKETS;

  return { taxi, bus, subway, black, twoX };
};

const getMrXTickets = () => {
  const MR_X_TICKETS = { taxi: 24, bus: 24, subway: 24, black: 5, twoX: 2 };
  const { taxi, bus, subway, black, twoX } = MR_X_TICKETS;

  return { taxi, bus, subway, black, twoX };
};

class Player {
  #username;
  #role;
  #currentPosition;
  #isHost;
  #color;
  #tickets;
  #log;

  constructor(username) {
    this.#username = username;
    this.#isHost = false;
    this.#log = [];
  }

  assignRole(role) {
    if (!this.#role) {
      this.#role = role;
      this.#color = getColor(role);
      this.#tickets =
        role === mrX ? getMrXTickets() : getDetectiveTickets();
    }
  }

  updatePosition(currentPosition) {
    this.#currentPosition = currentPosition;
  }

  updateLog(ticket) {
    this.#log.push(ticket);
  }

  isSamePlayer(username) {
    return this.#username === username;
  }

  setHost() {
    this.#isHost = true;
  }

  reduceTicket(ticket) {
    this.#tickets[ticket]--;
  }

  isTicketAvailable(rawTicket) {
    const ticket = ticketNameMapper(rawTicket);
    return this.#tickets[ticket] > 0;
  }

  get tickets() {
    return this.#tickets;
  }

  get position() {
    return this.#currentPosition;
  }

  get info() {
    return {
      username: this.#username,
      role: this.#role,
      currentPosition: this.#currentPosition,
      isHost: this.#isHost,
      color: this.#color,
      tickets: this.#tickets,
      log: this.#log
    };
  }
}

const getColor = (role) => {
  const rolesColor = {
    'Mr. X': 'black',
    'Detective Red': 'red',
    'Detective Green': 'green',
    'Detective Blue': 'blue',
    'Detective Yellow': 'yellow',
    'Detective Purple': 'purple'
  };
  return rolesColor[role];
};

module.exports = { Player };
