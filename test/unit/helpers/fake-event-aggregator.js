export class FakeEventAggregator {
  constructor() {
    this.data = {};
  }

  publish(event, payload) {
    this.data[event] = payload;
  }

  subscribe(event, fn) {
    return { dispose() {} };
  }

  event(name) {
    return this.data[name];
  }
}
