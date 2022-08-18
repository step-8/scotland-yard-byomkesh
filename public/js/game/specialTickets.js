const updateSpecialTickets = (gameState) => {
  const robber = gameState.robber;
  const currentPlayer = gameState.currentPlayer;
  const { black } = robber.tickets;
  const ferry = byId('ferry');
  ferry.innerText = black;

  const tr = ferry.parentElement;
  tr.className = null;

  if (currentPlayer.role === 'Mr. X') {
    tr.classList.add('dark-black');
    tr.classList.add('white-Text');
  }
};
