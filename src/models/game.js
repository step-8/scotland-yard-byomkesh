class Game {
  #gameId;
  #host;
  #isGameStarted;
  #players;
  #stops;
  #currentPlayer;
  #limit;

  constructor(gameId, stops = {}) {
    this.#gameId = gameId;
    this.#host = null;
    this.#currentPlayer = null;
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

  changeGameStatus() {
    this.#isGameStarted = true;
    this.#currentPlayer = this.#players[0];
  }

  canGameStart() {
    return this.#players.length >= this.#limit.min;
  }

  isGameFull() {
    return this.#players.length >= this.#limit.max;
  }

  get gameId() {
    return this.#gameId;
  }

  get isStarted() {
    return this.#isGameStarted;
  }

  get currentPlayer() {
    return this.#currentPlayer.info;
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
};

module.exports = { Game };
