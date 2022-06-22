import {EventAggregator} from 'aurelia-event-aggregator';
import {GenericService} from '../services/genericService';
import {BindingEngine} from 'aurelia-framework';
import {Container} from 'aurelia-dependency-injection';
import cloneDeep from 'lodash/cloneDeep';

export default class Store {

  static inject() {
    return [BindingEngine, EventAggregator, GenericService];
  }

  get EVENTS() {
    return [];
  }

  get STORES() {
    return [];
  }

  constructor(BindingEngine, EventAggregator, GenericService) {
    this.initialise();
    this.stores = {};
    this.eventAggregator = EventAggregator;
    this.bindingEngine = BindingEngine;
    this.service = GenericService;
    this.register();
    this.data = this.getDefaultState();
  }

  initialise() {}

  getDefaultState() {
    console.error('You must override store.getDefaultState method');
  }

  name() {
    console.error('You must override store.name to use StoreComponent');
  }

  publish(event, data) {
    this.eventAggregator.publish(event, data);
  }

  subscribe(fn) {
    return this.bindingEngine.propertyObserver(this, 'data').subscribe(fn);
  }

  refresh(data = this.data) {
    this.data = { ...this.data, ...data };
  }

  register() {
    this.subscriptions = [];

    this.EVENTS.forEach(event => {
      this.subscriptions.push(this.eventAggregator.subscribe(event, this.onEvent.bind(this)));
    });

    let container = Container.instance;

    this.STORES.forEach(store => {
      this.stores[store.name] = container.get(store);
      this.subscriptions.push(this.bindingEngine.propertyObserver(this.stores[store.name], 'data').subscribe((data => {
        this.onStoreChange.call(this, data, store);
      })))
    });
  }

  onEvent(data, event) {
    console.error('You must override store.onEvent method');
  }

  onStoreChange(data, store) {
    console.error('You must override store.onStoreChange method');
  }

}
