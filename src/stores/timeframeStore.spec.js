import { DEFAULTS, TIMEFRAME, TimeframeStore } from './timeframeStore';
import * as GLOBAL_EVENTS from '../events';
import { Container } from 'aurelia-dependency-injection';
import { FakeBindingEngine, FakeLoggerService } from '../../test/unit/helpers/fakes';
import Store from './store';
import { HashStateStore } from './hashStateStore';

describe('timeframeStore', () => {

  let timeframeStore, BindingEngineMock, EventAggregatorMock, GenericServiceMock;
  let hashStateStore;
  let hashStateStoreMockData;

  class MockHashStateStore extends Store {
    get EVENTS() {
      return [];
    }

    getDefaultState() {
      return hashStateStoreMockData;
    }
  }

  beforeEach(() => {
    let container = new Container().makeGlobal();
    hashStateStoreMockData = {};

    hashStateStore = new MockHashStateStore(BindingEngineMock, EventAggregatorMock, GenericServiceMock);

    container.registerInstance(HashStateStore, hashStateStore);

    BindingEngineMock = new FakeBindingEngine();

    EventAggregatorMock = {
      subscribe: ()=> {}
    };
    GenericServiceMock = {
    };
    timeframeStore = new TimeframeStore({
      pushEvent: () => {}
    }, new FakeLoggerService(), BindingEngineMock, EventAggregatorMock, GenericServiceMock);
  });

  it('should have yearly interval as default', () => {
    expect(timeframeStore.data.interval).toEqual(TIMEFRAME.INTERVAL.YEARLY);
  });

  it(`should have start date in the beginning of the year "${new Date().getFullYear() - DEFAULTS.OFFSET_START_YEARS}"`, () => {
    const startDate = new Date(timeframeStore.data.start);
    const currentYear = new Date().getFullYear();
    expect(startDate.getFullYear()).toEqual(currentYear - DEFAULTS.OFFSET_START_YEARS);
    expect(startDate.getMonth()).toEqual(TIMEFRAME.MONTH.JANUARY);
    expect(startDate.getDate()).toEqual(1);
  });

  it(`should have end date in the end of the year "${new Date().getFullYear() + DEFAULTS.OFFSET_END_YEARS}"`, () => {
    const endDate = new Date(timeframeStore.data.end);
    const currentYear = new Date().getFullYear();
    expect(endDate.getFullYear()).toEqual(currentYear + DEFAULTS.OFFSET_END_YEARS);
    expect(endDate.getMonth()).toEqual(TIMEFRAME.MONTH.DECEMBER);
    expect(endDate.getDate()).toEqual(31);
  });

  describe('IntervalChange', () => {

    let mockData = {};

    describe('yearly', () => {

      beforeEach(done => {
        mockData = {
          interval : TIMEFRAME.INTERVAL.YEARLY,
          start    : Date.parse('Mar 31, 2000 UTC'),
          end      : Date.parse('June 30, 2000 UTC')
        };

        timeframeStore.onEvent(mockData, GLOBAL_EVENTS.TIMEFRAME_UPDATED);
        setImmediate(done);
      });

      it('should set startdate to the first day of the year', () => {
        expect(timeframeStore.data.start).toEqual(Date.UTC(2000, 0, 1));
      });
      it('should set enddate to the last day of the year', () => {
        expect(timeframeStore.data.end).toEqual(Date.UTC(2000, 11, 31));
      });

      describe('when exceeding the maximum selectable timeframe', () => {
        beforeEach(done => {
          mockData = {
            interval : TIMEFRAME.INTERVAL.YEARLY,
            start    : Date.parse('Mar 31, 2000 UTC'),
            end      : Date.parse('June 30, 2020 UTC')
          };

          timeframeStore.onEvent(mockData, GLOBAL_EVENTS.TIMEFRAME_UPDATED);
          setImmediate(done);
        });

        it('should set a warning', () => {
          const warning = `The maximum selectable yearly timeframe is ${DEFAULTS.MAXIMUM_TIMERANGE_YEARS + 1} years.`;

          expect(timeframeStore.data.warnings[0]).toEqual(warning);
        });
      });
    });

    describe('quarterly', () => {
      beforeEach(done => {
        mockData = {
          interval : TIMEFRAME.INTERVAL.QUARTERLY,
          start    : Date.parse('Mar 22, 2000 UTC'),
          end      : Date.parse('June 12, 2000 UTC')
        };

        timeframeStore.onEvent(mockData, GLOBAL_EVENTS.TIMEFRAME_UPDATED);
        setImmediate(done);
      });

      it('should set start date to first day of the quarter', () => {
        expect(timeframeStore.data.start).toEqual(Date.UTC(2000, 0, 1));
      });
      it('should set end date to last day of the quarter', () => {
        expect(timeframeStore.data.end).toEqual(Date.UTC(2000, 5, 30));
      });

      describe('when exceeding the maximum selectable timeframe', () => {
        beforeEach(done => {
          mockData = {
            interval : TIMEFRAME.INTERVAL.QUARTERLY,
            start    : Date.parse('Mar 22, 2000 UTC'),
            end      : Date.parse('June 12, 2020 UTC')
          };

          timeframeStore.onEvent(mockData, GLOBAL_EVENTS.TIMEFRAME_UPDATED);
          setImmediate(done);
        });

        it('should set a warning', () => {
          const warning = `The maximum selectable quarterly timeframe is ${DEFAULTS.MAXIMUM_TIMERANGE_QUARTER} years.`;

          expect(timeframeStore.data.warnings[0]).toEqual(warning);
        });
      });
    });
  });
});
