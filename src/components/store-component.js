export class StoreComponent {
  constructor(stores, eventAggregator) {
    this.stores = Array.isArray(stores) ? stores : [stores];
    this.eventAggregator = eventAggregator;

    this.data = {};
    this.subscriptions = [];
    this.onDataUpdate = this.onDataUpdate.bind(this);
    this.stores.forEach(s => this.onDataUpdate(s)());
  }

  attached() {
    this.subscriptions = this.stores.map(store => store.subscribe(this.onDataUpdate(store)));
  }

  onDataUpdate(store) {
    return () => this.data[store.name()] = store.data;
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
  }

  publish(event, data) {
    this.eventAggregator.publish(event, data);
  }

  subscribe(event, fn) {
    this.subscriptions.push(this.eventAggregator.subscribe(event, fn));
  }
}
