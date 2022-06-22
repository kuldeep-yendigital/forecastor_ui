import {bindable} from 'aurelia-framework';
import { CalculatedMetrics } from './../../dialog/calculated-metrics';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as GLOBAL_EVENTS from '../../../events';
import { DialogService } from 'aurelia-dialog';
import { DataStore, EVENTS as DATASTORE_EVENTS } from '../../../stores/dataStore';
import { QueryStore } from '../../../stores/queryStore';
import {flatten} from '../../../helpers/array-extensions';
import {formatCamelCase} from '../../../helpers/format';
import {
  flattenHierarchicalList,
  flattenListAndMergeState,
  flattenAndGetLeafNodes,
  navigate,
  setLevels,
  updateListState
} from './helpers';
import filter from 'lodash/filter';
require('./index.scss');

export const STATES = {
  UNCHECKED: 0,
  CHECKED: 1,
  INDETERMINATE: 2
};

export const EVENTS = {
  RESET_SEARCH: 'RESET_SEARCH'
};

const PLACEHOLDER_MAX_CHARS = 25;
const isComplex = metric =>
  metric.aggregationType && metric.aggregationType.toLowerCase().trim() !== 'simple';

function isCalculatedMetricsDialogSuppressed() {
  return window.localStorage
    ? ('true' === window.localStorage.getItem('forecaster-calculatedmetrics-dialog-suppress'))
    : false;
}

export class MultiListPanel {
  @bindable onItemSelectChange;
  @bindable canUncheck;
  @bindable dimensionName;
  @bindable header;
  @bindable placeholder;
  @bindable data;
  @bindable loading;
  @bindable dataLoading;
  @bindable refresh;
  @bindable dimensionLoading;
  @bindable baseCount;
  @bindable baseCountAlt;
  @bindable withResultCounts;

  static inject() {
    return [EventAggregator, QueryStore, DataStore, DialogService];
  }

  constructor(eventAggregator, QueryStore, DataStore, DialogService) {
    this.expandDialogClosed = true;
    this.dialogService = DialogService;
    this.isRoot = true;
    this.STATES = STATES;
    this.selectAll = false;
    this.scroll = this.scroll.bind(this);
    this.eventAggregator = eventAggregator;
    this.dimensionItem = {};
    this.history = [];
    this.placeholder = '';
    this.unselectAllEventListener = this.eventAggregator.subscribe(GLOBAL_EVENTS.RESET_SEARCH_RESULTS, this.unselectAll.bind(this));
    this.eventAggregator.subscribe(GLOBAL_EVENTS.DIMENSION_COUNT_RELOAD, this.countReloaded.bind(this));
    this.eventAggregator.subscribe(GLOBAL_EVENTS.RESTORED_DEFAULTS, this.resetToParent.bind(this));
    this.baseCount = 0;
    this.baseCountAlt = 0;
    this.lastCount = 0;
    this.lastCountAlt = 0;
    this.lastAction = -1;
    this.queryStore = QueryStore;
    this.dataStore = DataStore;
    this.defaultQueryState = this.queryStore.getDefaultState();
    this.subscriptions = [];
    this.dataLoading = false;
    this.shownComplexDialog = false;
    this.initialZeroItems = null;
    this.withResultCounts = false;
    this.dataChangedCb = null;
  }

  unselectAll() {
    this.selectAllChange(false);
  }

  attached() {
    this.header = formatCamelCase(this.dimensionName);
    this.placeholder = this.trimPlaceholder();
    this.dimensionItem = {
      name: this.dimensionName
    };

    if(this.list) {
      this.selectAll = this.isEveryFilterSelected();
    }

    if(this.list_scroll) {
      this.list_scroll.addEventListener('scroll', this.scroll);
    }
    
    this.dimensionLoading = this.withResultCounts;
    this.subscriptions = [
      this.dataStore.subscribe(this.onDataChanged.bind(this))
    ];

    this.initialZeroItems = null;
  }

  detached() {
    if(this.list_scroll) {
      this.list_scroll.removeEventListener('scroll', this.scroll);
    }
    this.unselectAllEventListener.dispose();
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.initialZeroItems = null;
  }

  onDataChanged(newData) {
    this.initialZeroItems = null;
    this.baseCount = newData.rowCount;
    this.baseCountAlt = newData.rowCountAlt;
    this.dataLoading = newData.isUpdating;
    this.historyUpdated();
  }

  resetToParent() {
    this.resetHistory();
    this.dataLoading = false;
    this.initialZeroItems = null;
  }

  scroll() {
    this.eventAggregator.publish(GLOBAL_EVENTS.MULTI_LIST_PANEL_SCROLL);
  }

  replay(event) {
    this.refresh(event);
  }

  hasNext(item) {
    return !!item.count;
  }

  next(item) {
    if (this.isItemNavigationEnabled(item)) {
      this.dimensionLoading = true;
      this.history.push(item.name);
      this.historyUpdated();
      this.queryResultCount();
    }
  }

  previous() {
    this.dimensionLoading = true;
    if (this.searchResults && this.searchResults.length > 0) {
      this.eventAggregator.publish(EVENTS.RESET_SEARCH);
    }
    this.history.pop();
    this.historyUpdated();
    this.queryResultCount();
  }

  resetHistory() {
    this.history = [];
  }

  countReloaded(dimension) {
    if (this.dimensionItem.name.replace(/\s/g, '').toLowerCase() === dimension) {

      this.historyUpdated();
      // if the zero items array is empty, attempt to fill it
      if (!Array.isArray(this.initialZeroItems) && !this.initialZeroItems) {
        this.initialZeroItems = [];
        this.flatList = flattenHierarchicalList(this.list);
        this.flatList.forEach((item) => {
          if(['MetricIndicator', 'Metric'].includes(this.dimensionItem.name)) {
            if ((item.rowCount === 0 
                || (item.rowCounts && item.rowCounts.Simple <= 0)) 
                && (item.rowCounts && item.rowCounts.Complex <= 0 || item.rowCounts.Complex === this.baseCountAlt)
                && item.state !== STATES.CHECKED) {
              this.initialZeroItems.push(item.id);
            }
          }
          else {
            if (item.rowCount === 0 
              || (item.rowCounts && item.rowCounts.Simple <= 0)
              && item.state !== STATES.CHECKED) {
              this.initialZeroItems.push(item.id);
            }
          }
        });
      }
      this.dimensionLoading = false;
      if (this.performedSearch) {
        this.flatList = flattenListAndMergeState(this.data.sort((a, b) => a.name.localeCompare(b.name)), this.flatList);
        this.eventAggregator.publish(GLOBAL_EVENTS.DIMENSION_COUNT_SEARCH_DONE, dimension);
        this.performedSearch = false;
      } 
    }
  }

  historyUpdated() {
    this.isRoot = !this.history.length;
    this.list = ((this.isRoot ? this.data : navigate(this.data, this.history)) || []).map(updateListState);

    const defaultMetricIndicator = 
      this.defaultQueryState.compositeFilters.metricindicator;

    if(['MetricIndicator', 'Metric'].includes(this.dimensionItem.name)) {
      // Add indication of calculator icon
      this.list = this.list.map(item => ({
        ...item,
        isCalculator: (
          item.count === 0 &&
          item.aggregationType !== 'Simple' &&
          !defaultMetricIndicator.includes(item.name)
        )
      }));
    }

    // Get the rowCount from the dataStore
    this.baseCount = this.dataStore.data.rowCount;
    this.baseCountAlt = this.dataStore.data.rowCountAlt;
  }

  trimPlaceholder() {
    let initialPlaceholder = `Search ${this.header.toLowerCase()}`;
    if (initialPlaceholder.length > PLACEHOLDER_MAX_CHARS) {
      initialPlaceholder = initialPlaceholder.substr(0, PLACEHOLDER_MAX_CHARS).trim();
    }

    return `${initialPlaceholder}...`;
  }

  dataChanged() {
    this.historyUpdated();
    this.selectAll = this.isEveryFilterSelected();
    let list = this.data;
    if (this.dimensionName) {
      list = this.data.map(updateListState);
      setLevels(list);
    }
    if (!this.searchResults || this.searchResults.length === 0) {
      this.flatList = flattenHierarchicalList(list.sort((a, b) => a.name.localeCompare(b.name)));
      this.queryResultCount();
    }
    else {
      this.queryResultCount(this.searchResults);
    }

    // Call the callback
    if (this.dataChangedCb) {
      this.dataChangedCb();
    }
  }

  queryResultCount(list = []) {
    this.eventAggregator.publish(DATASTORE_EVENTS.FETCH_COUNT, {
      [this.dimensionName.replace(/\s/g, '').toLowerCase()]: list.length > 0 ? list : this.list
    });
  }

  setChildState(item, state) {
    if (item.children && item.children.length) {
      item.children.forEach(child => {
        // Only enable if the child is clickable
        if (this.isItemEnabled(child)) {
          this.setChildState(child, state);
        }
      });
    }
    item.state = state;
  }

  setItemState(item) {
    switch (item.state) {
    case STATES.CHECKED:
      if(!this.canUncheck || this.canUncheck(this.list)) {
        item.state = STATES.UNCHECKED;
        this.lastAction = STATES.UNCHECKED;
      }
      break;
    case STATES.INDETERMINATE:
      item.state = STATES.CHECKED;
      this.lastAction = STATES.CHECKED;
      break;
    case STATES.UNCHECKED:
    default:
      item.state = STATES.CHECKED;
      this.lastAction = STATES.CHECKED;
      break;
    }

    this.setChildState(item, item.state);

    return item;
  }

  isEveryFilterSelected() {
    const leaves = flatten(this.data);
    return leaves.every(item => item.state === STATES.CHECKED);
  }

  async selectAllChange(toggleValue) {
    this.selectAll = toggleValue;
    this.dimensionItem.state = this.selectAll ? STATES.UNCHECKED : STATES.CHECKED;
    let list = this.searchResults.length > 0 ? this.searchResults : this.list;
    if (this.selectAll) {
      list = filter(list, (item) => {
        return this.isItemEnabled(item);
      });
    }

    if (['MetricIndicator', 'Metric'].includes(this.dimensionItem.name) && toggleValue) { 
      for(let item of list) {
        if (isComplex(item) && this.expandDialogClosed && !this.shownComplexDialog) {
          await this.expandMetric(item);
          this.shownComplexDialog = true;
        }
      }
    }

    list.forEach((item) => {
      item.state = this.dimensionItem.state;
      item = this.setItemState(item);
      this.onItemSelectChange(item);
    });
  }

  isItemEnabled(item) {
    if (item && item.children && item.children.length > 0) {
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
      return item.rowCount > 0;
    }
  }

  isItemNavigationEnabled(item) {
    let result = false;

    // We need to determine whether we have any enabled leaf nodes
    if (item.children && item.children.length > 0) {
      const flatChildren = flattenHierarchicalList([item]);
      flatChildren.forEach((child) => {
        result |= this.isItemEnabled(child);
      });
    }
    else {
      result = this.isItemEnabled(item);
    }

    return result;
  }

  expandMetric(item) {
    return new Promise((resolve) => {
      const finish = () => {
        this.eventAggregator.publish(GLOBAL_EVENTS.CALCULATED_METRIC_SELECTED);
        resolve(item);
      };
  
      if (isCalculatedMetricsDialogSuppressed())
        return finish();
  
      this.expandDialogClosed = false;
      this.dialogService.open({
        lock           : true,
        model          : [],
        overlayDismiss : true,
        viewModel      : CalculatedMetrics
      }).whenClosed((response) => {
        this.expandDialogClosed = true;
  
        if (!response.wasCancelled)
          window.localStorage.setItem('forecaster-calculatedmetrics-dialog-suppress', 'true');
  
        return finish();
      });
    });
  }

  async toggleSelection(item) {
    if (!item) {
      return false;
    }
    
    if (this.isItemEnabled(item)) {
      if (['MetricIndicator', 'Metric'].includes(this.dimensionItem.name) 
          && isComplex(item) 
          && item.state === STATES.UNCHECKED
          && this.expandDialogClosed) {
        await this.expandMetric(item);
        this.toggleSelectionExec(item);
      }
      else {
        this.toggleSelectionExec(item);
      }
    }
  }

  toggleSelectionExec(item) {
    this.eventAggregator.publish(GLOBAL_EVENTS.TOGGLE_GRID_LANDING_PAGE, false);
    this.dimensionLoading = true;
    item = this.setItemState(item);
    this.onItemSelectChange(item);
  }
}
