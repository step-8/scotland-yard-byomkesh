const { Game } = require("./game.js");

class Games {
  constructor(stops) {
    this.index = 1;
    this.games = {};
    this.stops = stops;
  }

  createGame() {
    const game = new Game(this.index, this.stops);
    this.games[this.index] = game;
    this.index++;
    return game;
  }

  findGame(gameId) {
    return this.games[gameId];
  }

  deleteGame(gameId) {
    return delete this.games[gameId];
  }
};

module.exports = { Games };
