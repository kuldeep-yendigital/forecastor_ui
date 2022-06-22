import { bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { QueryStore } from '../../../stores/queryStore';
import { EVENTS as MULTILIST_PANEL_EVENTS } from '../multi-list-panel';
import { EVENTS as DATASTORE_EVENTS } from '../../../stores/dataStore';
import * as GLOBAL_EVENTS from '../../../events';
import { flattenAndGetLeafNodes, flattenHierarchicalList } from '../multi-list-panel/helpers';

// Forces the order, otherwise it's random.  It doesn't duplicate the file
require('materialize-css/dist/css/materialize.min.css');
require('./index.scss');

export const EVENTS = {
  ON_SELECTION: 'searchpanel_select',
  ON_UNSELECTION: 'searchpanel_unselect',
  ON_RESULTS: 'searchpanel_results',
  ITEM_STATE_CHANGED: 'searchpanel_item_state_changed'
};

export const STATES = {
  UNCHECKED: 0,
  CHECKED: 1,
  INDETERMINATE: 2
};

export const SEARCH_DELAY = 500;
export const MINIMUM_CHARS = 2;

export class SearchPanel {
  @bindable list;
  @bindable header;
  @bindable loading;
  @bindable placeholder;
  @bindable refresh;
  @bindable selection;
  @bindable dimensionName;
  @bindable dimensionLoading;

  static inject() {
    return [EventAggregator, QueryStore];
  }

  constructor(eventAggregator, queryStore) {
    this.eventAggregator = eventAggregator;
    this.searchResults = [];
    this.noResultsFound = false;
    this.subscriptions = [];
    this.STATES = STATES;
    this.subscriptions.concat([
      this.eventAggregator.subscribe(
        MULTILIST_PANEL_EVENTS.RESET_SEARCH,
        this.resetSearchInput.bind(this)
      ),
      this.eventAggregator.subscribe(
        GLOBAL_EVENTS.RESTORED_DEFAULTS,
        this.resetSearchInput.bind(this)
      ),
      this.eventAggregator.subscribe(
        EVENTS.ITEM_STATE_CHANGED,
        this.toggleSelection.bind(this)
      ),
      this.eventAggregator.subscribe(
        GLOBAL_EVENTS.DIMENSION_COUNT_SEARCH_DONE,
        this.countReloaded.bind(this)
      )
    ]);
    this.defaultQueryState = queryStore.getDefaultState();
    this.dimensionItem = {};
    this.initialZeroItems = null;
  }

  attached() {
    this.dimensionItem = {
      name: this.dimensionName
    };
    this.initialZeroItems = null;
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.initialZeroItems = null;
  }

  resetSearchInput() {
    this.searchTerm = '';
    this.hasParentHistory = null;
    this.assign('searchResults', []);
  }

  updateSearch() {
    this.dimensionLoading = true;
    let results = [];
    if (this.searchTerm && this.searchTerm.split('').length >= MINIMUM_CHARS) {
      results = this.getList().filter(item => item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1);
      // Trigger counts here
      if (results && results.length > 0) {
        this.queryResultCount(results);
      }
      else {
        this.dimensionLoading = false;
        this.assign('noResultsFound', true);
        this.eventAggregator.publish(EVENTS.ON_RESULTS, false);
      }

      if (!this.parent.data.dimension) {
        this.assign('performedSearch', true);
      }
    }
    else if (this.searchTerm.split('').length === 0) {
      // Re-run
      this.parent.previous();
      this.dimensionLoading = false;
    }
    else {
      this.assign('searchResults', results);
      this.assign('noResultsFound', false);
      this.dimensionLoading = false;
    }
  }

  countReloaded(dimension) {
    if (this.dimensionName.replace(/\s/g, '').toLowerCase() === dimension) {
      if (this.searchTerm && this.searchTerm.length >= MINIMUM_CHARS) {
        this.search(this.searchTerm);

        // if the zero items array is empty, attempt to fill it
        if (!Array.isArray(this.initialZeroItems) && !this.initialZeroItems) {
          this.initialZeroItems = [];
          this.flatList = flattenHierarchicalList(this.searchResults);
          this.flatList.forEach((item) => {
            if ((item.rowCount === 0 
                  || (item.rowCounts && item.rowCounts.Simple <= 0)) 
                  && (item.rowCounts && item.rowCounts.Complex <= 0 || item.rowCounts.Complex === this.parent.baseCountAlt)) {
              this.initialZeroItems.push(item.id);
            }
          });
        }
      }
      this.dimensionLoading = false;
      this.assign('searchResults', this.searchResults);
    }
  }

  queryResultCount(items = this.searchResults) {
    this.eventAggregator.publish(DATASTORE_EVENTS.FETCH_COUNT, {
      [this.dimensionName.replace(/\s/g, '').toLowerCase()]: items
    });
  }

  onTypeAhead() {
    if(this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.updateSearch();
    }, SEARCH_DELAY);

    return true;
  }

  /**
   * Assign value to scope and propagate to parent when search is inside a dimension panel
   * @param key
   * @param val
   */
  assign(key, val) {
    if (this.parent.dimensionItem) {
      this[key] = this.parent[key] = val;
    } else {
      this[key] = val;
    }
  }

  /**
   * Bind context to parent so panel can interact with search results
   * This is a lose coupling so component can be reused on its own
   * @param bindingContext
   */
  bind(bindingContext) {
    // bindingContext is your parent view-model
    this.parent = bindingContext;
    if (this.parent.dimensionItem) {
      this.parent.searchResults = this.searchResults;
      this.parent.noResultsFound = this.noResultsFound;
    }
  }

  replay(event)  {
    this.refresh(event);
  }

  /**
   * Search the list, set levels and update panel history when results found
   * @param searchTerm
   */
  search(searchTerm) {
    this.searchResults = [];
    const defaultMetricIndicator = 
      this.defaultQueryState.compositeFilters.metricindicator;

    this.searchResults = this.getList().filter(item => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    if (this.searchResults.length === 0) {
      this.assign('noResultsFound', true);
      this.eventAggregator.publish(EVENTS.ON_RESULTS, false);
    } 
    else {
      if(['MetricIndicator', 'Metric'].includes(this.dimensionItem.name)) {
        // Add indication of calculator icon
        this.searchResults = this.searchResults.map(item => ({
          ...item,
          isCalculator: (
            item.count === 0 &&
            item.aggregationType !== 'Simple' &&
            !defaultMetricIndicator.includes(item.name)
          )
        }));
      }
      this.sortResultsByLevels();
      this.assign('noResultsFound', false);
      this.eventAggregator.publish(EVENTS.ON_RESULTS, true);
    }
  }

  /**
   * Search the parent flatList for dimensions or current list for companies
   * @returns {*}
   */
  getList() {
    // Parent items
    const parentItems = this.parent.data.dimension;
    if (parentItems) {
      return flattenHierarchicalList(this.parent.data.dimension.items);
    }
    else {
      return (this.parent.flatList && this.parent.flatList.length > 0 ? this.parent.flatList : this.list) || [];
    }
  }

  /**
   * Sort results by level and 'groups' them (set flag for template repeater)
   */
  sortResultsByLevels() {
    let levelGroups = [];
    this.searchResults
      .sort((a, b) => a.level - b.level)
      .forEach(v => {
        v.grouped = undefined;
        if (levelGroups.indexOf(v.level) > -1) {
          v.grouped = true;
        } else {
          levelGroups.push(v.level);
        }
      });
  }

  isItemEnabled(item) {
    // If it's ticked already, what's the point disabling it?
    if (item.state === STATES.CHECKED) {
      return true;
    }

    if (item.children && item.children.length > 0) {
      // All children must be selectable
      // Flatten
      const items = flattenAndGetLeafNodes([item]);
      let result = true;
      items.forEach((item) => {
        result &= this.isItemEnabled(item);
      });

      return !!result;
    }

    // Was it ever zero since we expanded the dimension?
    // If yes, it can never be enabled until we detach
    if (this.initialZeroItems && this.initialZeroItems.indexOf(item.id) > -1) {
      return false;
    }

    // Only care about complex if we're in Metric or MetricIndicator
    if(['MetricIndicator', 'Metric'].includes(this.dimensionItem.name)) {
      if (item.aggregationType === 'Simple') {
        return item.rowCount > 0;
      }
      else {
        if (item.rowCount > 0) {
          return true;
        }
        else {
          if (item.rowCounts && item.rowCounts.Complex > 0) {
            return true;
          }
        }
      }
    }
    else {
      console.log(`${item.name}: ${item.rowCount}`);
      return item.rowCount > 0;
    }
  }

  toggleSelection(item) {
    if (this.isItemEnabled(item)) {
      const event = item.state ? EVENTS.ON_UNSELECTION : EVENTS.ON_SELECTION;

      if (this.parent.toggleSelection && !item.ignoreParent) {
        this.parent.toggleSelection(item);
      } else {
        item.state = item.state === STATES.CHECKED ? STATES.UNCHECKED : STATES.CHECKED;
        this.eventAggregator.publish(event, item);
      }
    }
  }
}
