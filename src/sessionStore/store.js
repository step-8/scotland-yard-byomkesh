const session = require('express-session');
const Store = session.Store;

class SessionStore extends Store {
  #datastore;
  constructor(datastore) {
    super();
    this.#datastore = datastore;
  }

  destroy(sid, callback = () => { }) {
    this.#datastore.delete(sid)
      .then(() => callback(null))
      .catch(callback);
  }

  get(sid, callback = () => { }) {

    this.#datastore
      .get(sid)
      .then(val => callback(null, JSON.parse(val)))
      .catch(callback);
  }

  set(sid, session, callback = () => { }) {
    this.#datastore
      .set(sid, JSON.stringify(session))
      .then(() => callback(null))
      .catch(callback);
  }
}

module.exports = { SessionStore };
