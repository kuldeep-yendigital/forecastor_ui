import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import * as GLOBAL_EVENTS from '../../../events';
import {CompanyStore} from '../../../stores/companyStore';
import Store from '../../../stores/store';

describe('CompanyPanel', () => {

  let mockData;
  let model;
  let component;

  class mockStore extends Store {
    get EVENTS() {
      return [];
    }

    getDefaultState() {
      return {
        items: mockData
      };
    }

    name() {
      return 'dimension';
    }

    get loading() {
      return false;
    }
  }

  beforeEach(done => {
    mockData = [
      {name:'aaa', state:0},
      {name:'aab', state:0},
      {name:'bbb', state:0},
      {name:'ccc', state:1}
    ];

    model = {};

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/panels/company-panel/index'))
      .inView('<company-panel></company-panel>')
      .boundTo(model);

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerSingleton(CompanyStore, mockStore);
    });

    component.create(bootstrap).then(() => {
      done();
    }).catch(done.fail);
  });

  afterEach(() => component.dispose());

  it('should show no results when no text in search box', (done) => {
    component.viewModel.calculateLiveCount = false;
    setImmediate(() => {
      expect(numberOfResults()).toEqual(0);
      done();
    });
  });

  it('should filter companies based in text in search box', (done) => {
    component.viewModel.calculateLiveCount = false;
    setImmediate(() => {
      setSearchInput('aa');
      setTimeout(() => {
        expect(numberOfResults()).toEqual(2);
        done();
      }, 500);
    });
  });

  it('should show no results when search term is less than two characters', (done) => {
    component.viewModel.calculateLiveCount = false;
    setImmediate(() => {
      setSearchInput('a');
      setTimeout(() => {
        expect(numberOfResults()).toEqual(0);
        done();
      }, 500);
    });
  });

  it('should show no results when search term does not match a company', (done) => {
    component.viewModel.calculateLiveCount = false;
    setImmediate(() => {
      setSearchInput('ddd');
      setTimeout(() => {
        expect(numberOfResults()).toEqual(0);
        done();
      }, 500);
    });
  });

  describe('activate', () => {
    it('should set initial state', () => {
      expect(component.viewModel.data.dimension.items.length).toBeGreaterThan(0);
    });
  });

  describe('Events', () => {
    it('should publish global filter added event', () =>{
      const eventSpy = spyOn(component.viewModel.eventAggregator, 'publish');
      component.viewModel.onSelect({name:'bob'});
      expect(eventSpy).toHaveBeenCalledWith(GLOBAL_EVENTS.FILTERS_ADDED, [{
        type: 'company',
        name: 'bob'
      }]);
    });

    it('should publish global filter removed event', () =>{
      const eventSpy = spyOn(component.viewModel.eventAggregator, 'publish');
      component.viewModel.onUnSelect({name:'bob'});
      expect(eventSpy).toHaveBeenCalledWith(GLOBAL_EVENTS.FILTERS_REMOVED, [{
        type: 'company',
        name: 'bob'
      }]);
    });
  });

  const inputSelector = '[data-selector=search-panel-input]';
  function setSearchInput(value) {
    const element = document.querySelector(inputSelector);
    element.value = value;
    element.dispatchEvent(new Event('change'));
    element.dispatchEvent(new Event('keyup'));
  }

  const numberOfResults = () => document.querySelectorAll('[data-selector*=search-panel-item]').length;
});
