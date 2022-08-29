const getGamesInfo = (gamesStore) => {
  return gamesStore.getAll().then((rawGamesObj) => {
    return Object.entries(rawGamesObj)
      .reduce((gamesData, [key, value]) => {
        if (key === 'newGameId') {
          gamesData.newGameId = value;
          return gamesData;
        }

        gamesData.games.push(JSON.parse(value));
        return gamesData;
      }, { games: [], newGameId: 1 });
  });
};

const getLobbiesInfo = (lobbiesStore) => {
  return lobbiesStore.getAll().then((rawLobbiesObj) => {
    return Object.entries(rawLobbiesObj)
      .reduce((lobbiesData, [key, value]) => {
        if (key === 'nextLobbyId') {
          lobbiesData.nextLobbyId = +value;
          return lobbiesData;
        }

        lobbiesData.lobbies.push(JSON.parse(value));
        return lobbiesData;
      }, { lobbies: [], nextLobbyId: 1 });
  });
};

module.exports = { getGamesInfo, getLobbiesInfo };
