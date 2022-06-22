import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import { EVENTS as IntervalSelectorEvents } from './index';

describe('Interval selector', () => {

  let component;
  let bindings;

  beforeEach((done) => {
    const d = new Date();
    d.setTime(Date.parse('Dec 31, 2000 UTC'));
    bindings = {
      defaInterval: 'quarterly'
    };

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/interval-selector/index'))
      .inView('<interval-selector selected-interval.bind="selectedInterval"></interval-selector>')
      .boundTo(bindings);

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Rendering', () => {
    it('should render 2 options', () => {
      const options = document.querySelectorAll('[data-selector="timeframe-option-label"]');
      expect(options.length).toEqual(2);
    });
  });

  describe('Interaction', () => {
    let quarterlyOption, yearlyOption;

    beforeEach(() => {
      quarterlyOption = document.querySelector('[data-selector*="timeframe-option-quarterly"]');
      yearlyOption = document.querySelector('[data-selector*="timeframe-option-yearly"]');
    });

    it('should publish event on click and display progress bar', done => {
      const publishSpy = spyOn(component.viewModel.eventAggregator, 'publish');
      quarterlyOption.click();
      setImmediate(() => {
        expect(publishSpy).toHaveBeenCalledWith(IntervalSelectorEvents.ONINTERVALCHANGE, 'quarterly');
        done();
      });
    });

    it('shows updating along with data store', done => {
      expect(component.viewModel.isIntervalUpdating).toBeFalsy();
      component.viewModel.dataStore.data = {
        ...component.viewModel.dataStore.data,
        isUpdating: true
      };
      setImmediate(() => {
        expect(component.viewModel.isIntervalUpdating).toBeTruthy();
        component.viewModel.dataStore.data = {
          ...component.viewModel.dataStore.data,
          isUpdating: false
        };
        setImmediate(() => {
          expect(component.viewModel.isIntervalUpdating).toBeFalsy();
          done();
        });
      });
    });
  });

});
