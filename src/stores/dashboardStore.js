import Store from './store';
import { GraphStore } from './graphStore';

export const MAX_SLOTS = 4;

export const EVENTS = {
  FETCH_DASHBOARD: 'dashboard_fetch',
  SAVE_SLOT: 'dashboard_save_slot',
  REPLACE_SLOT: 'dashboard_replace_slot',
  DELETE_SLOT: 'dashboard_delete_slot'
};

const toGraphSlotEntry = data => ({
  // The graph properties
  graph: {
    // Graph type, i.e. line, marker, bar
    type: data.graph.type,
    // The query used to drive the graph
    query: data.graph.query,
    // The selection of rows for the graph
    selection: data.graph.selection,
    // The cached store of records
    records: data.graph.records,
    // The cache timestamp
    timestamp: data.graph.timestamp
  }
});

const toSlotEntry = data => ({
  // The title of the slot
  title: data.title,
  // The optional description of the slot
  description: data.description,
  // The type of slot
  type: data.type,
  // The timestamp the slot was added
  timestamp: data.timestamp,
  // Data specific to the slot type (currently only graph)
  ...(data.type === 'graph') ? toGraphSlotEntry(data) : {}
});

const checkDashboardFull = data => ({
  ...data,
  full: data.slots.length >= MAX_SLOTS
});

export class DashboardStore extends Store {

  static inject() {
    return [config];
  }

  get EVENTS() {
    return [
      EVENTS.FETCH_DASHBOARD,
      EVENTS.SAVE_SLOT,
      EVENTS.REPLACE_SLOT,
      EVENTS.DELETE_SLOT
    ];
  }

  get STORES() {
    return [GraphStore];
  }

  constructor(config, ...rest) {
    super(...rest);
    this.baseUrl = config.dashboardUrl;
  }

  getDefaultState() {
    return {
      slots: [],
      type: 'graph',
      loaded: false
    };
  }

  saveSlot(opts) {
    if (this.data.slots.length > MAX_SLOTS) {
      throw new Error('max number of slots reached');
    }
    const slot = toSlotEntry({ ...this.data, ...opts, timestamp: Date.now() });
    const slots = this.data.slots.concat(slot);
    this.updateSlots(slots);
  }

  replaceSlot(index, opts) {
    if (index < 0 || index > MAX_SLOTS - 1) {
      throw new Error(`index must be an integer from 0 to ${MAX_SLOTS - 1}`);
    }
    const slot = toSlotEntry({ ...this.data, ...opts, timestamp: Date.now() });
    // Replace the graph with the given index with the
    // current graph state.
    const slots = this.data.slots.map((other, i) => (i === index) ? slot : other);
    this.updateSlots(slots);
  }

  deleteSlot(index) {
    if (index < 0 || index >= this.data.slots.length) {
      throw new Error('invalid slot index');
    }
    const slots = this.data.slots.filter((other, i) => i !== index);
    this.updateSlots(slots);
  }

  updateGraph(graph) {
    this.data = {
      ...this.data,
      graph: {
        type: graph.type,
        query: graph.query,
        selection: graph.selection,
        records: graph.records,
        timestamp: graph.timestamp
      }
    };
  }

  updateSlots(slots) {
    const restore = this.data;
    this.data = checkDashboardFull({
      ...this.data,
      slots
    });
    return this.saveDashboard()
      .catch(err => {
        console.error(err);
        this.data = checkDashboardFull({
          ...this.data,
          slots: restore.slots
        });
      });
  }

  saveDashboard() {
    return this.service.fetch(this.baseUrl, {
      method: 'PUT',
      body: JSON.stringify({
        slots: this.data.slots
      })
    });
  }

  fetchDashboard() {
    return this.service.fetchFrom('dashboardUrl', '')
      .then(response => {
        this.data = checkDashboardFull({
          ...this.data,
          slots: response.slots,
          loaded: true
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  onEvent(data, event) {
    switch (event) {
      case EVENTS.FETCH_DASHBOARD:
        this.fetchDashboard();
        break;
      case EVENTS.SAVE_SLOT:
        this.saveSlot(data);
        break;
      case EVENTS.REPLACE_SLOT:
        this.replaceSlot(data.index, data);
        break;
      case EVENTS.DELETE_SLOT:
        this.deleteSlot(data.index);
        break;
    }
  }

  onStoreChange(data, store) {
    switch (store) {
      case GraphStore:
        this.updateGraph(data);
        break;
    }
  }

}
