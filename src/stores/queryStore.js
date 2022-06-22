import Store from './store';
import * as GLOBAL_EVENTS from '../events';
import { TimeframeStore } from './timeframeStore';
import { ColumnStore } from './columnStore';
import { AnalyticsService } from '../services/analyticsService';
import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
import has from 'lodash/has';

import {HashStateStore} from './hashStateStore';

function isDate(string) {
  return string.match(/^\d{2}\/\d{2}\/\d{4}$/) !== null;
}

const addFilters = (target, source) => {
  source.forEach(filter => {
    if (!target[filter.type]) {
      target[filter.type] = [];
    }

    const index = target[filter.type].indexOf(filter.name);
    if (index === -1) {
      target[filter.type].push(filter.name);
    }
  });
};

const removeFilters = (target, source) => {
  source.forEach(filter => {

    if(!target[filter.type]) {
      return ;
    }
    const index = target[filter.type].indexOf(filter.name);
    if (index !== -1) {
      target[filter.type].splice(index, 1);
    }

    if(target[filter.type].length === 0) {
      delete target[filter.type];
    }
  });
};

export const ANALYTICS = AnalyticsService.register({
  FILTERS_ADDED: GLOBAL_EVENTS.FILTERS_ADDED,
  FILTERS_REMOVED: GLOBAL_EVENTS.FILTERS_REMOVED,
  COMPOSITE_FILTERS_ADDED: GLOBAL_EVENTS.COMPOSITE_FILTERS_ADDED,
  COMPOSITE_FILTERS_REMOVED: GLOBAL_EVENTS.COMPOSITE_FILTERS_REMOVED,
  COLUMN_SORTED: GLOBAL_EVENTS.COLUMN_SORTED
});

export class QueryStore extends Store {

  static inject() {
    return [AnalyticsService].concat(super.inject());
  }

  get EVENTS() {
    return [
      GLOBAL_EVENTS.FILTERS_ADDED,
      GLOBAL_EVENTS.FILTERS_REMOVED,
      GLOBAL_EVENTS.COMPOSITE_FILTERS_ADDED,
      GLOBAL_EVENTS.COMPOSITE_FILTERS_REMOVED,
      GLOBAL_EVENTS.BATCH_FILTERING_ADDED,
      GLOBAL_EVENTS.BATCH_FILTERING_REMOVED,
      GLOBAL_EVENTS.COLUMN_SORTED,
      GLOBAL_EVENTS.QUERY_UPDATED,
      GLOBAL_EVENTS.ADD_VALUE_FIELD,
      GLOBAL_EVENTS.COLUMN_FILTERS_ADDED,
      GLOBAL_EVENTS.COLUMN_FILTERS_REMOVED
    ];
  }

  get STORES() {
    return [
      HashStateStore,
      TimeframeStore,
      ColumnStore
    ];
  }

  constructor(analyticsService, ...rest) {
    super(...rest);
    this.analyticsService = analyticsService;
  }

  getDefaultState() {
    if (!this.defaultQuery) {
      this.defaultQuery = {
        filters: {},
        compositeFilters: {
          metricindicator: ['Total']
        },
        range: {
          start: this.stores.TimeframeStore.data.start,
          end: this.stores.TimeframeStore.data.end,
          interval: this.stores.TimeframeStore.data.interval
        },
        sortedColumnId: this.stores.ColumnStore.getLeftMostColumn().key,
        sortDirection: 'asc',
        columnKeys: this.getColumnKeys(),
        valueField: undefined,
        columnFilters: {}
      };
    }
    const hashState = this.stores.HashStateStore.data;
    if (hashState.query) {
      return hashState.query;
    } else {
      return cloneDeep(this.defaultQuery);
    }
  }

  name() {
    return 'query';
  }

  getColumnKeys() {
    return this.stores.ColumnStore.getColumns().map(c => c.key);
  }

  getSelectedMetricCount() {
    return this.data.compositeFilters && this.data.compositeFilters.metric ?
      this.data.compositeFilters.metric.length : 0;
  }

  validateDimensionSort() {
    const currentSortColumn = this.stores.ColumnStore.getColumnByKey(this.data.sortedColumnId);
    if(currentSortColumn.checked !== true) {
      const leftMostColumn = this.stores.ColumnStore.getLeftMostColumn();
      this.data.sortedColumnId = leftMostColumn.key;
      this.data.sortDirection = 'asc';
    }
  }

  resetSort() {
    const leftMostColumn = this.stores.ColumnStore.getLeftMostColumn();
    this.data.sortedColumnId = leftMostColumn.key;
    this.data.sortDirection = 'asc';
  }

  validateNumericalSort() {
    if((this.data.range.interval !== this.stores.TimeframeStore.data.interval) 
      || (this.data.compositeFilters && this.data.compositeFilters.metric && this.data.compositeFilters.metric.length > 1)) {
      this.resetSort();
    }
    else {
      const timeframe = this.stores.TimeframeStore.data;
      const colSplit = this.data.sortedColumnId.split('/');
      const currentSortAsDate = Date.UTC(colSplit[2], colSplit[1], colSplit[0]);

      if((timeframe.start > currentSortAsDate) || (timeframe.end < currentSortAsDate)) {
        this.resetSort();
      }
    }

  }

  validateSortField() {
    if(isDate(this.data.sortedColumnId)) {
      this.validateNumericalSort();
    }
    else {
      this.validateDimensionSort();
    }
  }

  updateColumns(data) {
    data.columns = data.columns.filter(c => c !== undefined);
    this.validateSortField(data.columns);
    this.data.columnKeys = this.getColumnKeys();
    this.data = cloneDeep(this.data);
  }

  addValueField(name) {
    this.data.valueField = name;
    this.data = cloneDeep(this.data);
  }

  addFilters(filters, newFilters) {
    addFilters(filters, newFilters);
    this.data = cloneDeep(this.data);
    this.validateSortField();
  }

  removeFilters(filters, newFilters) {
    removeFilters(filters, newFilters);
    this.data = cloneDeep(this.data);
    this.validateSortField();
  }

  // TODO: These batch filtering actions can be removed when all filters are composite
  batchAddFiltering(filtering, newFiltering) {
    addFilters(filtering.filters, newFiltering.filters);
    addFilters(filtering.compositeFilters, newFiltering.compositeFilters);
    this.data = cloneDeep(this.data);
    this.validateSortField();
  }

  // TODO: These batch filtering actions can be removed when all filters are composite
  batchRemoveFiltering(filtering, newFiltering) {
    removeFilters(filtering.filters, newFiltering.filters);
    removeFilters(filtering.compositeFilters, newFiltering.compositeFilters);
    this.data = cloneDeep(this.data);
    this.validateSortField();
  }

  updateTimeframe(newTimeFrame) {
    this.validateSortField();
    this.data = {
      ...this.data,
      range: {
        interval: newTimeFrame.interval,
        start: newTimeFrame.start,
        end: newTimeFrame.end
      }
    };
  }

  updateSort(column) {
    const query = this.data;
    delete query.sortedColumnId;
    delete query.sortDirection;

    if (column.sortState) {
      query.sortedColumnId = column.columnId;
      query.sortDirection = column.sortState;
    }

    this.data = cloneDeep(query);
  }

  updateQuery(query) {
    this.data = query;
  }

  columnFiltersAdded(data) {
    const query = this.data;
    if (!has(query.columnFilters, data.column)) {
      query.columnFilters[data.column] = [ data.item.name ];
    }
    else {
      if(query.columnFilters[data.column].indexOf(data.item.name) === -1) {
        query.columnFilters[data.column].push(data.item.name);
      }
    }
    this.data = cloneDeep(query);
  }

  columnFiltersRemoved(data) {
    const query = this.data;
    if(has(query.columnFilters, `${data.column}`) && query.columnFilters[data.column].indexOf(data.item.name) > -1) {
      query.columnFilters[data.column] = query.columnFilters[data.column].filter(arrItem => arrItem !== data.item.name);
      if (query.columnFilters[data.column].length === 0) {
        delete query.columnFilters[data.column];
      }
      this.data = cloneDeep(query);
    }
  }

  onEvent(data, event) {
    switch (event) {
    case GLOBAL_EVENTS.FILTERS_ADDED:
      this.addFilters(this.data.filters, data);
      // TODO: Unroll filters
      this.analyticsService.pushEvent(ANALYTICS.FILTERS_ADDED, {
        filterType: uniq(data.map(item => item.type)).join(' + '),
        filterName: data.map(item => item.name).join(' + ')
      });
      break;
    case GLOBAL_EVENTS.FILTERS_REMOVED:
      this.removeFilters(this.data.filters, data);
      // TODO: Unroll filters
      this.analyticsService.pushEvent(ANALYTICS.FILTERS_REMOVED, {
        filterType: uniq(data.map(item => item.type)).join(' + '),
        filterName: data.map(item => item.name).join(' + ')
      });
      break;
    case GLOBAL_EVENTS.COMPOSITE_FILTERS_ADDED:
      this.addFilters(this.data.compositeFilters, data);
      // TODO: Unroll filters
      this.analyticsService.pushEvent(ANALYTICS.COMPOSITE_FILTERS_ADDED, {
        filterType: uniq(data.map(item => item.type)).join(' + '),
        filterName: data.map(item => item.name).join(' + ')
      });
      break;
    case GLOBAL_EVENTS.COMPOSITE_FILTERS_REMOVED:
      this.removeFilters(this.data.compositeFilters, data);
      // TODO: Unroll filters
      this.analyticsService.pushEvent(ANALYTICS.COMPOSITE_FILTERS_REMOVED, {
        filterType: uniq(data.map(item => item.type)).join(' + '),
        filterName: data.map(item => item.name).join(' + ')
      });
      break;
    case GLOBAL_EVENTS.BATCH_FILTERING_ADDED:
      this.batchAddFiltering(this.data, data);
      break;
    case GLOBAL_EVENTS.BATCH_FILTERING_REMOVED:
      this.batchRemoveFiltering(this.data, data);
      break;
    case GLOBAL_EVENTS.COLUMN_SORTED:
      this.updateSort(data);
      this.analyticsService.pushEvent(ANALYTICS.COLUMN_SORTED, {
        columnId: data.columnId,
        sortState: data.sortState
      });
      break;
    case GLOBAL_EVENTS.QUERY_UPDATED:
      this.updateQuery(data);
      break;
    case GLOBAL_EVENTS.ADD_VALUE_FIELD:
      this.addValueField(data);
      break;
    case GLOBAL_EVENTS.COLUMN_FILTERS_ADDED:
      this.columnFiltersAdded(data);
      break;
    case GLOBAL_EVENTS.COLUMN_FILTERS_REMOVED:
      this.columnFiltersRemoved(data);
      break;
    }
  }

  onStoreChange(data, store) {
    switch (store) {
    case TimeframeStore:
      this.updateTimeframe(data);
      break;
    case ColumnStore:
      this.updateColumns(data);
      break;
    case HashStateStore:
      this.data = this.getDefaultState();
      break;
    }
  }
}
