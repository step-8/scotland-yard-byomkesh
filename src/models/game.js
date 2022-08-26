const { Player } = require('./player.js');
const { mrX } = require('../utils/roles.js');

const createEmptyStop = () => {
  return {
    taxies: [],
    buses: [],
    subways: [],
    ferries: []
  };
};

const detectivesWinStatusLookup = (role) => {
  const status = {
    'Detective Red': 2,
    'Detective Green': 3,
    'Detective Purple': 4,
    'Detective Blue': 5,
    'Detective Yellow': 6
  };
  return status[role];
};

const isMrXStranded = strandedPlayers => {
  return strandedPlayers.some(player => player.role === mrX);
};

const areDetectivesStranded = (detectives, strandedPlayers) => {
  const strandedDetectives = strandedPlayers.filter(
    ({ role }) => role.includes('Detective')
  ).map(({ username }) => username);

  return detectives.every(({ username }) => {
    return strandedDetectives.includes(username);
  });
};

const areDetectivesOutOfTickets = detectives => {
  return detectives.every(({ tickets }) => {
    const allTickets = Object.values(tickets);
    const ticketSum = allTickets.reduce((a, b) => a + b);
    return ticketSum <= 0;
  });
};

const isStranded = validStops => {
  const stops = Object.values(validStops).flat();
  return stops.length <= 0;
};

class Game {
  #gameId;
  #host;
  #isGameStarted;
  #players;
  #stops;
  #limit;
  #currentPlayerIndex;
  #round;
  #gameOver;
  #winningStatus;
  #twoXTakenAt;
  #leftPlayers;

  constructor(gameId, stops = {}, players = []) {
    this.#gameId = gameId;
    this.#host = null;
    this.#isGameStarted = false;
    this.#players = players;
    this.#stops = stops;
    this.#limit = { min: 3, max: 6 };
    this.#round = 0;
    this.#gameOver = false;
    this.#winningStatus = null;
    this.#twoXTakenAt = null;
    this.#leftPlayers = [];
  }

  init({ isGameStarted, players, currentPlayerIndex, round, gameOver, winningStatus, twoXTakenAt, leftPlayers }) {
    this.#isGameStarted = isGameStarted;
    this.#currentPlayerIndex = currentPlayerIndex;
    this.#round = round;
    this.#gameOver = gameOver;
    this.#winningStatus = winningStatus;
    this.#twoXTakenAt = twoXTakenAt;
    this.#players = [];
    this.#leftPlayers = leftPlayers;

    players.forEach(({ username, isHost, ...playerData }) => {

      const player = new Player(username);
      if (isHost) {
        player.setHost();
        this.#host = player;
      }

      player.init(playerData);
      this.#players.push(player);
    });
  }

  addPlayer(player) {
    this.#players.push(player);
    if (!this.#host) {
      this.#host = player;
    }
  }

  isHost(username) {
    const hostInfo = this.#host.info;
    return username === hostInfo.username;
  }

  #assignHostToNext() {
    if (!this.#players[1]) {
      return;
    }
    this.#players[1].setHost();
    this.#host = this.#players[1];
  }

  removePlayer(username) {
    if (this.isHost(username)) {
      this.#assignHostToNext();
    }
    this.#players = this.#players.filter(player =>
      !player.isSamePlayer(username));
  }

  canGameSustain() {
    return this.#players.length > 0;
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
    this.#setGameOverStatus();
  }

  canGameStart() {
    return this.#players.length >= this.#limit.min && !this.#isGameStarted;
  }

  isGameFull() {
    return this.#players.length >= this.#limit.max;
  }

  updateRound() {
    const currentPlayer = this.#players[this.#currentPlayerIndex];
    if (currentPlayer.info.role === mrX) {
      this.#round += 1;
    }
  }

  playMove(destination, ticket) {
    const currentPlayer = this.#players[this.#currentPlayerIndex];
    currentPlayer.updatePosition(destination);
    currentPlayer.updateLog(ticket);
    currentPlayer.reduceTicket(ticket);

    this.updateRound();

    if (!this.isTwoXInAction()) {
      this.changeCurrentPlayer();
    }
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
    const players = this.#players.map(player => player.info);
    const isGameStarted = this.#isGameStarted;
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
    const connectedStop = this.#stops[requestedPlayer.info.currentPosition];
    const validStops = createEmptyStop();
    const routes = Object.keys(connectedStop);

    routes.forEach(route => {
      const availableStops = connectedStop[route].filter(x => {
        return !this.#isStopOccupiedByDetective(x);
      });
      validStops[route] = [];
      const isTicketAvailable = requestedPlayer.isTicketAvailable(route);
      const notHideLast = requestedPlayer.notHideLast(route);

      if (isTicketAvailable && notHideLast) {
        validStops[route] = availableStops;
      }
    });
    return validStops;
  }

  isMovePossible(username, position) {
    const stops = this.getValidStops(username);
    const allStops = Object.values(stops).flat();
    return allStops.includes(position);
  }

  addAsLeft(player) {
    this.#leftPlayers.push(player.info);
  }

  #getStrandedPlayers() {
    const strandedPlayers = [];

    this.getPlayers().forEach(player => {
      const validStops = this.getValidStops(player.username);
      if (isStranded(validStops)) {
        strandedPlayers.push({
          role: player.role,
          username: player.username
        });
      }
    });

    return strandedPlayers;
  }

  #getMrXLocation() {
    const mrXLocation = this.getPlayers().find(player => player.role === mrX);
    return mrXLocation.currentPosition;
  }

  #isRoundOver() {
    return this.#currentPlayerIndex === 0;
  }

  #getDetectives() {
    return this.getPlayers().filter(player => {
      return player.role.includes('Detective');
    });
  }

  #setDetectiveWinStatus() {
    const mrXLocation = this.#getMrXLocation();
    const detectives = this.#getDetectives();

    const winningDetective = detectives.find(({ currentPosition }) => {
      return currentPosition === mrXLocation;
    });
    this.#winningStatus = detectivesWinStatusLookup(winningDetective.role);
  }

  #setDetectivesWinStatus() {
    if (isMrXStranded(this.#getStrandedPlayers())) {
      this.#gameOver = true;
      this.#winningStatus = 1;
    }

    const mrXLocation = this.#getMrXLocation();
    if (this.#isStopOccupiedByDetective(mrXLocation)) {
      this.#gameOver = true;
      this.#setDetectiveWinStatus();
    }
  }

  #setMrXWinStatus() {
    const detectives = this.#getDetectives();
    if (areDetectivesStranded(detectives, this.#getStrandedPlayers())) {
      this.#gameOver = true;
      this.#winningStatus = 8;
    }

    if (areDetectivesOutOfTickets(detectives)) {
      this.#gameOver = true;
      this.#winningStatus = 9;
    }

    if (this.#round >= 24) {
      this.#gameOver = true;
      this.#winningStatus = 10;
    }
  }

  #setGameOverStatus() {
    if (!this.#isRoundOver()) {
      return;
    }

    this.#setDetectivesWinStatus();
    this.#setMrXWinStatus();
  }

  isInLobby() {
    return !this.#isGameStarted;
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

  get round() {
    return this.#round;
  }

  get playerCount() {
    return this.#players.length;
  }

  gameOver(statusCode) {
    this.#gameOver = true;
    this.#winningStatus = statusCode;
  }

  areAllDetectivesLeft() {
    return this.#getDetectives().length === this.#leftPlayers.length;
  }

  isRevelationRound() {
    const revelationRounds = [3, 8, 13, 18, 24];
    return revelationRounds.includes(this.#round);
  }

  isTwoXAvailable() {
    if (this.#twoXTakenAt === null) {
      return true;
    }

    const currentPlayer = this.#players[this.#currentPlayerIndex];
    if (!currentPlayer.isMrX()) {
      return false;
    }

    if (!currentPlayer.isTicketAvailable('twoX')) {
      return false;
    }

    const roundsAfterTwoX = this.round - this.#twoXTakenAt;
    return roundsAfterTwoX > 2;
  }

  enableTwoX(round) {
    this.#twoXTakenAt = round;
    const currentPlayer = this.#players[this.#currentPlayerIndex];
    currentPlayer.reduceTicket('twoX');
  }

  isTwoXInAction() {
    if (this.#twoXTakenAt === null) {
      return false;
    }
    const roundsAfterTwoX = this.round - this.#twoXTakenAt;
    return roundsAfterTwoX === 1;
  }

  isMyPlayer(username) {
    this.#players.some(player => player.isSamePlayer(username));
  }

  getInitialStats(username) {
    const currentPlayer = this.findPlayer(username);
    const players = this.getPlayers();

    if (currentPlayer.isMrX()) {
      return players;
    }

    players.forEach(player => {
      if (player.role === 'Mr. X') {
        player.currentPosition = 'XXX';
      }
    });

    return players;
  }

  getState() {
    const gameData = this.getStatus();
    gameData.gameId = this.#gameId;
    gameData.currentPlayerIndex = this.#currentPlayerIndex;
    gameData.round = this.#round;
    gameData.strandedPlayers = this.#round > 0
      ? this.#getStrandedPlayers() : [];
    gameData.gameOver = this.#gameOver;
    gameData.winningStatus = this.#winningStatus;
    gameData.twoXTakenAt = this.#twoXTakenAt;
    gameData.leftPlayers = this.#leftPlayers;
    return gameData;
  }

  hasPlayerLeft(username) {
    return this.#leftPlayers.some((player) => {
      return player.username === username;
    });
  }
}

module.exports = { Game };
