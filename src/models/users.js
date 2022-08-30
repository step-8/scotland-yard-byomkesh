class Users {
  #users;

  constructor(users) {
    this.#users = users;
  }

  findUser(uname) {
    const username = uname.toLowerCase();

    return Object.values(this.#users).find(user => {
      return user.username.toLowerCase() === username;
    });
  }

  addUser(uname, password) {
    const username = uname;

    if (!this.findUser(username)) {
      this.#users[username] = { username, password };
      return true;
    }
    return false;
  }

  authUser(uname, password) {
    const user = this.findUser(uname);
    if (!user) {
      return false;
    }
    return password === user.password;
    // const username = uname;
    // return this.#users[username] && this.#users[username].password === password;
  }

  toJson() {
    return JSON.stringify(this.#users);
  }
}

module.exports = { Users };
