const randInt = (limit) => {
  return Math.ceil((Math.random() * 1000)) % limit;
};

const shuffle = (list) => {
  const shuffleLimit = Math.max(20, list.length);
  for (let index = 0; index < shuffleLimit; index++) {
    const position = randInt(list.length);
    const item = list[position];
    list.splice(position, 1);
    list.unshift(item);
  }
  return list;
};

const startGameHandler = (req, res) => {
  const game = req.session.game;
  if (!game || !game.canGameStart()) {
    res.json({ isStarted: false });
    return;
  }

  const roles = [
    'Mr. X', 'Det. red', 'Det. green',
    'Det. blue', 'Det. yellow', 'Det. purple'
  ];

  // const initalPositions = [
  //   13, 26, 29, 91, 117, 34, 50, 53, 94, 103,
  //   112, 123, 138, 141, 155, 174
  // ];
  const initialPositions = [19, 43, 32, 74, 46, 73, 31];

  const shuffledPositions = shuffle(initialPositions);

  game.assignRoles(roles, shuffle);
  game.assignInitialPositions(shuffledPositions);
  game.changeGameStatus();

  res.json({ isStarted: true, players: game.getPlayers() });
};

module.exports = { startGameHandler };
