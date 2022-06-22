import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import * as GLOBAL_EVENTS from '../../../events';
import {TimeframeStore} from '../../../stores/timeframeStore';
import Store from '../../../stores/store';

describe('Timeframe panel', () => {

  let component;
  let model;
  let setDateSpy;
  let startDate;
  let endDate;
  let interval;

  class mockStore extends Store {
    get EVENTS() {
      return [];
    }

    getDefaultState() {
      return {
        interval: interval,
        start: startDate,
        end: endDate
      };
    }

    name() { return 'timeframe'; }
  }

  beforeEach((done) => {
    startDate = new Date(Date.parse('Dec 31, 2000 UTC'));
    endDate = new Date(Date.parse('Dec 31, 2010 UTC'));

    interval = 'yearly';

    model = {};

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/panels/timeframe-panel/index'))
      .inView('<timeframe-panel></timeframe-panel>')
      .boundTo(model);

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerSingleton(TimeframeStore, mockStore);
    });

    component.create(bootstrap).then(() => {
      setDateSpy = spyOn(component.viewModel, 'setDate').and.callThrough();
      component.viewModel.activate(model);
      done();
    }).catch(done.fail);
  });

  afterEach(() => component.dispose());

  describe('activate', () => {
    it('should call setDate', () => {
      expect(setDateSpy).toHaveBeenCalled();
    });

    it('should set initial state', () => {
      expect(component.viewModel.start).toEqual(startDate);
      expect(component.viewModel.end).toEqual(endDate);
      expect(component.viewModel.interval).toBe(interval);
    });
  });

  describe('onDateUpdated', () => {
    it('should publish an event', done => {
      const newDate = Date.parse('Dec 31, 2005 UTC');
      const publishSpy = spyOn(component.viewModel.eventAggregator, 'publish');
      component.viewModel.onDateUpdated({
        name: 'start',
        value: newDate
      });

      setImmediate(() => {
        expect(component.viewModel.start).toEqual(newDate);
        expect(publishSpy).toHaveBeenCalledWith(GLOBAL_EVENTS.TIMEFRAME_UPDATED, {
          interval: interval,
          start: newDate,
          end: endDate
        });
        done();
      });
    });
  });

  describe('onIntervalUpdated', () => {
    it('should publish an event', done => {
      const publishSpy = spyOn(component.viewModel.eventAggregator, 'publish');
      component.viewModel.onIntervalUpdated('quarterly');

      setImmediate(() => {
        expect(component.viewModel.interval).toEqual('quarterly');
        expect(publishSpy).toHaveBeenCalledWith(GLOBAL_EVENTS.TIMEFRAME_UPDATED, {
          interval: 'quarterly',
          start: startDate,
          end: endDate,
          intervalChange: true
        });
        done();
      });
    });
  });
});
