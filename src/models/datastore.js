const rejectNull = () => new Promise((resolve, reject) => {
  reject(new Error('Key can not be null'));
});

class Datastore {
  constructor(storeName, client) {
    this.storeName = storeName;
    this.client = client;
  }

  get(key) {
    if (key) {
      return this.client.hGet(this.storeName, `${key}`);
    }
    return rejectNull();
  }

  set(key, value) {
    return this.client.hSet(this.storeName, `${key}`, value);
  }

  delete(key) {
    if (key) {
      return this.client.hDel(this.storeName, `${key}`);
    }
    return rejectNull();
  }

  getAll() {
    return this.client.hGetAll(this.storeName);
  }
}

module.exports = Datastore;
