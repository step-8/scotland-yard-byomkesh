const { Game } = require("./game.js");

class Games {
  constructor() {
    this.index = 1;
    this.games = [];
  }

  createGame() {
    const game = new Game(this.index, {});
    this.games.push(game);
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
