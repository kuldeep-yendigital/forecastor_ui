export class FakeExportStore {
  subscribe() {
    return {
      dispose: () => {}
    };
  }

  publish() {

  }

  name() {
    return "export";
  }

  export() {

  }

  onMessage() {

  }

  getDefaultState() {
    return {};
  }

  onEvent(data, event) {}
}
