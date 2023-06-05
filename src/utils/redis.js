const redis = require('redis');

const createRedisClient = () => {
  if (process.env.NODE_ENV === 'production') {
    const {
      REDIS_HOST: host,
      REDIS_PASSWORD: password,
      REDIS_USERNAME: username,
      REDIS_PORT: port
    } = process.env;

    const url = `rediss://${username}:${password}@${host}:${port}`;

    return redis.createClient({ url });
  }

  return redis.createClient();
};

module.exports = { createRedisClient };
