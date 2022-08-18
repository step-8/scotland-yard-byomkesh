const session = require('express-session');
const Store = session.Store;

class SessionStore extends Store {
  constructor(session, writeSession) {
    super();
    this.session = session;
    this.writeSession = writeSession;
  }

  destroy(sid, callback = () => { }) {
    delete this.session[sid];
    this.writeSession(this.session)
      .then(() => callback(null))
      .catch(err => callback(err));
  }

  get(sid, callback) {
    const value = this.session[sid];
    callback(null, value);
  }

  set(sid, session, callback) {
    this.session[sid] = session;
    this.writeSession(this.session)
      .then(() => callback(null))
      .catch(err => callback(err));
  }
}

module.exports = { SessionStore };
