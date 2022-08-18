class Poller {
  #request;
  #oldData;
  #interval;
  #intervalId;
  #initializer;

  constructor(request, initializer, interval = 1000) {
    this.#request = request;
    this.#initializer = initializer;
    this.#interval = interval;
  }

  pause() {
    clearInterval(this.#intervalId);
  }

  resume() {
    this.#startPolling();
  }

  #startPolling() {
    this.#intervalId = setInterval(() => {
      this.#request()
        .then(res => res.text())
        .then((res) => this.#handleData(res));
    }, this.#interval);
  }

  #handleData(res) {
    if (res === this.#oldData) {
      return;
    }
    this.#oldData = res;
    const newData = JSON.parse(res);

    this.#initializer(newData);
  }
}
