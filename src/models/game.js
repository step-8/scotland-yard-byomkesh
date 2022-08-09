class Game {
  #gameId;
  #host;
  #isGameStarted;
  #players;
  #stops;
  #limit;

  constructor(gameId, stops) {
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

  // getPlayers() {
  //   return this.#players;
  // }

  changeGameStatus() {
    this.#isGameStarted = true;
  }

  canGameStart() {
    return this.#players.length >= this.#limit.min;
  }

  isGameFull() {
    return this.#players.length > this.#limit.max;
  }

  get gameId() {
    return this.#gameId;
  }

  getPlayers() {
    const players = [];
    this.#players.forEach(player => {
      players.push(player.info);
    });
    return { players };
  }
};

module.exports = { Game };
