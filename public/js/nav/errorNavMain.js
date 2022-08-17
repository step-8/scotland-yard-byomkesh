const main = () => {
  const req = { method: 'GET', url: '/api/user-name' };
  sendRequest(req, updateNav);
};

window.onload = main;
