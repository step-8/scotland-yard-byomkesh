const main = () => {
  const req = { method: 'GET', url: '/user-name' };
  sendRequest(req, updateNav);
};

window.onload = main;
