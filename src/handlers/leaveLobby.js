const removeJoinee = (session) => {
  const { username, lobby } = session;
  lobby.leave(username);
  delete session.lobbyId;
  delete session.lobby;
};

const leaveLobby = (persistLobbies) => (req, res) => {
  const { session } = req;
  const { lobbyId, lobby, username } = session;

  removeJoinee(session);

  if (!lobby.canLobbySustain()) {
    lobby.closeLobby(username);
    // lobbies.removeLobby(lobbyId);
    // gamesStore.delete(lobbyId).then(() => {
    //   res.redirect('/');
    // });
    // return;
  }

  persistLobbies(lobbyId, () => {
    res.redirect('/');
  });

};

module.exports = { leaveLobby };
