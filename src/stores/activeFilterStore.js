import {QueryStore} from './queryStore';
import {TaxonomyStore} from './taxonomyStore';
import Store from './store';
import {STATES} from '../components/panels/multi-list-panel';
import includes from 'lodash/includes';
import * as GLOBAL_EVENTS from '../events';

export const EVENTS = {
  APPLY_FILTER_CHANGES: 'active_filter_apply_filter_changes',
  CANCEL_FILTER_CHANGES: 'active_filter_cancel_filter_changes'
};

const getActiveFilters = dimensions => {
  const inner = (acc, item) => {
    const activeChildren = item.children.reduce(inner, []);
    if (activeChildren.length || (!item.children.length && item.state === STATES.CHECKED)) {
      return acc.concat([ {
        ...item,
        children: activeChildren
      } ]);
    } else {
      return acc;
    }
  };
  return dimensions.filter(dimension => !dimension.timeframe)
    .reduce(inner, []);
};

const dimensionFiltersToFilterArray = filters =>
  filters.reduce((acc, { type, names }) => {
    return acc.concat(names.map(name => ({ type, name })));
  }, []);

export class ActiveFilterStore extends Store {

  get STORES() {
    return [QueryStore, TaxonomyStore];
  }

  constructor(...args) {
    super(...args);
    this.loadActiveDimensionTaxonomy();
  }

  getDefaultState() {
    return {};
  }

  loadActiveDimensionTaxonomy() {
    const storeData = this.stores.QueryStore.data;
    const filters = storeData.filters;
    const compositeFilters = storeData.compositeFilters;
    const allFilters = Object.keys(compositeFilters).concat(Object.keys(filters));
    this.eventAggregator.publish(GLOBAL_EVENTS.BATCH_FETCH_TAXONOMY_DATA, allFilters);
  }

  updateState() {
    this.data = {
      filters: this.stores.QueryStore.data.filters,
      compositeFilters: this.stores.QueryStore.data.compositeFilters,
      hierarchy: getActiveFilters(this.stores.TaxonomyStore.data.dimensions)
    };
  }

  removeFilters(filters) {

    const dimensionFilters = this.stores.TaxonomyStore.data.dimensions
      .filter(dimension => !dimension.composite)
      .map(dimension => dimension.key);

    const data = {
      filters: dimensionFiltersToFilterArray(filters
        .filter(filter => includes(dimensionFilters, filter.type))),
      compositeFilters: dimensionFiltersToFilterArray(filters
        .filter(filter => !includes(dimensionFilters, filter.type)))
    };

    this.eventAggregator.publish(GLOBAL_EVENTS.BATCH_FILTERING_REMOVED, data);
  }

  onStoreChange(data, store) {
    switch (store) {
    case TaxonomyStore:
      this.updateState();
      break;
    case QueryStore:
      this.loadActiveDimensionTaxonomy();
      this.updateState();
      break;
    }
  }

}
