const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

class GameState {
  #players;
  #currentPlayer;
  #playerName;
  #possibleRoutes;
  #robberLog;
  #handlers;
  #strandedPlayers;
  #gameOver;
  #winningStatus;
  #round;
  #twoXTakenAt;
  #leftPlayers;
  #oldData;

  constructor() {
    this.#players = null;
    this.#currentPlayer = null;
    this.#playerName = null;
    this.#robberLog = [];
    this.#handlers = [];
    this.#strandedPlayers = [];
    this.#leftPlayers = [];
    this.#gameOver = false;
    this.#winningStatus = null;
    this.#twoXTakenAt = null;
    this.#oldData = {};
  }

  initialize(newState) {
    this.#oldData = {
      players: this.#players,
      currentPlayer: this.#currentPlayer,
      playerName: this.#playerName,
      robberLog: this.#robberLog,
      strandedPlayers: this.#strandedPlayers,
      leftPlayers: this.#leftPlayers,
      gameOver: this.#gameOver,
      winningStatus: this.#winningStatus,
      round: this.#round,
      twoXTakenAt: this.#twoXTakenAt,
    };

    const { players, currentPlayer, playerName, robberLog, strandedPlayers, leftPlayers, gameOver, winningStatus, round, twoXTakenAt } = newState;
    this.#players = players;
    this.#currentPlayer = currentPlayer;
    this.#playerName = playerName;
    this.#robberLog = robberLog;
    this.#strandedPlayers = strandedPlayers;
    this.#leftPlayers = leftPlayers;
    this.#gameOver = gameOver;
    this.#winningStatus = winningStatus;
    this.#round = round;
    this.#twoXTakenAt = twoXTakenAt;
    this.#emit();
  }

  getLocations() {
    return this.#players.map(({ color, currentPosition }) => ({ color, currentPosition }));
  }

  isMyTurn() {
    return this.#playerName === this.#currentPlayer.username;
  }

  isCurrentPlayer(username) {
    return this.#currentPlayer.username === username;
  }

  isMyScreen(username) {
    return this.#playerName === username;
  }

  isTwoXAvailable() {
    if (this.#twoXTakenAt === null) {
      return true;
    }

    const { twoX } = this.#currentPlayer.tickets;
    if (twoX < 1) {
      return false;
    }

    const roundsAfterTwoX = this.#round - this.#twoXTakenAt;
    return roundsAfterTwoX > 2;
  }

  isTwoXInAction() {
    if (this.#twoXTakenAt === null) {
      return false;
    }
    const roundsAfterTwoX = this.round - this.#twoXTakenAt;
    return roundsAfterTwoX < 2;
  }

  addHandler(handler) {
    this.#handlers.push(handler);
  }

  isMrXTurn() {
    return this.#currentPlayer.role === 'Mr. X';
  }

  amIMrX() {
    if (!this.isMrXTurn()) {
      return false;
    }

    if (this.#currentPlayer.username !== this.#playerName) {
      return false;
    }

    return true;
  }

  hasTaken2XInThisRound() {
    return this.#round === this.#twoXTakenAt;
  }

  isPlayerLeftTheGame(player) {
    return this.#leftPlayers.some(leftPlayer => {
      return leftPlayer.role === player.role;
    });
  }

  isPlayerStranded(player) {
    return this.#strandedPlayers.some(strandedPlayer => {
      return strandedPlayer.role === player.role;
    });
  }

  isPlayerLeft() {
    const currentPlayer = this.#currentPlayer;
    return this.#leftPlayers.some(({ username }) => {
      return currentPlayer.username === username;
    });
  }

  getDetectives() {
    return this.#players.filter(
      player => player.role.includes('Detective')
    );
  }

  #emit() {
    this.#handlers.forEach(handler => handler(this));
  }

  #priorPlayer() {
    return this.#oldData.currentPlayer;
  }

  isTurnChanged() {
    return this.#currentPlayer.username !== this.#priorPlayer()?.username;
  }

  set possibleRoutes(stops) {
    this.#possibleRoutes = stops;
  }

  get possibleRoutes() {
    return cloneObject(this.#possibleRoutes);
  }

  get currentPlayer() {
    return cloneObject(this.#currentPlayer);
  }

  get players() {
    return cloneObject(this.#players);
  }

  get playerName() {
    return this.#playerName;
  }

  get robberLog() {
    return cloneObject(this.#robberLog);
  }

  get mrX() {
    const players = this.#players;
    const robber = players.find(({ role }) => role === 'Mr. X');
    return robber;
  }

  get strandedPlayers() {
    return this.#strandedPlayers;
  }

  get gameOver() {
    return this.#gameOver;
  }

  get winningStatus() {
    return this.#winningStatus;
  }

  get round() {
    return this.#round;
  }

  get twoXTakenAt() {
    return this.#twoXTakenAt;
  }

  get leftPlayers() {
    return this.#leftPlayers;
  }
}
