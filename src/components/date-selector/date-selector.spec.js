import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

import { DEFAULTS, EVENTS as DateSelectorEvents } from './index';

describe('End Date selector', () => {

  let component;
  let bindings;
  let dateSelectorName;


  beforeEach((done) => {
    dateSelectorName = 'end';

    const d = new Date();
    d.setTime(Date.parse('Dec 31, 2000 UTC'));
    bindings = {
      date: d.getTime(),
      interval: 'quarterly'
    };


    component = StageComponent
      .withResources(PLATFORM.moduleName('components/date-selector/index'))
      .inView(`<date-selector name="${dateSelectorName}" date.bind="date" interval.bind="interval"></date-selector>`)
      .boundTo(bindings);

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Rendering', () => {

    describe('Quarter select', () => {
      it('should render a quarter select for quarterly', () => {
        expect(component.viewModel.quarterEl).toBeDefined();
      });

      it('should NOT render a quarter select for other collection periods', (done) => {
        expect(component.viewModel.quarterEl).toBeDefined();
        component.viewModel.interval = 'yearly';
        setImmediate(() => {
          expect(component.viewModel.quarterEl).toEqual(null);
          done();
        });
      });

      it('should render a quarter select with 4 options', () => {
        const options = component.viewModel.quarterEl.querySelectorAll('option');
        expect(options.length).toEqual(4);
        expect(options[2].getAttribute('model.bind')).toEqual('3');
      });

      it('should set the correct quarter for the given date', () => {
        expect(component.viewModel.quarter).toEqual(4);
      });
    });

    describe('Year select', () => {
      it(`Should render a list of options ranging from ${DEFAULTS.START_YEAR} up to ${DEFAULTS.END_YEAR}.`, () => {
        const options = component.viewModel.yearEl.querySelectorAll('option');

        for (let i = 0; i <= DEFAULTS.END_YEAR - DEFAULTS.START_YEAR; i++)
          expect(options[i].value).toEqual(`${i + DEFAULTS.START_YEAR}`);
      });
      it('should set the correct year for the current date', () => {
        expect(component.viewModel.yearEl.value).toEqual('2000');
      });
    });
  });


  describe('Selection', () => {

    it('should trigger an event when quarter is changed', (done) => {
      let publishSpy = spyOn(component.viewModel.eventAggregator, 'publish');

      component.viewModel.quarter = '1';
      component.viewModel.quarterEl.dispatchEvent(new Event('change'));

      setImmediate(() => {
        const d = new Date(bindings.date);
        d.setUTCMonth(2);
        expect(component.viewModel.quarter).toEqual('1');
        expect(publishSpy).toHaveBeenCalledWith(DateSelectorEvents.ONDATECHANGE, {
          name: dateSelectorName,
          value: d.getTime()
        });
        done();
      });
    });

    it('should trigger an event when year is changed', (done) => {
      let publishSpy = spyOn(component.viewModel.eventAggregator, 'publish');

      component.viewModel.year = '2017';
      component.viewModel.yearEl.dispatchEvent(new Event('change'));

      setImmediate(() =>{
        const d = new Date(bindings.date);
        d.setFullYear(2017);
        expect(component.viewModel.year).toEqual('2017');
        expect(publishSpy).toHaveBeenCalledWith(DateSelectorEvents.ONDATECHANGE, {
          name: dateSelectorName,
          value: d.getTime()
        });
        done();
      });
    });
  });
});

describe('Start Date selector', () => {

  let component;
  let bindings;
  let dateSelectorName;

  beforeEach((done) => {
    dateSelectorName = 'start';

    const initialDate = Date.parse('Dec 01, 2000 UTC');
    bindings = {
      date: initialDate,
      interval: 'quarterly'
    };

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/date-selector/index'))
      .inView(`<date-selector name="${dateSelectorName}" date.bind="date" interval.bind="interval"></date-selector>`)
      .boundTo(bindings);

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Selection', () => {
    [
      { quarter: '1', expectedDate:Date.parse('Jan 01, 2000 UTC') },
      { quarter: '2', expectedDate:Date.parse('Apr 01, 2000 UTC') },
      { quarter: '3', expectedDate:Date.parse('Jul 01, 2000 UTC') },
      { quarter: '4', expectedDate:Date.parse('Oct 01, 2000 UTC') },
    ].forEach(testCase =>
    it(`should send event with first day of the quarter when quarter is changed to ${testCase.quarter}`, (done) => {
      let publishSpy = spyOn(component.viewModel.eventAggregator, 'publish');

      component.viewModel.quarter = testCase.quarter;
      component.viewModel.quarterEl.dispatchEvent(new Event('change'));

      setImmediate(() => {
        expect(publishSpy).toHaveBeenCalledWith(DateSelectorEvents.ONDATECHANGE, {
          name: dateSelectorName,
          value: testCase.expectedDate
        });
        done();
      });
    }));
  });
});
