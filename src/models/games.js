const { Game } = require('./game.js');

class Games {
  #index;
  #games;
  #stops;

  constructor(stops) {
    this.#index = 1;
    this.#games = {};
    this.#stops = stops;
  }

  createGame() {
    const game = new Game(this.#index, this.#stops);
    this.#games[this.#index] = game;
    this.#index++;
    return game;
  }

  init({ games, newGameId }) {
    this.#index = newGameId;
    games.forEach(({ gameId, ...gameData }) => {
      const game = new Game(gameId, this.#stops);
      game.init(gameData);
      this.#games[gameId] = game;
    });
  }

  findGame(gameId) {
    return this.#games[gameId];
  }

  deleteGame(gameId) {
    return delete this.#games[gameId];
  }

  getAllGames() {
    return Object.values(this.#games);
  }

  getState() {
    const gamesData = { newGameId: this.#index, games: [] };
    this.getAllGames().forEach(game => gamesData.games.push(game.getState()));

    return gamesData;
  }
}

module.exports = { Games };
