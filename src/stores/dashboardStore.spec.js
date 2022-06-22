import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingEngine } from 'aurelia-framework';

import { GenericService } from '../services/genericService';
import { DashboardStore, EVENTS as DASHBOARD_EVENTS } from './dashboardStore';
import { GraphStore } from './graphStore';

describe('DashboardStore', () => {
  let container;

  beforeEach(() => {
    container = new Container().makeGlobal();
    container.registerInstance(EventAggregator, {
      subscribe() {}
    });
    container.registerInstance(BindingEngine, {
      propertyObserver: () => ({ subscribe: () => {} })
    });
    container.registerInstance(GenericService, {
      fetch: () => Promise.resolve({}),
      fetchAll: () => Promise.resolve({})
    });
    container.registerInstance('config', {
      get: () => {}
    });
    container.registerSingleton(DashboardStore);
  });

  it('defaults to graph slot type', () => {
    const dashboardStore = container.get(DashboardStore);
    expect(dashboardStore.data.type).toBe('graph');
  });

  describe('on save graph', () => {
    it('adds a graph to the dashboard', () => {
      const dashboardStore = container.get(DashboardStore);
      const currentGraph = { type: 'line', query: {}, selection: [], records: [], timestamp: Date.now() };
      dashboardStore.data = {
        // Saved slots
        slots: [],
        // Current slot type
        type: 'graph',
        // Current graph
        graph: currentGraph,
      };
      // Add a saved graph to the store
      dashboardStore.onEvent({ title: 'Test' }, DASHBOARD_EVENTS.SAVE_SLOT);
      // Check graph at index 0 is now the current graph
      expect(dashboardStore.data.slots[0].type).toBe('graph');
      expect(dashboardStore.data.slots[0].title).toBe('Test');
      expect(dashboardStore.data.slots[0].graph.type).toBe(currentGraph.type);
      expect(dashboardStore.data.slots[0].graph.query).toBe(currentGraph.query);
      expect(dashboardStore.data.slots[0].graph.selection).toBe(currentGraph.selection);
      expect(dashboardStore.data.slots[0].graph.records).toBe(currentGraph.records);
      expect(dashboardStore.data.slots[0].graph.timestamp).toBe(currentGraph.timestamp);
    });

    it('stores the created timestamp for the slot', () => {
      const dashboardStore = container.get(DashboardStore);
      const currentGraph = { type: 'line', query: {}, selection: [], records: [], timestamp: Date.now() };
      dashboardStore.data = {
        // Saved slots
        slots: [],
        // Current slot type
        type: 'graph',
        // Current graph
        graph: currentGraph
      };
      // Add a saved graph to the store
      dashboardStore.onEvent({ title: 'Test' }, DASHBOARD_EVENTS.SAVE_SLOT);
      // Check graph at index 0 is now the current graph
      expect(dashboardStore.data.slots[0].timestamp).toBeGreaterThan(0);
    });

    it('cannot add more than 4 graphs', () => {
      const dashboardStore = container.get(DashboardStore);
      const currentGraph = {
        type: 'line',
        query: {},
        selection: [],
        records: [],
        timestamp: Date.now()
      };
      dashboardStore.data = {
        // Saved slots
        slots: [],
        // Current slot type
        type: 'graph',
        // Current graph type
        graph: currentGraph,
      };
      // Add a saved graph to the store
      expect(() => {
        for (let i = 0; i <= 5; ++i) {
          dashboardStore.onEvent({ title: 'Test' }, DASHBOARD_EVENTS.SAVE_SLOT);
        }
      }).toThrow(new Error('max number of slots reached'));
    });
  });

  describe('on delete slot', () => {
    it('removes an existing slot on the dashboard by index', () => {
      const dashboardStore = container.get(DashboardStore);
      dashboardStore.data = {
        slots: [
          { title: 'A' },
          { title: 'B' },
          { title: 'C' },
          { title: 'D' }
        ]
      };
      dashboardStore.onEvent({ index: 1 }, DASHBOARD_EVENTS.DELETE_SLOT);
      expect(dashboardStore.data.slots).toEqual([
        { title: 'A' },
        { title: 'C' },
        { title: 'D' }
      ]);
    });
  });

  describe('on replace slot with graph', () => {
    it('replaces a slot on the dashboard', () => {
      const dashboardStore = container.get(DashboardStore);
      const currentGraph = { type: 'line', query: {}, selection: [], records: [], timestamp: Date.now() };
      dashboardStore.data = {
        // Saved slots
        slots: [
          {},
          {},
          {},
          {}
        ],
        type: 'graph',
        // Current graph
        graph: currentGraph
      };
      // Replace the saved graph at index 1 (this is usually
      // in response to the max saved graphs dialog).
      dashboardStore.onEvent({ index: 1 }, DASHBOARD_EVENTS.REPLACE_SLOT);
      // Check graph at index 1 is now the current graph
      expect(dashboardStore.data.slots[1].type).toBe('graph');
      expect(dashboardStore.data.slots[1].graph.type).toBe(currentGraph.type);
      expect(dashboardStore.data.slots[1].graph.query).toBe(currentGraph.query);
      expect(dashboardStore.data.slots[1].graph.selection).toBe(currentGraph.selection);
      expect(dashboardStore.data.slots[1].graph.records).toBe(currentGraph.records);
      expect(dashboardStore.data.slots[1].graph.timestamp).toBe(currentGraph.timestamp);
    });
  });

  describe('on graph store changed', () => {
    it('updates the current graph data', () => {
      const dashboardStore = container.get(DashboardStore);
      const currentGraph = { type: 'line', query: {}, selection: [], records: [], timestamp: Date.now() };
      dashboardStore.data = {
        // Saved slots
        slots: [
          {},
          {},
          {},
          {}
        ],
        type: 'graph',
        // Current graph
        graph: {}
      };
      dashboardStore.onStoreChange(currentGraph, GraphStore);
      expect(dashboardStore.data.graph.type).toBe(currentGraph.type);
      expect(dashboardStore.data.graph.query).toBe(currentGraph.query);
      expect(dashboardStore.data.graph.selection).toBe(currentGraph.selection);
      expect(dashboardStore.data.graph.records).toBe(currentGraph.records);
      expect(dashboardStore.data.graph.timestamp).toBe(currentGraph.timestamp);
    });
  });

});
