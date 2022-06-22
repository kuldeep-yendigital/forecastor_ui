import {ActiveFilterStore} from './activeFilterStore';
import {QueryStore} from './queryStore';
import {TaxonomyStore} from './taxonomyStore';
import {Container} from 'aurelia-dependency-injection';
import {BindingEngine} from 'aurelia-framework';
import {FakeBindingEngine, FakeEventAggregator} from '../../test/unit/helpers/fakes';
import {EventAggregator} from 'aurelia-event-aggregator';
import {GenericService} from '../services/genericService';
import * as GLOBAL_EVENTS from '../events';

describe('Active Filter Store', () => {

  // TODO: See if this can use the hash state store.
  let container;

  beforeEach(() => {
    const fakeQueryStore = {
      data: {
        filters: {},
        compositeFilters: {}
      }
    };
    const fakeTaxonomyStore = {
      data: {
        dimensions: []
      }
    };
    container = new Container().makeGlobal();
    container.registerInstance(QueryStore, fakeQueryStore);
    container.registerInstance(TaxonomyStore, fakeTaxonomyStore);
    container.registerInstance(GenericService, {});
    container.registerInstance(BindingEngine, new FakeBindingEngine());
    container.registerInstance(EventAggregator, new FakeEventAggregator());
    container.get(ActiveFilterStore);
  });

  it('maintains a hierarchical list of active filters', () => {
    const taxonomyStore = container.get(TaxonomyStore);
    const activeFilterStore = container.get(ActiveFilterStore);
    taxonomyStore.data = {
      dimensions: [
        { key: 'metric', name: 'Metric', children: [
          { name: 'Subscriptions', state: 1, children: [] },
          { name: 'Call Revenues', state: 0, children: [] },
          { name: 'CAPEX', state: 0, children: [] }
        ] }
      ]
    };
    activeFilterStore.onStoreChange(taxonomyStore.data, TaxonomyStore);
    expect(activeFilterStore.data.hierarchy).toEqual([
      { key: 'metric', name: 'Metric', children: [
        { name: 'Subscriptions', state: 1, children: [] }
      ] }
    ]);
  });

  it('triggers loading taxonomy for dimensions that have filters', () => {
    const eventAggregator = container.get(EventAggregator);
    const queryStore = container.get(QueryStore);
    const activeFilterStore = container.get(ActiveFilterStore);
    queryStore.data = {
      filters: {},
      compositeFilters: {
        metric: ['Subscriptions']
      }
    };
    spyOn(eventAggregator, 'publish');
    activeFilterStore.onStoreChange(queryStore.data, QueryStore);
    expect(eventAggregator.publish).toHaveBeenCalledWith(GLOBAL_EVENTS.BATCH_FETCH_TAXONOMY_DATA, ['metric']);
  });

  it('works with complex hierarchy', () => {
    const taxonomyStore = container.get(TaxonomyStore);
    const activeFilterStore = container.get(ActiveFilterStore);
    taxonomyStore.data = {
      dimensions: [
        { key: 'technology', name: 'Technology', children: [
          { name: 'All Technologies Total', state: 1, children: [] },
          { name: 'No Specific Technology', state: 0, children: [] },
          { name: 'Wireless', state: 0, children: [
            { name: 'Cellular', state: 2, children: [
              { name: '1G', state: 0, children: [] },
              { name: '2G', state: 0, children: [] },
              { name: '3G', state: 1, children: [
                { name: '1xEV-DO', state: 0, children: [] },
                { name: 'TD-SCDMA', state: 0, children: [] },
                { name: 'W-CDMA', state: 1, children: [] }
              ] },
              { name: '4G', state: 1, children: [
                { name: 'LTE', state: 1, children: [] }
              ] },
              { name: '5G', state: 1, children: [
                { name: 'TBA-5G', state: 1, children: [] }
              ] }
            ] },
            { name: 'Wireless Total', state: 0, children: [] }
          ] }
        ] }
      ]
    };
    activeFilterStore.onStoreChange(taxonomyStore.data, TaxonomyStore);
    expect(activeFilterStore.data.hierarchy).toEqual([
      { key: 'technology', name: 'Technology', children: [
        { name: 'All Technologies Total', state: 1, children: [] },
        { name: 'Wireless', state: 0, children: [
          { name: 'Cellular', state: 2, children: [
            { name: '3G', state: 1, children: [
              { name: 'W-CDMA', state: 1, children: [] }
            ] },
            { name: '4G', state: 1, children: [
              { name: 'LTE', state: 1, children: [] }
            ] },
            { name: '5G', state: 1, children: [
              { name: 'TBA-5G', state: 1, children: [] }
            ] }
          ] }
        ] }
      ] }
    ]);
  });

  it('returns filters to be removed', () => {

  });
});
