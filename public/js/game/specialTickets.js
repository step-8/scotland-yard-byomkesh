const updateSpecialTickets = (gameState) => {
  const robber = gameState.robber;
  const { black } = robber.tickets;
  const ferry = byId('ferry');
  ferry.innerText = black;
};
