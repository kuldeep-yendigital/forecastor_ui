import Store from './store';
import * as GLOBAL_EVENTS from '../events';
import { flatten, findDeep } from '../helpers/array-extensions';
import { STATES } from '../components/panels/multi-list-panel';
import { QueryStore } from './queryStore';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';

export class HierarchicalDimensionStore extends Store {

  get STORES() {
    return [
      QueryStore
    ];
  }

  onStoreChange(data, store) {
    switch (store) {
    case QueryStore:
      if (this.data) {
        this.loadTaxonomy();
      }
      break;
    }
  }


  constructor(label, dimension, events, ...rest) {
    super(...rest);

    this.label = label;
    this.events = events;
    this.dimension = dimension;

  }

  checkQueryStore() {
    const storeData = this.stores.QueryStore.data;
    if (storeData) {

      if (storeData.filters && storeData.filters[this.dimension]) {
        return storeData.filters[this.dimension];
      } else if (storeData.compositeFilters && storeData.compositeFilters[this.dimension]) {
        return storeData.compositeFilters[this.dimension];
      }
    }
    return null;
  }

  setDefaultState({ items }) {
    const leaves = flatten(items);
    const dimensionFilters = this.checkQueryStore();
    if (dimensionFilters) {
      leaves.forEach(leaf => {
        leaf.state = dimensionFilters.indexOf(leaf.name) > -1 ? STATES.CHECKED : STATES.UNCHECKED;
      });
    } else {
      leaves.forEach(leaf => {
        leaf.state = STATES.UNCHECKED;
      });
    }

    items.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
    });

    this.data = {
      items
    };
  }

  getDefaultState() {
    return null;
  }

  name() {
    return 'dimension';
  }

  fetch() {
    return this.service.fetchFrom('taxonomyApiUrl', `hierarchy/${this.dimension}`);
  }

  getChildrenForGivenNode(node, items) {
    if (node.children.length > 0) {
      node.children.forEach(child => {
        this.getChildrenForGivenNode(child, items);
      });
    } else {
      items.push(node);
    }
  }

  childFilters(currentItem) {
    var nodes = [];
    this.getChildrenForGivenNode(currentItem, nodes);

    return nodes.map(node => {
      return {
        type: this.dimension,
        name: node.name
      };
    });
  }

  loadTaxonomy() {
    const taxonomyPromise = this.taxonomy ?
      Promise.resolve(this.taxonomy) :
      this.fetch().then(data => {
        this.taxonomy = data;
        return data;
      });
    taxonomyPromise
      .then(JSON.stringify)
      .then(JSON.parse)
      .then(data => this.setDefaultState({
        items: data
      }));
  }

  onEvent(data, event) {
    switch (event) {
    case GLOBAL_EVENTS.DIMENSION_COUNT_DONE:
      if (!this.data) {
        break;
      }
      
      const tempTaxonomy = this.data.items;
      forEach(data, (dimension) => {
        const dKey = Object.keys(dimension)[0];
        const pKey = dimension.parent;
        const deepSearchRes = findDeep(tempTaxonomy, (o) => { 
          if (o.parent === 0) {
            return o.id === dKey;
          }
          else {
            return o.id === dKey && o.parent === pKey;
          }
        }, this);

        if (deepSearchRes) {
          if (deepSearchRes.rowCount === undefined) {
            if (dimension.aggregationType.toLowerCase() === 'simple') {
              deepSearchRes.rowCount = dimension[dKey];
            }
          }

          if (!deepSearchRes.rowCounts) {
            deepSearchRes.rowCounts = {
              Simple: -1,
              Complex: -1
            };
          }
          deepSearchRes.rowCounts[dimension.aggregationType !== 'Simple' ? 'Complex' : 'Simple'] = dimension[dKey];
        }
      });

      this.setDefaultState({
        items: tempTaxonomy
      });

      if (this.dimension === 'company') {
        this.publish(GLOBAL_EVENTS.DIMENSION_COUNT_SEARCH_DONE, this.dimension);
      }
      else {
        this.publish(GLOBAL_EVENTS.DIMENSION_COUNT_RELOAD, this.dimension);
      }
      break;
    case GLOBAL_EVENTS.FETCH_TAXONOMY_DATA:
      if (data === this.dimension && !this.data) {
        this.loadTaxonomy();
      }
      break;
    case GLOBAL_EVENTS.RESTORE_DEFAULT_SEARCH:
      this.eventAggregator.publish(GLOBAL_EVENTS.TOGGLE_GRID_LANDING_PAGE, true);
      this.loadTaxonomy();
      break;
    case this.events.PARENT_SELECTED:
      this.publish(GLOBAL_EVENTS.COMPOSITE_FILTERS_ADDED, this.childFilters(data));
      break;
    case this.events.CHILD_SELECTED:
      this.publish(GLOBAL_EVENTS.COMPOSITE_FILTERS_ADDED, this.childFilters(data));
      break;
    case this.events.PARENT_UNSELECTED:
      this.publish(GLOBAL_EVENTS.COMPOSITE_FILTERS_REMOVED, this.childFilters(data));
      break;
    case this.events.CHILD_UNSELECTED:
      this.publish(GLOBAL_EVENTS.COMPOSITE_FILTERS_REMOVED, this.childFilters(data));
      break;
    }
  }
}
