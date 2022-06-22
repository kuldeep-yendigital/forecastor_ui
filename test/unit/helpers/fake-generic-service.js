export class FakeGenericService {
  constructor(data = {}) {
    this.data = data;
  }

  fetch (path) {
    return Promise.resolve(this.data);
  }

  setData(data) {
    this.data = data;
  }

  fetchFrom(api, url) {
    return Promise.resolve(this.data);
  }
}
