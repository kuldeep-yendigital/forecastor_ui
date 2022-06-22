import Store from './store';
import { QueryStore } from './queryStore';
import { SelectionStore } from './selectionStore';
import flow from 'lodash/flow';

export const EVENTS = {
  CHANGE_GRAPH_TYPE: 'graphs_change_type'
};

const updateTimestamp = data => ({
  ...data,
  timestamp: Date.now()
});

const updateSelection = (selection, records) => data => ({
  ...data,
  selection,
  records
});

const updateQuery = query => data => ({
  ...data,
  query
});

const clearSelection = updateSelection([], []);

export class GraphStore extends Store {

  get EVENTS() {
    return [
      EVENTS.CHANGE_GRAPH_TYPE
    ]
  }

  get STORES() {
    return [
      QueryStore,
      SelectionStore
    ];
  }

  getDefaultState() {
    return {
      // Default to line graph
      type: 'line',
      // Blank query
      query: {},
      // Empty selection
      selection: [],
      // No cached rows
      records: [],
      // Default to current timestamp
      timestamp: Date.now()
    };
  }

  changeGraphType(type) {
    switch (type) {
      case 'bar':
      case 'marker':
      case 'line':
        this.data = { ...this.data, type };
        break;
      default:
        throw new Error('unknown graph type ' + type);
        break;
    }
  }

  updateQuery(query) {
    this.data = flow([
      updateQuery(query),
      clearSelection,
      updateTimestamp
    ])(this.data);
  }

  updateSelection(data) {
    this.data = flow([
      updateSelection(data.selected, data.records),
      updateTimestamp
    ])(this.data);
  }

  onEvent(data, event) {
    switch (event) {
      case EVENTS.CHANGE_GRAPH_TYPE:
        this.changeGraphType(data);
        break;
    }
  }

  onStoreChange(data, store) {
    switch (store) {
      case QueryStore:
        this.updateQuery(data);
        break;
      case SelectionStore:
        this.updateSelection(data);
        break;
    }
  }

}
