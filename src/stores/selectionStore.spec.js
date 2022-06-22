import {Container} from 'aurelia-dependency-injection';
import {BindingEngine} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {SelectionStore} from "./selectionStore";
import {DataStore} from "./dataStore";
import {QueryStore} from "./queryStore";
import {FakeBindingEngine} from "../../test/unit/helpers/fake-binding-engine";
import {FakeEventAggregator} from "../../test/unit/helpers/fake-event-aggregator";
import {EVENTS as SELECTION_EVENTS} from './selectionStore';

describe('Selection Store', () => {

  const WESTERN_EUROPE_GREECE_FIXED_OPERATOR_SERVICES_SUBSCRIPTION_TOTAL_ABSOLUTE = {
    key: 'western europe_greece_fixed operator services_subscriptions__total__absolute'
  };
  const WESTERN_EUROPE_FRANCE_OTT_SERVICES_SUBSCRIPTION_TOTAL_ABSOLUTE = {
    key: 'western europe_france_ott services_subscriptions__total__absolute'
  };
  const WESTERN_EUROPE_GREECE_TV_SERVICES_SUBSCRIPTIONS_TOTAL_ABSOLUTE = {
    key: 'western europe_greece_tv services_subscriptions__total__absolute'
  };
  const WESTERN_EUROPE_GREENLAND_MOBILE_M2M_SUBSCRIPTION_SUBSCRIPTIONS_TOTAL_ABSOLUTE = {
    key: 'western europe_greenland_mobile m2m subscriptions_subscriptions__total__absolute'
  };
  const WESTERN_EUROPE_OTT_SERVICES_SUBSCRIPTION_TOTAL_ABSOLUTE = {
    key: 'western europe_greenland_ott services_subscriptions__total__absolute'
  };
  let container;

  beforeEach(() => {
    container = new Container().makeGlobal();
    container.registerInstance(DataStore, {
      data: {
        records: [
          WESTERN_EUROPE_GREECE_FIXED_OPERATOR_SERVICES_SUBSCRIPTION_TOTAL_ABSOLUTE,
          WESTERN_EUROPE_FRANCE_OTT_SERVICES_SUBSCRIPTION_TOTAL_ABSOLUTE,
          WESTERN_EUROPE_GREECE_TV_SERVICES_SUBSCRIPTIONS_TOTAL_ABSOLUTE,
          WESTERN_EUROPE_GREENLAND_MOBILE_M2M_SUBSCRIPTION_SUBSCRIPTIONS_TOTAL_ABSOLUTE
        ]
      }
    });
    container.registerInstance(QueryStore, {});
    container.registerInstance(BindingEngine, new FakeBindingEngine());
    container.registerInstance(EventAggregator, new FakeEventAggregator());
    container.registerSingleton(SelectionStore);
  });

  describe('Selection', () => {
    it('has no selection by default', () => {
      const store = container.get(SelectionStore);
      expect(store.data.selected).toEqual([]);
    });

    it('listens out for add, remove and clear selection', () => {
      const fakeEventAggregator = container.get(EventAggregator);
      spyOn(fakeEventAggregator, 'subscribe');
      container.get(SelectionStore);
      expect(fakeEventAggregator.subscribe).toHaveBeenCalledWith(SELECTION_EVENTS.TOGGLE_SELECTION, jasmine.any(Function));
      expect(fakeEventAggregator.subscribe).toHaveBeenCalledWith(SELECTION_EVENTS.SELECT_ALL, jasmine.any(Function));
      expect(fakeEventAggregator.subscribe).toHaveBeenCalledWith(SELECTION_EVENTS.CLEAR_SELECTION, jasmine.any(Function));
    });

    it('listens out for data changes in query store', () => {
      const fakeBindingEngine = container.get(BindingEngine);
      spyOn(fakeBindingEngine, 'propertyObserver').and.returnValue({
        subscribe: () => {}
      });
      const store = container.get(SelectionStore);
      expect(fakeBindingEngine.propertyObserver).toHaveBeenCalledWith(store.stores.QueryStore, 'data');
    });

    it('adds a key to the selection', () => {
      const store = container.get(SelectionStore);
      // TODO: Replace this with dimension hash when available
      store.onEvent(['western europe_greece_fixed operator services_subscriptions__total__absolute'], SELECTION_EVENTS.TOGGLE_SELECTION);
      expect(store.data.selected).toEqual([
        'western europe_greece_fixed operator services_subscriptions__total__absolute'
      ]);
    });

    it('removes a key from the selection', () => {
      const store = container.get(SelectionStore);
      store.onEvent(['western europe_greece_fixed operator services_subscriptions__total__absolute'], SELECTION_EVENTS.TOGGLE_SELECTION);
      store.onEvent(['western europe_greece_fixed operator services_subscriptions__total__absolute'], SELECTION_EVENTS.TOGGLE_SELECTION);
      expect(store.data.selected).toEqual([]);
    });

    it('clears the selection', () => {
      const store = container.get(SelectionStore);
      store.onEvent(['western europe_greece_fixed operator services_subscriptions__total__absolute'], SELECTION_EVENTS.TOGGLE_SELECTION);
      store.onEvent(null, SELECTION_EVENTS.CLEAR_SELECTION);
      expect(store.data.selected).toEqual([]);
    });

    it('adds multiple keys to the selection', () => {
      const store = container.get(SelectionStore);
      // TODO: Replace this with dimension hash when available
      store.onEvent([
        'western europe_greece_fixed operator services_subscriptions__total__absolute'
      ], SELECTION_EVENTS.TOGGLE_SELECTION);
      store.onEvent([
        'western europe_france_ott services_subscriptions__total__absolute',
        'western europe_greece_tv services_subscriptions__total__absolute',
        'western europe_greenland_mobile m2m subscriptions_subscriptions__total__absolute'
      ], SELECTION_EVENTS.TOGGLE_SELECTION);
      expect(store.data.selected).toEqual([
        'western europe_greece_fixed operator services_subscriptions__total__absolute',
        'western europe_france_ott services_subscriptions__total__absolute',
        'western europe_greece_tv services_subscriptions__total__absolute',
        'western europe_greenland_mobile m2m subscriptions_subscriptions__total__absolute'
      ]);
    });

    it('clears the selection in response to QueryStore changes', () => {
      const store = container.get(SelectionStore);
      store.onEvent(['western europe_greece_fixed operator services_subscriptions__total__absolute'], SELECTION_EVENTS.TOGGLE_SELECTION);
      store.onStoreChange({}, QueryStore);
      expect(store.data.selected).toEqual([]);
    });
  });

  describe('Data', () => {
    it('has no records by default', () => {
      const store = container.get(SelectionStore);
      expect(store.data.records).toEqual([]);
    });

    it('collects the records from the DataStore that match the selection on add', () => {
      const store = container.get(SelectionStore);
      store.toggleSelection([
        'western europe_france_ott services_subscriptions__total__absolute'
      ]);
      expect(store.data.records[0]).toBe(WESTERN_EUROPE_FRANCE_OTT_SERVICES_SUBSCRIPTION_TOTAL_ABSOLUTE);
    });

    // TODO: Complete me when I have an API to use
    xit('fetches the records that are not present in the DataStore on add', () => {
      const store = container.get(SelectionStore);
      store.toggleSelection([
        'western europe_france_ott services_subscriptions__total__absolute',
        'western europe_greenland_ott services_subscriptions__total__absolute'
      ]);
      // TODO: fetch records with query from query store and specific keys:
      // western europe_greenland_mobile m2m subscriptions_subscriptions__total__absolute
      expect(store.data.records[0]).toBe(WESTERN_EUROPE_FRANCE_OTT_SERVICES_SUBSCRIPTION_TOTAL_ABSOLUTE);
      expect(store.data.records[1]).toBe(WESTERN_EUROPE_GREENLAND_OTT_SERVICES_SUBSCRIPTION_TOTAL_ABSOLUTE);
    });

    // remove key removes associated data
    it('removes the data associated with removed selections', () => {
      const dataStore = container.get(DataStore);
      const store = container.get(SelectionStore);
      store.toggleSelection([
        'western europe_france_ott services_subscriptions__total__absolute',
        'western europe_greece_fixed operator services_subscriptions__total__absolute'
      ]);
      store.toggleSelection([
        'western europe_france_ott services_subscriptions__total__absolute'
      ]);
      expect(store.data.records[0]).toBe(WESTERN_EUROPE_GREECE_FIXED_OPERATOR_SERVICES_SUBSCRIPTION_TOTAL_ABSOLUTE);
    });
    // TODO: initial load with selection fetches data from store / service
  });

});
