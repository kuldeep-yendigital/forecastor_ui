import * as GLOBAL_EVENTS from '../events';
import { ColumnStore, COLUMNS, DEFAULT_VISIBLE_COLUMNS } from './columnStore';
import { EventAggregator} from 'aurelia-event-aggregator';
import {HashStateStore} from './hashStateStore';
import {Container} from 'aurelia-dependency-injection';
import MockStore, {BindingEngineMock, GenericServiceMock} from '../../test/unit/helpers/mock-store';

describe('Column Store', () => {
  let store;
  let columns;
  let eventAggregator;
  let hashStateStoreMockData;

  beforeEach(() => {
    hashStateStoreMockData = {};

    let container = new Container().makeGlobal();
    eventAggregator = new EventAggregator();

    let hashStateStore = new MockStore(null, hashStateStoreMockData);
    container.registerInstance(HashStateStore, hashStateStore);

    store = new ColumnStore({
      pushEvent: () => {}
    }, BindingEngineMock, eventAggregator, GenericServiceMock);
    columns = COLUMNS.map(column => {
      if(DEFAULT_VISIBLE_COLUMNS.includes(column.key)) {
        column.checked = true;
      } else {
        column.checked = false;
      }
      return column;
    });
  });


  it('returns default state', () => {
    expect(store.getDefaultState()).toEqual(jasmine.objectContaining({
      visible: [
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
      ]
    }));
  });

  describe('Adding column', () => {
    it('can add a single column', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_ADDED, ['serviceslevel2']);
      expect(store.data.columns.filter(f => f.key === 'serviceslevel2')[0].checked).toEqual(true);
    });
  });

  describe('Deleting Columns', () => {
    it('can delete single column', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_REMOVED, ['company']);
      expect(store.data.columns.filter(f => f.label === 'company')[0].checked).toEqual(false);
    });

    it('cannot delete metric level column', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_REMOVED, ['metriclevel2']);
      expect(store.data.columns).toEqual(columns);
    });

    it('cannot delete datasetlevel2 column', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_REMOVED, ['datasetlevel2']);
      expect(store.data.columns).toEqual(columns);
    });

    it('can delete nested column', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_REMOVED, ['geographylevel1']);
      expect(store.data.columns.filter(f => f.key === 'geographylevel1')[0].checked).toEqual(false);
    });

    it('can delete nested column with different field value (technology)', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_REMOVED, ['technologylevel1']);
      expect(store.data.columns.filter(f => f.key === 'technologylevel1')[0].checked).toEqual(false);
    });

    it('can delete nested column with different field value (billingtype)', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_REMOVED, ['billingtypelevel2']);
      expect(store.data.columns.filter(f => f.key === 'billingtypelevel2')[0].checked).toEqual(false);
    });

  });

  describe('Pinning Columns', () => {
    it('there shouldn\'t be any pinned columns by default', () => {
      expect(store.getPinnedColumns()).toEqual([]);
      expect(store.getPinnedGroupHeaders()).toEqual([]);
    });

    it('should set column as pinned when COLUMN_PINNED event received', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'serviceslevel2');
      expect(getPinnedColumnNames()).toEqual(['level2']);
      expect(getPinnedGroupNames()).toEqual(['services']);
    });

    it('should not show pinned columns as not pinned columns', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'serviceslevel2');
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'serviceslevel3');
      expect(getUnpinnedColumnNames()).not.toContain('serviceslevel2');
      expect(getUnpinnedColumnNames()).not.toContain('serviceslevel3');
      expect(getUnpinnedGroupNames()).not.toContain('services');
    });

    it('should set column as pinned also for readonly columns', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'datasetlevel2');
      expect(getPinnedColumnNames()).toEqual(['level2']);
      expect(getPinnedGroupNames()).toEqual(['dataset']);
    });

    it('shouldn\'t show column as pinned after removing it', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'serviceslevel2');
      expect(getPinnedColumnNames()).toEqual(['level2']);
      expect(getPinnedGroupNames()).toEqual(['services']);

      eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_REMOVED, ['serviceslevel2']);
      expect(getPinnedColumnNames()).toEqual([]);
      expect(getPinnedGroupNames()).toEqual([]);
    });

    it('should keep pinned column pinned after removing and adding it back', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'serviceslevel2');
      eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_REMOVED, ['serviceslevel2']);
      eventAggregator.publish(GLOBAL_EVENTS.COLUMNS_ADDED, ['serviceslevel2']);
      expect(getPinnedColumnNames()).toEqual(['level2']);
      expect(getPinnedGroupNames()).toEqual(['services']);
    });

    it('should keep pin order', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'datasetlevel2');
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'serviceslevel3');

      expect(getPinnedColumnNames()).toEqual(['level2', 'level3']);
      expect(getPinnedGroupNames()).toEqual(['dataset', 'services']);
    });

    it('should keep pin order but still columns grouped', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'geographylevel1');
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'datasetlevel2');
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'geographylevel2');
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'geographylevel3');
      expect(getPinnedColumnNames()).toEqual(['region', 'subregion', 'country', 'level2']);
      expect(getPinnedGroupNames()).toEqual(['geography', 'dataset']);
    });
  });

  describe('Unpinning Columns', () => {
    it('should set column as unpinned when COLUMN_UNPINNED event received', () => {
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_PINNED, 'serviceslevel2');
      expect(getPinnedColumnNames()).toEqual(['level2']);
      expect(getPinnedGroupNames()).toEqual(['services']);
      eventAggregator.publish(GLOBAL_EVENTS.COLUMN_UNPINNED, 'level2');
      expect(getPinnedColumnNames()).toEqual([]);
      expect(getPinnedGroupNames()).toEqual([]);
    });
  });

  const getPinnedColumnNames = () => store.getPinnedColumns().map(x => x.label);
  const getPinnedGroupNames = () => store.getPinnedGroupHeaders().map(x => x.label);

  const getUnpinnedColumnNames = () => store.getUnpinnedColumns().map(x => x.label);
  const getUnpinnedGroupNames = () => store.getGroupHeaders().map(x => x.label);
});
