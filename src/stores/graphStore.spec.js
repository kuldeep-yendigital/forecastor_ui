import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingEngine } from 'aurelia-framework';

import { GenericService } from '../services/genericService';
import { GraphStore, EVENTS as GRAPH_EVENTS } from './graphStore';
import { QueryStore } from './queryStore';
import { SelectionStore } from './selectionStore';

describe('GraphStore', () => {
  let container;

  beforeEach(() => {
    container = new Container().makeGlobal();
    container.registerInstance(EventAggregator, {
      subscribe() {}
    });
    container.registerInstance(BindingEngine, {
      propertyObserver: () => ({ subscribe: () => {} })
    });
    container.registerInstance(GenericService, {});
    container.registerInstance(QueryStore, {});
    container.registerInstance(SelectionStore, {});
    container.registerSingleton(GraphStore);
  });

  describe('on change graph type', () => {
    it('updates the type of the current graph to line', () => {
      const graphStore = container.get(GraphStore);
      graphStore.onEvent('line', GRAPH_EVENTS.CHANGE_GRAPH_TYPE);
      expect(graphStore.data.type).toBe('line');
    });

    it('updates the type of the current graph to bar', () => {
      const graphStore = container.get(GraphStore);
      graphStore.onEvent('bar', GRAPH_EVENTS.CHANGE_GRAPH_TYPE);
      expect(graphStore.data.type).toBe('bar');
    });

    it('updates the type of the current graph to marker', () => {
      const graphStore = container.get(GraphStore);
      graphStore.onEvent('marker', GRAPH_EVENTS.CHANGE_GRAPH_TYPE);
      expect(graphStore.data.type).toBe('marker');
    });

    it('does not update graph to an invalid type', () => {
      const graphStore = container.get(GraphStore);
      expect(() => {
        graphStore.onEvent('bob', GRAPH_EVENTS.CHANGE_GRAPH_TYPE);
      }).toThrow();
    });
  });

  describe('on query store changed', () => {
    it('subscribes to the query store', () => {
      const graphStore = container.get(GraphStore);
      expect(graphStore.STORES).toContain(QueryStore);
      expect(graphStore.stores.QueryStore).toBeDefined();
    });

    it('updates the current graph query', () => {
      const graphStore = container.get(GraphStore);
      const updatedQuery = {};
      graphStore.onStoreChange(updatedQuery, QueryStore);
      expect(graphStore.data.query).toBe(updatedQuery);
    });

    it('clears the existing records and selection', () => {
      const graphStore = container.get(GraphStore);
      graphStore.data = {
        records: [
          {},
          {},
          {}
        ],
        selection: [
          {},
          {},
          {}
        ]
      }
      const updatedQuery = {};
      graphStore.onStoreChange(updatedQuery, QueryStore);
      expect(graphStore.data.records).toEqual([]);
      expect(graphStore.data.selection).toEqual([]);
    });

    it('updates the current graph timestamp', () => {
      const graphStore = container.get(GraphStore);
      graphStore.data = {
        timestamp: 0
      }
      const updatedQuery = {};
      graphStore.onStoreChange(updatedQuery, QueryStore);
      expect(graphStore.data.timestamp).not.toEqual(0);
    });
  });

  describe('on selection store changed', () => {
    it('subscribes to the selection store', () => {
      const graphStore = container.get(GraphStore);
      expect(graphStore.STORES).toContain(SelectionStore);
      expect(graphStore.stores.SelectionStore).toBeDefined();
    });

    it('updates the current graph selection', () => {
      const graphStore = container.get(GraphStore);
      const updatedSelection = { selected: [], records: [] };
      graphStore.onStoreChange(updatedSelection, SelectionStore);
      expect(graphStore.data.selection).toBe(updatedSelection.selected);
    });

    it('updates the current graph records', () => {
      const graphStore = container.get(GraphStore);
      const updatedSelection = { selected: [], records: [] };
      graphStore.onStoreChange(updatedSelection, SelectionStore);
      expect(graphStore.data.records).toBe(updatedSelection.records);
    });

    it('updates the current graph timestamp', () => {
      const graphStore = container.get(GraphStore);
      graphStore.data = {
        timestamp: 0
      };
      const updatedSelection = { selected: [], records: [] };
      graphStore.onStoreChange(updatedSelection, SelectionStore);
      expect(graphStore.data.timestamp).not.toEqual(0);
    });
  });

  describe('on data store changed', () => {
    // Updates records
  });
});
