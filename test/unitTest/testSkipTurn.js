const { assert } = require('chai');
const { skipTurn } = require('../../src/handlers/gameAPI.js');
const { Games } = require('../../src/models/games.js');
const { green, mrX } = require('../../src/utils/roles.js');

const createDummyPlayers = (role, position, tickets) => {
  const player = {
    username: 'a',
    role,
    currentPosition: position,
    isHost: true,
    color: 'green',
    tickets,
    log: []
  };
  return player;
};

describe('Skip Turn', () => {
  let games;

  beforeEach(() => {
    games = new Games({});
  });

  it('Should pass the turn to next player', () => {
    const player1 = createDummyPlayers(mrX, 74, {});
    const player2 = createDummyPlayers(green, 43, {});
    const gamesData = {
      newGameId: 2,
      games: [{
        players: [player1, player2],
        isGameStarted: true,
        gameId: 1,
        currentPlayerIndex: 0
      }]
    };

    games.init(gamesData);

    const expectedData = createDummyPlayers(green, 43, {});
    const mockedRequest = {
      session: { username: 'a', game: games.findGame(1) }
    };

    const mockedResponse = {

      json: (actualData) => {
        assert.deepStrictEqual(actualData, expectedData);
      }
    };

    skipTurn(() => { })(mockedRequest, mockedResponse);
  });
});
