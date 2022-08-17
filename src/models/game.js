const { mrX } = require('../utils/roles.js');

const createEmptyStop = () => {
  return {
    taxies: [],
    buses: [],
    subways: [],
    ferries: []
  };
};

class Game {
  #gameId;
  #host;
  #isGameStarted;
  #players;
  #stops;
  #limit;
  #currentPlayerIndex;

  constructor(gameId, stops = {}) {
    this.#gameId = gameId;
    this.#host = null;
    this.#isGameStarted = false;
    this.#players = [];
    this.#stops = stops;
    this.#limit = { min: 3, max: 6 };
  }

  addPlayer(player) {
    this.#players.push(player);
    if (!this.#host) {
      this.#host = player;
      player.setHost();
    }
  }

  getPlayers() {
    return this.#players.map(player => player.info);
  }

  findPlayer(username) {
    return this.#players.find((player) => player.isSamePlayer(username));
  }

  changeGameStatus() {
    this.#isGameStarted = true;
    this.#currentPlayerIndex = 0;
  }

  changeCurrentPlayer() {
    this.#currentPlayerIndex =
      (this.#currentPlayerIndex + 1) % this.#players.length;
  }
  canGameStart() {
    return this.#players.length >= this.#limit.min;
  }

  isGameFull() {
    return this.#players.length >= this.#limit.max;
  }

  playMove(destination, ticket) {
    const currentPlayer = this.#players[this.#currentPlayerIndex];

    currentPlayer.updatePosition(destination);
    currentPlayer.updateLog(ticket);
    currentPlayer.reduceTicket(ticket);

    this.changeCurrentPlayer();
  }

  getLocations() {
    return this.#players.map(({ color, currentPosition }) => ({ color, currentPosition }));
  }

  stopInfo(stop) {
    return JSON.parse(JSON.stringify(this.#stops[stop]));
  }

  assignRoles(roles, shuffler = (x) => x) {
    this.#players = shuffler(this.#players);

    this.#players.forEach((player, index) => {
      player.assignRole(roles[index]);
    });
  }

  assignInitialPositions(initialPositions) {
    this.#players.forEach((player, index) => {
      player.updatePosition(initialPositions[index]);
    });
  }

  getStatus() {
    const players = [];
    const isGameStarted = this.#isGameStarted;

    this.#players.forEach(player => {
      players.push(player.info);
    });
    return { players, isGameStarted };
  }

  #stopsOccupiedByDetectives() {
    const occupiedStops = [];
    this.getPlayers().forEach(player => {
      if (player.role === mrX) {
        return;
      }
      occupiedStops.push(player.currentPosition);
    });
    return occupiedStops;
  }

  #isStopOccupiedByDetective(stop) {
    return this.#stopsOccupiedByDetectives().includes(stop);
  }

  getValidStops(username) {
    const requestedPlayer = this.findPlayer(username);
    const connectedStop = this.#stops[requestedPlayer.position];
    const validStops = createEmptyStop();
    const routes = Object.keys(connectedStop);

    routes.forEach(route => {
      const availableStops = connectedStop[route].filter(x => {
        return !this.#isStopOccupiedByDetective(x);
      });

      validStops[route] =
        requestedPlayer.isTicketAvailable(route) ? availableStops : [];
    });
    return validStops;
  }

  get gameId() {
    return this.#gameId;
  }

  get isStarted() {
    return this.#isGameStarted;
  }

  get currentPlayer() {
    return this.#players[this.#currentPlayerIndex].info;
  }
}

module.exports = { Game };
