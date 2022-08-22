const redis = require('redis');

const createRedisClient = () => {
  const { port } = process.env;

  if (process.env.NODE_ENV === 'production') {
    const { host, password, username } = process.env;
    const url = `redis://${username}:${password}@${host}:${port}`;

    return redis.createClient({ url });
  }

  return redis.createClient(port);
};

module.exports = { createRedisClient };
