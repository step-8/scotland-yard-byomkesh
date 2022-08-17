const EventEmitter = require('events');
const session = require('express-session');
const store = session.Store;

class SessionStore extends store {
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