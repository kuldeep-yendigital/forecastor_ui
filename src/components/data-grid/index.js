import {bindable, BindingEngine} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import * as GLOBAL_EVENTS from './../../events';
import getHeadersForInterval from './get-headers-for-interval';

import {TimeframeStore} from '../../stores/timeframeStore';
import {DataStore, EVENTS as DataStoreEvents} from '../../stores/dataStore';
import {ColumnStore} from '../../stores/columnStore';
import {UIStore} from '../../stores/uiStore';
import {SelectionStore, EVENTS as SELECTION_EVENTS} from '../../stores/selectionStore';
import debounce from 'lodash/debounce';
import {formatKebabCase} from '../../helpers/format';

require('./index.scss');

const COLUMN_SIZING_POLL_INTERVAL = 250;
const ROW_BUFFER = 8;
const ROW_HEIGHT = 66;

export function flattenDatapoints(record) {
  record.datapoints.forEach(datapoint => {
    record[datapoint.month] = {
      value: datapoint.value,
      type: record.unit === '%' ? 'percentage' : 'numeric',
      isCurrency: !!record.currency,
      colour: datapoint.name ? `cell-${formatKebabCase(datapoint.name)}` : ''
    };
  });
  return record;
}

function syncScrollRows(rowContainer, otherRowContainer, rowContainerScroll, otherRowContainerScroll) {
  if (!rowContainer || !otherRowContainer) return;
  rowContainer.addEventListener('scroll', rowContainerScroll);
  otherRowContainer.addEventListener('scroll', otherRowContainerScroll);
}

function syncHeightRows(rowContainer, otherRowContainer) {
  if (!rowContainer || !otherRowContainer) return;

  const rows = rowContainer.getElementsByTagName('tr');
  const otherRows = otherRowContainer.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const otherRow = otherRows[i];

    if (row.offsetHeight > otherRow.offsetHeight) {
      otherRow.style.height = `${row.offsetHeight}px`;
    } else if (row.offsetHeight < otherRow.offsetHeight) {
      row.style.height = `${otherRow.offsetHeight}px`;
    }

  }
}

function resizeGridHeaders(dataGrid) {
  if (!dataGrid) return;

  const headerRow = dataGrid.getElementsByClassName('header-row')[0];
  const sizingRow = dataGrid.getElementsByClassName('sizing-row')[0];
  if (headerRow && sizingRow) {
    const headerCells =  [].slice.call(headerRow.children);
    const sizingCells = [].slice.call(sizingRow.children);
    const sizers = headerCells.map(x => x.getElementsByClassName('sizer')[0]);

    sizers.forEach((element, index) => {
      if (element) {
        const sizingCellWidth = sizingCells[index].offsetWidth;
        element.style.width = sizingCellWidth + 'px';
      }
    });
  }
}

const keyInSelection = (selection, key) =>
  selection.some(el => el === key || el.every((part, i) => key[i] === part));

let decayingLatch = (lock, unlock, decay) => {
  let timeout = null;
  return () => {
    lock();
    clearTimeout(timeout);
    timeout = setTimeout(unlock, decay);
  };
};

export class DataGrid {
  @bindable data;
  @bindable checked;
  @bindable rows;
  @bindable allSelected;
  @bindable indeterminate;
  @bindable maxRowsPerScreen;
  @bindable startRow;
  @bindable endRow;

  static inject() {
    return [
      ColumnStore,
      Element,
      DataStore,
      SelectionStore,
      TimeframeStore,
      EventAggregator,
      BindingEngine,
      UIStore
    ];
  }

  constructor(
    ColumnStore,
    element,
    DataStore,
    SelectionStore,
    TimeframeStore,
    eventAggregator,
    bindingEngine,
    UIStore
  ) {
    this.element = element;
    this.timeframeStore = TimeframeStore;
    this.dataStore = DataStore;
    this.selectionStore = SelectionStore;
    this.bindingEngine = bindingEngine;
    this.eventAggregator = eventAggregator;
    this.columnStore = ColumnStore;
    this.uiStore = UIStore;

    this.highlightedIndex = null;

    this.updateTimeframe();

    this.isLoading = false;
    this.isUpdating = true;
    this.isFirstLoad = true;
    this.maxTableHeight = 0;

    this.isSyncingPinned = false;
    this.isSyncingUnpinned = false;
    this.syncPinnedLatch = decayingLatch(
      () => { this.isSyncingPinned = true; },
      () => { this.isSyncingPinned = false; },
      500
    );
    this.syncUnpinnedLatch = decayingLatch(
      () => { this.isSyncingUnpinned = true; },
      () => { this.isSyncingUnpinned = false; },
      500
    );

    this.pinnedRowContainerScroll = () => {
      if (this.unpinnedDataGridData && this.pinnedDataGridData && !this.isSyncingUnpinned) {
        this.unpinnedDataGridData.scrollTop = this.pinnedDataGridData.scrollTop;
        this.syncPinnedLatch();
      }
    };
    this.unpinnedRowContainerScroll = () => {
      if (this.pinnedDataGridData && this.unpinnedDataGridData && !this.isSyncingPinned) {
        this.pinnedDataGridData.scrollTop = this.unpinnedDataGridData.scrollTop;
        this.syncUnpinnedLatch();
      }
    };

    this.percentShownBeforeFetch = 60;
    this.lastScrollPosition = 0;
    this.scrollDebounceInterval = 250;

    // Dynamic Row rendering
    this.maxRowsPerScreen = 20;
    this.startRow = 0;
    this.endRow = 19;

    this.hasResults = null;
    this.lastIntervalHeaders = {};
    this.lastDateRange = {};

    this.records = [];

    this.scrollSync = this.scrollSync.bind(this);
    this.scrollDebounce = debounce(this.onScroll.bind(this), this.scrollDebounceInterval);
    this.scroll = this.scroll.bind(this);
    this.recalculateRows = this.recalculateRows.bind(this);
    this.calculateMaxTableHeight = debounce(this.calculateMaxTableHeight.bind(this));
    this.indeterminate = {
      indeterminate: false,
      checked: false
    };

    this.updateAllSelected();
  }

  onWindowResize() {
    this.recalculateRows();
    this.calculateMaxTableHeight();
  }

  scrollTop() {
    if (this.dataStore.offset === 0 && this.unpinnedDataGridData) {
      this.unpinnedDataGridData.scrollTop = 0;
    }
  }

  onColumnSorted(column) {
    this.eventAggregator.publish(GLOBAL_EVENTS.COLUMN_SORTED, column);
  }

  onColumnRemoved(column) {
    this.eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_REMOVED, [column]);
  }

  onColumnPinned(column) {
    this.eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, column);
  }

  onColumnUnpinned(column) {
    this.eventAggregator.publish(GLOBAL_EVENTS.COLUMN_UNPINNED, column);
  }

  onColumnMovedLeft(column) {
    this.eventAggregator.publish(GLOBAL_EVENTS.COLUMN_MOVED_LEFT, column);
  }

  onColumnMovedRight(column) {
    this.eventAggregator.publish(GLOBAL_EVENTS.COLUMN_MOVED_RIGHT, column);
  }

  onViewChanged(view) {
    this.recalculateRows();
  }

  toKebabCase(str) {
    return formatKebabCase(str);
  }

  updateTimeframe() {
    this.dateRange = {
      start: this.timeframeStore.data.start,
      end: this.timeframeStore.data.end,
      interval: this.timeframeStore.data.interval
    };
  }

  getNumericalHeaders(dateRange = {}) {
    if (this.isDateRangeUpdated(dateRange)) {
      const getHeaders = getHeadersForInterval(dateRange.interval);

      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      this.lastIntervalHeaders = getHeaders(startDate, endDate).map(header => {
        header.type = 'numeric';
        return header;
      });
      this.lastDateRange = dateRange;
    }

    return this.lastIntervalHeaders;
  }

  isDateRangeUpdated(dateRange) {
    return (
      dateRange.interval !== this.lastDateRange.interval ||
      dateRange.start    !== this.lastDateRange.start    ||
      dateRange.end      !== this.lastDateRange.end
    );
  }

  generateGrid() {
    const numericalHeaders = this.getNumericalHeaders(this.dateRange);
    const nonNumericalHeaders = this.columnStore.getUnpinnedColumns();

    this.headers = nonNumericalHeaders.concat(numericalHeaders);
    this.groupHeaders = this.columnStore.getGroupHeaders();
    this.pinnedGroupHeaders = this.columnStore.getPinnedGroupHeaders();
    this.pinnedHeaders = this.columnStore.getPinnedColumns();
  }

  onDataChanged(newData, oldData) {
    this.isFirstLoad = false;

    const records = this.dataStore.data && this.dataStore.data.records ?
      this.dataStore.data.records : [];

    // Mix in the selection state from the selection store
    const selected = this.selectionStore.data.selected;
    this.records = records.map(record => ({
      ...record,
      checked: keyInSelection(selected, record.key)
    }));

    if(!newData) {
      if(this.rows) {
        this.isLoading = false;
        this.isUpdating = false;
        this.gridElementUnpinned.removeEventListener('scroll', this.scrollDebounce);
      }
      return;
    }

    if(newData.isUpdating) {
      this.isUpdating = true;
    }
    else {
      this.isUpdating = false;
      this.isLoading = false;
      this.refreshGrid();
    }
  }

  refreshGrid() {
    this.generateGrid();
    this.scrollTop();
    this.handleRowRendering(true);

    if (this.gridContainer) {
      this.gridContainer.addEventListener('scroll', this.scrollSync);
      this.gridContainer.addEventListener('scroll', this.scrollDebounce);
    }
  }

  onColumnsChanged() {
    this.refreshGrid();
  }

  handleRowRendering(force = false) {
    // Update the start / end for the dynamic row drawing
    // Find the midpoint
    const dataGridDataEl = this.pinnedDataGridData;
    const scrollTop = dataGridDataEl ? dataGridDataEl.scrollTop : 0;
    const oldStart = this.startRow;

    this.startRow = scrollTop === 0 ? 0 : Math.floor((scrollTop / ROW_HEIGHT) - (ROW_BUFFER));
    this.startRow = this.startRow < 0 ? 0 : this.startRow;
    this.endRow = this.startRow + (this.maxRowsPerScreen - 1);

    // Don't refresh unless we scrolled far enough
    if ((this.startRow !== oldStart) || force) {
      const dataStoreRecords = this.records;
      let rows = dataStoreRecords.slice(this.startRow, this.endRow);

      // Reset range if no data is available
      if (rows.length === 0) {
        this.startRow = 0;
        this.endRow = this.maxRowsPerScreen - 1;
      }

      this.rows = dataStoreRecords.slice(this.startRow, this.endRow).map(flattenDatapoints);
      this.hasResults = this.rows.length;

      if (this.gridElementPinned && this.gridElementUnpinned && this.pinnedTableGridResults && this.unpinnedTableGridResults) {
        this.gridElementPinned.style.top = `${this.startRow * ROW_HEIGHT}px`;
        this.gridElementUnpinned.style.top = `${this.startRow * ROW_HEIGHT}px`;
        this.pinnedTableGridResults.style.height = `${(dataStoreRecords.length * ROW_HEIGHT) - (this.startRow * ROW_HEIGHT)}px`;
        this.unpinnedTableGridResults.style.height = `${(dataStoreRecords.length * ROW_HEIGHT) - (this.startRow * ROW_HEIGHT)}px`;
      }
    }
  }

  scroll() {
    this.eventAggregator.publish(GLOBAL_EVENTS.DATA_GRID_SCROLL);
    this.handleRowRendering();
  }

  recalculateRows() {
    if (this.dataGridsContainer && this.dataGridsContainer.clientHeight) {
      const containerHeight = this.dataGridsContainer.clientHeight;
      this.maxRowsPerScreen = Math.ceil(((containerHeight / ROW_HEIGHT) + ROW_BUFFER));
      this.handleRowRendering(true);
    }
  }

  calculateMaxTableHeight() {
    const subHeaderHeight = document.querySelector('.sub-header').offsetHeight;
    const topHeaderHeight = document.querySelector('.tool-name-header').offsetHeight;
    const tableHeaderHeight = document.querySelector('.data-grid-heading').offsetHeight;
    this.maxTableHeight = subHeaderHeight + topHeaderHeight + tableHeaderHeight;
  }

  attached() {
    this.gridContainer = this.gridElementUnpinned.parentElement.parentElement;
    this.gridContainer.addEventListener('scroll', this.scrollSync);
    this.gridContainer.addEventListener('scroll', this.scrollDebounce);
    this.gridContainer.addEventListener('scroll', this.scroll);
    this.subscriptions = [
      this.columnStore.subscribe(this.onColumnsChanged.bind(this)),
      this.timeframeStore.subscribe(this.updateTimeframe.bind(this)),
      this.dataStore.subscribe(this.onDataChanged.bind(this)),
      this.eventAggregator.subscribe(GLOBAL_EVENTS.VIEW_CHANGED, this.onViewChanged.bind(this)),
      this.selectionStore.subscribe(this.updateAllSelected.bind(this)),
      this.uiStore.subscribe(this.calculateMaxTableHeight.bind(this))
    ];
    window.addEventListener('resize', this.onWindowResize.bind(this));

    this.element.style.visibility = 'hidden';

    // Restore the grid content if the user navigated away (like help pages)
    if (this.dataStore.data && this.dataStore.data.records) {
      this.onDataChanged(this.dataStore.data);
    }

    this.columnSizingPolling = setInterval(() => {
      this.size();
    }, COLUMN_SIZING_POLL_INTERVAL);

    this.calculateMaxTableHeight();
  }

  detached() {
    this.gridElementUnpinned.removeEventListener('scroll', this.scrollDebounce);
    this.gridElementUnpinned.removeEventListener('scroll', this.scrollSync);
    this.gridElementUnpinned.removeEventListener('scroll', this.scroll);
    this.subscriptions.forEach(subscription => { subscription.dispose(); });
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    clearInterval(this.columnSizingPolling);
  }

  paginate() {
    if (!this.isLoading) {
      this.isLoading = true;

      this.gridElementUnpinned.removeEventListener('scroll', this.scrollDebounce);
      this.eventAggregator.publish(DataStoreEvents.FETCH_NEXT_PAGE);
    }
  }

  checkForMoreData() {
    const targetRowIndex = Math.floor(this.dataStore.data.records.length * (this.percentShownBeforeFetch / 100));
    const targetOffset = targetRowIndex * ROW_HEIGHT;

    if (targetOffset < this.gridContainer.scrollTop) {
      this.paginate();
    }
  }

  onScroll() {
    if (!this.dataStore.data) {
      return;
    }

    // Fire a final scroll event to make sure we re-calculate the rendered rows
    // when scrolling is finished
    this.scroll();

    const currentScrollPosition = this.gridContainer.scrollTop;
    if (currentScrollPosition > this.lastScrollPosition) {
      this.checkForMoreData();
    }
    this.lastScrollPosition = currentScrollPosition;
  }

  scrollSync() {
    this.unpinnedDataGridHeading.scrollLeft = this.unpinnedDataGridData.scrollLeft;
  }

  size() {
    resizeGridHeaders(this.unpinnedDataGrid);
    resizeGridHeaders(this.pinnedDataGrid);

    syncScrollRows(this.pinnedDataGridData, this.unpinnedDataGridData, this.pinnedRowContainerScroll, this.unpinnedRowContainerScroll);
    syncHeightRows(this.unpinnedDataGridData, this.pinnedDataGridData);

    this.element.style.visibility = 'visible';
  }

  toggleSelected() {
    if (this.allSelected) {
      // this.dataStore.data.records.forEach((r) => { r.checked = false; });
      this.eventAggregator.publish(SELECTION_EVENTS.CLEAR_SELECTION);
    } else {
      // this.dataStore.data.records.forEach((r) => { r.checked = true; });
      this.eventAggregator.publish(SELECTION_EVENTS.SELECT_ALL, this.dataStore.data.records.map(record => record.key));
    }
    this.updateAllSelected();
  }

  updateAllSelected() {
    const dataStoreRecords = this.records;
    dataStoreRecords.forEach(record => {
      record.checked = keyInSelection(this.selectionStore.data.selected, record.key);
    });
    const someSelected = dataStoreRecords.some(r => r.checked);
    this.allSelected = dataStoreRecords.every(r => r.checked);
    // If not all is selected, but only some, set indeterminate state on select all checkbox
    if (!this.allSelected && someSelected) {
      this.indeterminate.indeterminate = true;
      this.indeterminate.checked = false;
    }
    else if(this.allSelected) {
      this.indeterminate.indeterminate = false;
      this.indeterminate.checked = true;
    }
    else {
      this.indeterminate.indeterminate = false;
      this.indeterminate.checked = false;
    }
    this.calculateMaxTableHeight();
  }

  rowSelectionChanged(row, event) {
    this.eventAggregator.publish(SELECTION_EVENTS.TOGGLE_SELECTION, [row.key]);
  }

  rowsChanged() {
    this.updateAllSelected();
  }
}
