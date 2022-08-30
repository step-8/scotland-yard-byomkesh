const { scenarios } = require("../utils/preLoadedScenarios.js");

const changeScenario = (game, scenario) => {
  const gameData = { ...game.getState() };

  const generateData = scenarios[scenario];
  const newData = generateData(gameData);

  game.init(newData);
};

const loadGame = (games, persistGames) => (req, res) => {
  const { gameId, scenario } = req.body;
  const game = games.findGame(gameId);

  if (!scenario || !game) {
    res.cookie('loadGameError', 'Something went wrong. Try again.');
    return res.redirect('/load-game');
  }

  changeScenario(game, scenario);

  persistGames(gameId, () => {
    res.cookie('success', 'Loaded game.');
    res.redirect('/load-game');
  });
};

const serveLoadGamePage = (views) => (req, res) => {
  res.sendFile('loadGame.html', { root: views });
};

module.exports = { loadGame, serveLoadGamePage };
