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

  addGame(id, players) {
    const game = new Game(id, this.#stops, players);
    this.#games[id] = game;
    return game;
  }

  isPlayerInGame(username) {
    const allGames = this.getAllGames();
    return allGames.some(game => game.isPlayerActive(username));
  }

  findPlayerGameId(username) {
    const allGames = this.getAllGames();
    const playerGame = allGames.find(game => game.isPlayerActive(username));
    return playerGame ? playerGame.gameId : null;
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
    this.getAllGames().forEach(
      game => gamesData.games.push(game.getState()));

    return gamesData;
  }
  getNextGameId() {
    return this.#index;
  }
}

module.exports = { Games };
