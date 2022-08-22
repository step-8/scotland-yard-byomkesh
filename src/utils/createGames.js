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

module.exports = { getGamesInfo };
