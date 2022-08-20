class Datastore {
  constructor(storeName, client) {
    this.storeName = storeName;
    this.client = client;
  }

  get(key) {
    return this.client.hGet(this.storeName, key);
  }

  set(key, value) {
    return this.client.hSet(this.storeName, key, value);
  }

  delete(key) {
    return this.client.hDel(this.storeName, key);
  }

  getAll() {
    return this.client.hGetAll(this.storeName);
  }
}

module.exports = Datastore;