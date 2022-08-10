class Users {
  #users;

  constructor(users) {
    this.#users = users;
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

  toJson() {
    return JSON.stringify(this.#users);
  }
}

module.exports = { Users };
