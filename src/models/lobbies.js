const { Lobby } = require('./lobby');

const createLobby = ({ lobbyId, joinees, limit }) => {
  const [host, ...restOfJoinees] = joinees;
  const lobby = new Lobby(+lobbyId, host, limit);
  restOfJoinees.forEach(joinee => {
    lobby.addJoinee(joinee);
  });
  return lobby;
};

class Lobbies {
  #lobbies;
  #nextLobbyId;
  constructor(lobbies = [], nextLobbyId = 1) {
    this.#lobbies = lobbies;
    this.#nextLobbyId = nextLobbyId;
  }

  static init({ lobbies, nextLobbyId }) {
    const lobbyInstances = lobbies.map(lobby => {
      return createLobby(lobby);
    });

    return new Lobbies(lobbyInstances, nextLobbyId);
  }

  addLobby(lobby) {
    this.#lobbies.push(lobby);
    this.#nextLobbyId++;
  }

  createLobby(host, limit) {
    const id = this.#nextLobbyId;
    const lobby = new Lobby(id, host, limit);
    this.addLobby(lobby);

    return lobby;
  }

  findLobby(lobbyId) {
    return this.#lobbies.find(lobby => lobby.isMyLobbyId(lobbyId));
  }

  #indexOfLobby(lobby) {
    return this.#lobbies.indexOf(lobby);
  }

  removeLobby(lobbyId) {
    const lobby = this.findLobby(lobbyId);
    const indexOfLobby = this.#indexOfLobby(lobby);
    this.#lobbies.splice(indexOfLobby);
  }

  #getLobbies() {
    return this.#lobbies.map(lobby => lobby.getState());
  }

  isPlayerInLobby(username) {
    return this.#lobbies.some(lobby => lobby.isMyJoinee(username));
  }

  get nextLobbyId() {
    return this.#nextLobbyId;
  }

  getState() {
    const lobbies = this.#getLobbies();
    const nextLobbyId = this.#nextLobbyId;
    return { lobbies, nextLobbyId };
  }
}

module.exports = { Lobbies };
