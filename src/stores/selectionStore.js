import Store from './store';
import {DataStore} from './dataStore';
import {QueryStore} from './queryStore';
import {AnalyticsService} from '../services/analyticsService';
import includes from 'lodash/includes';

export const EVENTS = {
  CLEAR_SELECTION: 'clear_selection',
  TOGGLE_SELECTION: 'toggle_selection',
  SELECT_ALL: 'all_selected',
};

export const ANALYTICS = AnalyticsService.register({
  SELECTION_TOGGLED: 'selection_toggled',
  SELECTION_CLEARED: 'selection_cleared',
  SELECTION_ALL: 'selection_all'
});

/**
 * The selection store holds the state for the grid row selection.
 * The selection is stored as an array of record keys. The record
 * keys are the unique combination of dimension values for the row.
 * The records keys will be used in queries to get updates for
 * only these records by providing the records keys as a filter:
 *
 * WHERE
 *   (key1 = value1a AND key2 = value2a ...) OR
 *   (key1 = value1b AND key2 = value2b ...) ...
 *
 * This will be used to form the graph only query for the dashboard
 * which enables refreshing records that have been selected from
 * multiple pages of query results and reducing the data required
 * from the API to produce a graph for example or a table of selected
 * records.
 */
export class SelectionStore extends Store {

  get STORES() {
    return [QueryStore];
  }

  get EVENTS() {
    return Object.values(EVENTS);
  }

  static inject() {
    return [DataStore, AnalyticsService];
  }

  constructor(dataStore, analyticsService, ...rest) {
    super(...rest);
    this.dataStore = dataStore;
    this.analyticsService = analyticsService;
  }

  getDefaultState() {
    return {
      selected: [],
      records: []
    };
  }

  selectAll() {
    const records = (this.dataStore.data && this.dataStore.data.records || []);
    const selected = records.map(record => record.key);
    this.data = {
      ...this.data,
      selected,
      records
    };
    this.analyticsService.pushEvent(ANALYTICS.SELECTION_ALL, { count: this.data.selected.length });
  }

  clearSelection() {
    this.data = {
      ...this.data,
      selected: [],
      records: []
    };
    this.analyticsService.pushEvent(ANALYTICS.SELECTION_CLEARED, { count: this.data.selected.length });
  }

  toggleSelection(keys) {
    const source = (this.dataStore.data && this.dataStore.data.records || []);
    const unselect = keys.filter(key => includes(this.data.selected, key));
    const select = keys.filter(key => !includes(unselect, key));
    const selected = this.data.selected.filter(selected => !includes(unselect, selected)).concat(select);
    const records = source.filter(record => includes(selected, record.key));
    const found = records.map(record => record.key);
    const missing = selected.filter(key => !includes(found, key));
    this.data = {
      ...this.data,
      selected,
      records
    };
    this.analyticsService.pushEvent(ANALYTICS.SELECTION_TOGGLED, { count: this.data.selected.length });
  }

  onEvent(data, event) {
    switch (event) {
      case EVENTS.SELECT_ALL:
        this.selectAll();
        break;
      case EVENTS.CLEAR_SELECTION:
        this.clearSelection();
        break;
      case EVENTS.TOGGLE_SELECTION:
        this.toggleSelection(data);
        break;
    }
  }

  onStoreChange(data, store) {
    switch (store) {
      case QueryStore:
        this.clearSelection();
        break;
    }
  }
}
