import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import { EVENTS as MULTILIST_PANEL_EVENTS } from '../multi-list-panel/index'
import{EVENTS as SearchPanelEvents, SEARCH_DELAY} from './index';

describe('SearchPanel', () => {
  let component;
  let bindings;

  beforeEach(done => {
    bindings = {
      list: [
        {name: 'One Two Three', state: 0, level: 1},
        {name: 'One Two Three', state: 0, level: 1},
        {name: 'One Three Four', state: 0, level: 1},
        {name: 'Two Three Four', state: 0, level: 1},
        {name: 'Five Six Seven', state: 0, level: 1}
      ],
      header: 'super header'
    };

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/panels/search-panel/index'))
      .inView('<search-panel list.bind="list" header.bind="header"></search-panel>')
      .boundTo(bindings);

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Rendering', () => {
    it('should render a search box', () => {
      const searchPanel = document.querySelectorAll('search-panel');
      expect(searchPanel.length).toBe(1);
    });
  });

  describe('Searching', () => {
    it('should listen for key up events', () => {
      const spy = spyOn(component.viewModel, 'onTypeAhead');
      component.viewModel.typeahead.dispatchEvent(new Event('keydown'));
      component.viewModel.typeahead.dispatchEvent(new Event('keydown'));
      component.viewModel.typeahead.dispatchEvent(new Event('keydown'));
      component.viewModel.typeahead.dispatchEvent(new Event('keyup'));
      component.viewModel.typeahead.dispatchEvent(new Event('keypress'));
      expect(spy).toHaveBeenCalledTimes(1);
    });

    describe('Search timeout', () => {
      it('should set a timeout to debounce typing events', () => {
        component.viewModel.onTypeAhead();
        expect(component.viewModel.searchTimeout).toBeTruthy();
      });

      it('should clear and reset the timeout for each keyup', () => {
        const spy = spyOn(window, 'clearTimeout').and.callThrough();
        component.viewModel.onTypeAhead();
        component.viewModel.onTypeAhead();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(component.viewModel.searchTimeout).toBeTruthy();
      });
    });


    it('should only perform a search if search term is greater than 2 chars', done => {
      const spy = spyOn(component.viewModel, 'search');
      component.viewModel.searchTerm = 'a';
      component.viewModel.onTypeAhead();
      setTimeout(() => {
        expect(spy).not.toHaveBeenCalled();
        component.viewModel.searchTerm = 'as';
        component.viewModel.onTypeAhead();
        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          done();
        }, SEARCH_DELAY + 1);  // We add 1 millisecond to a wait because of the debounce timeout
      }, SEARCH_DELAY + 1);
    });

    describe('Search logic', () => {

      it('should be case-insensitive', done => {
        debugger;
        component.viewModel.search('one two three');
        setImmediate(() => {
          expect(component.viewModel.searchResults).toEqual([
            {name: 'One Two Three', state: 0, grouped: undefined, level: 1, count: undefined, isCalculator: undefined},
            {name: 'One Two Three', state: 0, grouped: true, level: 1, count: undefined, isCalculator: undefined}
          ]);
          done();
        });
      });


      it('should perform partial matches', done => {
        component.viewModel.search('two');
        setImmediate(() => {
          expect(component.viewModel.searchResults).toEqual([
            {name: 'One Two Three', state: 0, grouped: undefined, level: 1, count: undefined, isCalculator: undefined},
            {name: 'One Two Three', state: 0, grouped: true, level: 1, count: undefined, isCalculator: undefined},
            {name: 'Two Three Four', state: 0, grouped: true, level: 1, count: undefined, isCalculator: undefined}
          ]);
          done();
        });
      });

      it('should set noResultsFound flag ', done => {
        component.viewModel.search('xxx');
        setImmediate(() => {
          expect(component.viewModel.noResultsFound).toBeTruthy();
          done();
        });
      });

      xit('should reset search input on RESET_SEARCH event', (done) => {
        const spy = spyOn(component.viewModel, 'resetSearchInput');
        component.viewModel.eventAggregator.publish(MULTILIST_PANEL_EVENTS.RESET_SEARCH);
        setImmediate(() => {
          expect(spy).toHaveBeenCalled();
          done();
        });
      });

    });
  });

  describe('toggleSelection', () => {
    let publishSpy;

    beforeEach(() => {
      publishSpy = spyOn(component.viewModel.eventAggregator, 'publish');
    });
    it('should not do anything if an item is disabled', () => {
      component.viewModel.toggleSelection({name: 'test1', state: 0, disabled: true});
      expect(publishSpy).not.toHaveBeenCalled();
    });

    it('should fire ON_SELECTION for checked items', () => {
      const item = {name: 'test2', state: 0, rowCount: 10};
      component.viewModel.toggleSelection(item);
      expect(publishSpy).toHaveBeenCalledWith(SearchPanelEvents.ON_SELECTION, item);
      expect(item.state).toEqual(1);
    });

    it('should fire ON_UNSELECTION for unchecked items', () => {
      const item = {name: 'test2', state: 1, rowCount: 10};
      component.viewModel.toggleSelection(item);
      expect(publishSpy).toHaveBeenCalledWith(SearchPanelEvents.ON_UNSELECTION, item);
      expect(item.state).toEqual(0);
    });
  });
});
