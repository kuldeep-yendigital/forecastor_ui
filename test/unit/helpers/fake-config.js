export class FakeConfig {
  constructor() {
    this.config = {};
  }

  set(key, value) { this.config[key] = value; return this; }
  get(key) { return this.config[key]; }
}
