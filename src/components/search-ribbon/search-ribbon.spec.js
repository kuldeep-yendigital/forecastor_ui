import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { EVENTS as BackPanelEvents } from '../back-panel-button/index';
import { VIEWMODES } from './index';
import {QueryStore} from '../../stores/queryStore';
import Store from '../../stores/store';

describe('search ribbon', () => {
  let component;
  let bindings = {};
  let mockData;

  class MockStore extends Store {
    get EVENTS() {
      return [];
    }

    getDefaultState() {
      return mockData;
    }
  }


  beforeEach((done) => {
    mockData = {};
    bindings = {
      dimensions: []
    };

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/search-ribbon/index'))
      .inView('<search-ribbon dimensions.bind="dimensions"></search-ribbon>')
      .boundTo(bindings);

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerSingleton(QueryStore, MockStore);
    });

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Rendering', () => {
    it('should render taxonomy items', (done) => {
      let taxonomyItems = window.document.querySelectorAll('[data-selector*="taxonomy-item"]');
      expect(taxonomyItems.length).toEqual(0);

      bindings.dimensions = [
        { name: 'test1' },
        { name: 'test2' },
        { name: 'test3' }
      ];

      setImmediate(() => {
        taxonomyItems = window.document.querySelectorAll('[data-selector*="taxonomy-item"]');
        expect(taxonomyItems.length).toEqual(3);
        done();
      });
    });
  });


  describe('Interaction', () => {
    let taxonomyItems;
    let onSelectSpy;

    beforeEach((done) => {
      bindings.dimensions = [
        { name: 'test1' },
        { name: 'test2' },
        { name: 'test3' }
      ];
      onSelectSpy = spyOn(component.viewModel, 'onSelect');
      setImmediate(() => {
        taxonomyItems = window.document.querySelectorAll('[data-selector*="taxonomy-item"]');
        done();
      });
    });
    
    describe('onToggleSubMenu', () => {
      it('should open submenu if closed and call onSelect', (done) => {
        expect(component.viewModel.openSubMenu).toEqual(false);
        taxonomyItems[0].click();
        setImmediate(() => {
          expect(component.viewModel.openSubMenu).toEqual(true);
          expect(onSelectSpy).toHaveBeenCalled();
          done();
        });
      });

      it('should close submenu if open and call onSelect', done => {
        spyOn(component.viewModel, 'isDimensionOpen').and.returnValue(true);
        component.viewModel.openSubMenu = true;
        taxonomyItems[0].click();
        setImmediate(() => {
          expect(component.viewModel.openSubMenu).toEqual(false);
          expect(onSelectSpy).toHaveBeenCalled();
          done();
        });
      });

      it('should remain open if a different dimension is clicked', done => {
        component.viewModel.openSubMenu = true;
        spyOn(component.viewModel, 'isDimensionOpen').and.returnValue(false);
        taxonomyItems[1].click();
        setImmediate(() => {
          expect(component.viewModel.openSubMenu).toEqual(true);
          expect(onSelectSpy).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('persistedViewMode', () => {
      beforeEach((done) => {
        window.localStorage.setItem('forecaster-searchribbon-viewmode', 'testy_test');
        component.create(bootstrap).then(done).catch(done.fail);
      });

      afterEach(() => {
        window.localStorage.clear();
      });


      it('should store viewmode in localstorage', () => {
        const spy = spyOn(window.localStorage, 'setItem');
        component.viewModel.toggleView();
        expect(spy).toHaveBeenCalledWith('forecaster-searchribbon-viewmode', VIEWMODES.ICON);
      });

      it('should set default view from localstorage', () => {
        expect(component.viewModel.viewMode).toEqual('testy_test');
      });
    });
  });


  describe('Selection', () => {
    beforeEach((done) => {
      bindings.dimensions = [
        { name: 'test1' },
        { name: 'test2' },
        { name: 'test3' }
      ];

      setImmediate(done);
    });
  });
});
