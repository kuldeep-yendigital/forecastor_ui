export class FakeBindingEngine {
  subscribe() {}

  propertyObserver() {
    return {
      subscribe() {}
    }
  }
}
