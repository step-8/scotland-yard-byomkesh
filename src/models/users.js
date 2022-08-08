class Users {
  #users;

  constructor() {
    const root = { username: 'root', password: 'root' };
    this.#users = { root };
  }

  haveUser(uname) {
    const username = uname.toLowerCase();

    return Object.keys(this.#users).includes(username);
  }

  addUser(uname, password) {
    const username = uname.toLowerCase();

    if (!this.haveUser(username)) {
      this.#users[username] = { username, password };
      return true;
    }
    return false;
  }

  authUser(uname, password) {
    const username = uname.toLowerCase();

    return this.#users[username] && this.#users[username].password === password;
  }
}

module.exports = { Users };
