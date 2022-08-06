const { initApp } = require('./src/app.js');
const { parsed } = require('dotenv').config();

const config = {
  mode: parsed.NODE_ENV
};

const startServer = port => {
  const app = initApp(config);
  app.listen(port, () => console.log(`Listening on the Port : ${port}`));
};

const PORT = 8000;

startServer(PORT);
