const { Users } = require('../models/users.js');

const getUsers = (usersStore) => {
  return usersStore.getAll()
    .then((rawUsers) => {
      const usersEntries = Object.entries(rawUsers);
      const usersData = usersEntries.reduce((usersData, [username, obj]) => {
        usersData[username] = JSON.parse(obj);
        return usersData;
      }, {});

      return new Users(usersData);
    });
};

module.exports = { getUsers };
