import Store from './store';
import * as GLOBAL_EVENTS from '../events';
import { HashStateStore } from './hashStateStore';
import findLastIndex from 'lodash/findLastIndex';
import includes from 'lodash/includes';
import { AnalyticsService } from '../services/analyticsService';

const ANALYTICS = AnalyticsService.register({
  COLUMNS_ADDED: GLOBAL_EVENTS.COLUMNS_ADDED,
  COLUMNS_REMOVED: GLOBAL_EVENTS.COLUMNS_REMOVED
});

// TODO: Should be driven from the API
export const COLUMNS = [
  {label: 'region', key: 'geographylevel1', parent: 'geography', calculatedMetricColumn: true},
  {label: 'subregion', key: 'geographylevel2', parent: 'geography', calculatedMetricColumn: true},
  {label: 'country', key: 'geographylevel3', parent: 'geography', calculatedMetricColumn: true},
  {label: 'company', key: 'companyname', parent: 'company', calculatedMetricColumn: true},
  {label: 'level1', key: 'serviceslevel1', parent: 'services', calculatedMetricColumn: true},
  {label: 'level2', key: 'serviceslevel2', parent: 'services', calculatedMetricColumn: true},
  {label: 'level3', key: 'serviceslevel3', parent: 'services', calculatedMetricColumn: true},
  {label: 'level4', key: 'serviceslevel4', parent: 'services', calculatedMetricColumn: true},
  {label: 'level5', key: 'serviceslevel5', parent: 'services', calculatedMetricColumn: true},
  {label: 'level6', key: 'serviceslevel6', parent: 'services', calculatedMetricColumn: true},
  {label: 'level1', key: 'technologylevel1', parent: 'technology', calculatedMetricColumn: true},
  {label: 'level2', key: 'technologylevel2', parent: 'technology', calculatedMetricColumn: true},
  {label: 'level3', key: 'technologylevel3', parent: 'technology', calculatedMetricColumn: true},
  {label: 'level4', key: 'technologylevel4', parent: 'technology', calculatedMetricColumn: true},
  {label: 'level5', key: 'technologylevel5', parent: 'technology', calculatedMetricColumn: true},
  {label: 'level6', key: 'technologylevel6', parent: 'technology', calculatedMetricColumn: true},
  {label: 'level1', key: 'networkstatuslevel1', parent: 'networkstatus'},
  {label: 'level2', key: 'networkstatuslevel2', parent: 'networkstatus'},
  {label: 'level3', key: 'networkstatuslevel3', parent: 'networkstatus'},
  {label: 'level4', key: 'networkstatuslevel4', parent: 'networkstatus'},
  {label: 'level5', key: 'networkstatuslevel5', parent: 'networkstatus'},
  {label: 'level6', key: 'networkstatuslevel6', parent: 'networkstatus'},
  {label: 'level1', key: 'channellevel1', parent: 'channel'},
  {label: 'level2', key: 'channellevel2', parent: 'channel'},
  {label: 'level3', key: 'channellevel3', parent: 'channel'},
  {label: 'level4', key: 'channellevel4', parent: 'channel'},
  {label: 'level1', key: 'devicelevel1', parent: 'device'},
  {label: 'level2', key: 'devicelevel2', parent: 'device'},
  {label: 'level3', key: 'devicelevel3', parent: 'device'},
  {label: 'level4', key: 'devicelevel4', parent: 'device'},
  {label: 'level5', key: 'devicelevel5', parent: 'device'},
  {label: 'priceband', key: 'priceband', parent: 'priceband'},
  {label: 'level1', key: 'platformlevel1', parent: 'platform'},
  {label: 'level2', key: 'platformlevel2', parent: 'platform'},
  {label: 'level3', key: 'platformlevel3', parent: 'platform'},
  {label: 'level4', key: 'platformlevel4', parent: 'platform'},
  {label: 'level1', key: 'customertypelevel1', parent: 'customertype'},
  {label: 'level2', key: 'customertypelevel2', parent: 'customertype'},
  {label: 'level3', key: 'customertypelevel3', parent: 'customertype'},
  {label: 'level4', key: 'customertypelevel4', parent: 'customertype'},
  {label: 'level1', key: 'industrylevel1', parent: 'industry'},
  {label: 'level2', key: 'industrylevel2', parent: 'industry'},
  {label: 'level3', key: 'industrylevel3', parent: 'industry'},
  {label: 'level4', key: 'industrylevel4', parent: 'industry'},
  {label: 'level1', key: 'billingtypelevel1', parent: 'billingtype', calculatedMetricColumn: true},
  {label: 'level2', key: 'billingtypelevel2', parent: 'billingtype', calculatedMetricColumn: true},
  {label: 'level3', key: 'billingtypelevel3', parent: 'billingtype', calculatedMetricColumn: true},
  {label: 'level4', key: 'billingtypelevel4', parent: 'billingtype', calculatedMetricColumn: true},
  {label: 'level5', key: 'billingtypelevel5', parent: 'billingtype', calculatedMetricColumn: true},
  {label: 'level6', key: 'billingtypelevel6', parent: 'billingtype', calculatedMetricColumn: true},
  {label: 'level1', key: 'datasetlevel1', parent: 'dataset'},
  {label: 'level2', key: 'datasetlevel2', parent: 'dataset', readOnly: true},
  {label: 'level3', key: 'datasetlevel3', parent: 'dataset', readOnly: true},
  {label: 'level1', key: 'metriclevel1', parent: 'metric', readOnly: true},
  {label: 'level2', key: 'metriclevel2', parent: 'metric', readOnly: true},
  {label: 'unit', key: 'unit', parent: 'metric', readOnly: true},
  {label: 'indicator', key: 'metricindicator', parent: 'metric', readOnly: true},
  {label: 'currency', key: 'currency', parent: 'currency', readOnly: true},
  {label: 'exchange', key: 'exchangeratedate', parent: 'exchangeratedate'},
  {label: 'scenario', key: 'scenario', parent: 'scenario'},
  {label: 'published', key: 'publisheddate', parent: 'published'},
  {label: 'source', key: 'source', parent: 'source'}
];

// TODO: Need an API / config per product?
export const DEFAULT_VISIBLE_COLUMNS = [
  'geographylevel1',
  'geographylevel2',
  'geographylevel3',
  'serviceslevel2',
  'serviceslevel3',
  'datasetlevel2',
  'datasetlevel3',
  'metriclevel1',
  'metriclevel2',
  'unit',
  'metricindicator',
  'currency'
];
const DEFAULT_PINNED_COLUMNS = [];

const applyCheckedState = (columns, checkedColumnKeys) =>
  columns.map(column => ({
    ...column,
    checked: column.readOnly || includes(checkedColumnKeys, column.key)
  }));

const swapSortedColumns = (columns, sortedColumns) =>
  columns.reduce(({ result, remainingSortedColumns }, column) =>
    includes(sortedColumns, column) ? ({
      result: [ ...result, remainingSortedColumns[0] ],
      remainingSortedColumns: remainingSortedColumns.slice(1)
    }) : ({
      result: [ ...result, column ],
      remainingSortedColumns
    }), { result: [], remainingSortedColumns: sortedColumns }).result;

const arrayAfter = (index, length) =>
  index !== -1 ? index + 1 : length;

const arrayInsert = (arr, i, item) =>
  arr.slice(0, i).concat(item, arr.slice(i));

const swapPinnedColumns = (data, source, target) => ({
  ...data,
  pinned: data.pinned.map(key =>
    (key === source.key) ? target.key : (key === target.key) ? source.key : key)
});

const swapUnpinnedColumns = (data, source, target) => ({
  ...data,
  columns: data.columns.map(column =>
    (column === source) ? target : (column === target) ? source : column)
});

const swapColumns = (data, source, target) =>
  (includes(data.pinned, source.key)) ?
    swapPinnedColumns(data, source, target) :
    swapUnpinnedColumns(data, source, target);

const getState = data => {
  const visibleColumns = (data && data.columnKeys) ?
    data.columnKeys :
    DEFAULT_VISIBLE_COLUMNS;
  const pinnedColumns = (data && data.pinned) ?
    data.pinned :
    DEFAULT_PINNED_COLUMNS;
  const columns = applyCheckedState(COLUMNS, visibleColumns);
  const sortedColumns = visibleColumns.map(key => columns.find(column => column.key === key));
  return {
    columns: swapSortedColumns(columns, sortedColumns),
    visible: visibleColumns,
    pinned: pinnedColumns
  };
};

const getGroupHeadersFromColumns = columns =>
  columns
    .reduce((groups, column, index, data) => {
      const id = column.parent;
      const prev = data[index - 1];
      const prevId = prev ? prev.parent : null;
      const prevGroup = groups[groups.length - 1];

      return (id === prevId) ?
        groups.slice(0, groups.length - 1).concat([ {
          ...prevGroup,
          columnCount: prevGroup.columnCount + 1
        } ]) :
        groups.concat([ { key: id, columnCount: 1 } ]);
    }, [])
    .map(({ key, columnCount }) => ({
      key,
      label: key,
      colspan: columnCount
    }));

export class ColumnStore extends Store {

  get STORES() {
    return [
      HashStateStore
    ];
  }

  onStoreChange(data, store) {
    switch (store) {
    case HashStateStore:
      this.updateState({
        readOnly: data.readOnly,
        columnKeys: data.query && data.query.columnKeys,
        pinned: data.pinned
      });
      break;
    }
  }

  get EVENTS() {
    return [
      GLOBAL_EVENTS.COLUMNS_ADDED,
      GLOBAL_EVENTS.COLUMNS_REMOVED,
      GLOBAL_EVENTS.COLUMN_PINNED,
      GLOBAL_EVENTS.COLUMN_UNPINNED,
      GLOBAL_EVENTS.COLUMN_MOVED_LEFT,
      GLOBAL_EVENTS.COLUMNS_READONLY_ON,
      GLOBAL_EVENTS.COLUMNS_READONLY_OFF,
      GLOBAL_EVENTS.COLUMN_MOVED_RIGHT,
      GLOBAL_EVENTS.CALCULATED_METRIC_SELECTED
    ];
  }

  static inject() {
    return [AnalyticsService];
  }

  constructor(analyticsService, ...rest) {
    super(...rest);
    this.analyticsService = analyticsService;
  }

  getDefaultState() {
    return getState({
      columnKeys: this.stores.HashStateStore.data.query && this.stores.HashStateStore.data.query.columnKeys,
      pinned: this.stores.HashStateStore.data.pinned
    });
  }

  updateState(data) {
    this.data = getState(data);

    // update readonly columns
    this.data = { ...this.data, columns: this.data.columns.map(col => {
      if(data.readOnly && data.readOnly.includes(col.key)) {
        return { ...col, readOnly: true };
      }
      return col;
    }) };
  }

  getColumns() {
    return this.data.columns.filter(c => c.checked);
  }

  getColumnByKey(key) {
    return this.data.columns.find(c => c.key === key);
  }

  getColumnByLabelOrKey(key) {
    return this.data.columns.find(c => c.label === key || c.key === key);
  }

  getLeftMostColumn() {
    return this.getColumns()[0];
  }

  getPinnedColumns() {
    const columns = this.getColumns();
    return this.data.pinned.map(k => columns.find(c => c.key === k)).filter(c => c);
  }

  getUnpinnedColumns() {
    return this.getColumns().filter(c => !includes(this.data.pinned, c.key));
  }

  getGroups() {
    const groupDict = this.data.columns.reduce((groups, c) => {
      const group = groups[c.parent] || { key: c.parent, label: c.parent, columnCount: 0 };
      if (c.checked && !includes(this.data.pinned, c.key)) {
        group.columnCount++;
      }
      return Object.assign(groups, {[c.parent]: group});
    }, {});
    return Object.keys(groupDict).map(key => groupDict[key]);
  }

  getPinnedGroups() {
    const groupDict = this.data.columns.reduce((groups, c) => {
      const group = groups[c.parent] || { key: c.parent, label: c.parent, columnCount: 0 };
      if (c.checked && includes(this.data.pinned, c.key)) {
        group.columnCount++;
      }
      return Object.assign(groups, {[c.parent]: group});
    }, {});
    return Object.keys(groupDict).map(key => groupDict[key]);
  }

  getGroupHeaders() {
    return getGroupHeadersFromColumns(this.getUnpinnedColumns());
  }

  getPinnedGroupHeaders() {
    return getGroupHeadersFromColumns(this.getPinnedColumns());
  }

  setReadOnly(column, isReadOnly) {
    const columnArr = Array.isArray(column) ? column : [column];

    for(let id of columnArr) {
      const source = this.getColumnByLabelOrKey(id);
      if (!source) throw new Error('No source column found.');
    }

    this.data = { ...this.data, columns: this.data.columns.map(col => {
      if(columnArr.includes(col.key)) {
        return { ...col, readOnly: isReadOnly };
      }
      return col;
    }) };
  }

  onEvent(data, event) {
    switch (event) {
    case GLOBAL_EVENTS.COLUMNS_ADDED:
      data.forEach(this.updateColumn(c => c.checked = true));
      this.analyticsService.pushEvent(ANALYTICS.COLUMNS_ADDED, {
        dimensions: data
      });
      break;
    case GLOBAL_EVENTS.COLUMNS_REMOVED:
      data.forEach(this.updateColumn(c => c.checked = c.readOnly ? true : false));
      this.analyticsService.pushEvent(ANALYTICS.COLUMNS_REMOVED, {
        dimensions: data
      });
      break;
    case GLOBAL_EVENTS.COLUMN_PINNED:
      this.pinColumn(data);
      break;
    case GLOBAL_EVENTS.COLUMN_UNPINNED:
      this.unpinColumn(data);
      break;
    case GLOBAL_EVENTS.COLUMN_MOVED_LEFT:
      this.moveColumnLeft(data);
      break;
    case GLOBAL_EVENTS.COLUMNS_READONLY_ON:
      this.setReadOnly(data, true);
      break;
    case GLOBAL_EVENTS.COLUMNS_READONLY_OFF:
      this.setReadOnly(data, false);
      break;
    case GLOBAL_EVENTS.COLUMN_MOVED_RIGHT:
      this.moveColumnRight(data);
      break;
    case GLOBAL_EVENTS.CALCULATED_METRIC_SELECTED:
      this.selectCalculatedMetricColumns(data);
      break;
    }
  }

  selectCalculatedMetricColumns = () => {
    COLUMNS.filter(x => x.calculatedMetricColumn)
      .map(x => x.key)
      .forEach(this.updateColumn(c => c.checked = true));
  };

  updateColumn = fn => columnId => {
    this.data = { ...this.data, columns: this.data.columns.map(column => {
      if ((column.label === columnId || column.key === columnId)) {
        fn(column);
      }
      return column;
    }) };
  }

  pinColumn(columnId) {
    const targetColumn = this.getColumnByLabelOrKey(columnId);
    const pinnedColumns = this.getPinnedColumns();
    const lastSiblingIndex = findLastIndex(pinnedColumns, c => c.parent === targetColumn.parent);
    const insertIndex = arrayAfter(lastSiblingIndex, this.data.pinned.length);
    this.data = { ...this.data, pinned: arrayInsert(this.data.pinned, insertIndex, targetColumn.key) };
  }

  unpinColumn(columnId) {
    const targetColumn = this.getColumnByLabelOrKey(columnId);
    this.data = { ...this.data, pinned: this.data.pinned.filter(c => c !== targetColumn.key) };
  }

  isMoveableLeft(columnId) {
    const source = this.getColumnByLabelOrKey(columnId);
    return source && !!this.findLeftBound(source);
  }

  isMoveableRight(columnId) {
    const source = this.getColumnByLabelOrKey(columnId);
    return source && !!this.findRightBound(source);
  }

  findBound(column, forward) {
    const columns = includes(this.data.pinned, column.key) ?
      this.getPinnedColumns() :
      this.getUnpinnedColumns();
    const index = columns.indexOf(column);
    return forward ? columns[index + 1] : columns[index - 1];
  }

  findLeftBound(columnId) {
    return this.findBound(columnId, false);
  }

  findRightBound(columnId) {
    return this.findBound(columnId, true);
  }

  moveColumnLeft(columnId) {
    const source = this.getColumnByLabelOrKey(columnId);
    if (!source) throw new Error('No source column found.');
    const target = this.findLeftBound(source);
    this.data = swapColumns(this.data, source, target);
  }

  moveColumnRight(columnId) {
    const source = this.getColumnByLabelOrKey(columnId);
    if (!source) throw new Error('No source column found.');
    const target = this.findRightBound(source);
    this.data = swapColumns(this.data, source, target);
  }
}
