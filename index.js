const { initApp } = require('./src/app.js');
const { parsed } = require('dotenv').config();
const { Users } = require('./src/models/users.js');

const config = {
  mode: parsed.NODE_ENV
};

const startServer = port => {
  const users = new Users();
  const app = initApp(config, users);

  app.listen(port, () => console.log(`Listening on the Port : ${port}`));
};

const PORT = 8000;

startServer(PORT);
