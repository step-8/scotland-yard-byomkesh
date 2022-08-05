const express = require('express');

const initApp = () => {
  const app = express();
  return app;
};

module.exports = { initApp };
