const { initApp } = require('./src/app.js');

const startServer = port => {
  const app = initApp();
  app.listen(port, () => console.log(`Listening on the Port : ${port}`));
};

const PORT = 8000;

startServer(PORT);
