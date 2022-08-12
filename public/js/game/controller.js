class Poller {
  #url;
  #reqDetails;
  #observers;
  #oldData;

  constructor(url, reqDetails) {
    this.#reqDetails = reqDetails;
    this.#url = url;
    this.#observers = [];
  }

  #handleData(res) {
    if (res === this.#oldData) {
      return;
    }
    this.#oldData = res;
    const newData = JSON.parse(res);
    gameState.initialize(newData);
    this.#emit();
  }

  startPolling() {
    const intervalId = setInterval(() => {
      fetch(this.#url, this.#reqDetails)
        .then(res => res.text())
        .then((res) => this.#handleData(res));
    }, 1000);
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #emit() {
    this.#observers.forEach(observer => observer());
  }
}
