import { StageComponent, waitFor } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { STATES } from './index';
import { updateListState } from './helpers';
import { fixtures } from './fixtures';
import * as GLOBAL_EVENTS from '../../../events';

const flattenedNameStates = list => {
  const inner = ({ acc, path }, item) => {
    const itemPath = path.concat(item.name);
    const childResult = item.children.reduce(inner, { acc: {}, path: itemPath });
    return {
      acc: { ...acc, [itemPath.join('.')]: item.state, ...childResult.acc },
      path
    };
  };
  return list.reduce(inner, { acc: {}, path: [] }).acc;
};

describe('MultiListPanel', () => {
  let component;
  let model;

  beforeEach((done) => {
    model = {
      data: [],
      onItemSelectChange: () => { }
    };

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/panels/multi-list-panel/index'))
      .inView(`<multi-list-panel data.bind="data"
                                 on-item-select-change.call="onItemSelectChange($event)"
                                 on-select-all-change.call="onSelectAllChange($event)"
                                 dimension-name="TestyName"
                                 with-result-counts.bind="false">
              </multi-list-panel>`)
      .boundTo(model);

    component.create(bootstrap)
      .then(done)
      .catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Rendering', () => {

    beforeEach(done => {
      model.data = [
        {name: 'test1', rowCount: 10},
        {name: 'test2', rowCount: 10},
        {
          name: 'test3',
          count: 1,
          rowCount: 10,
          children: [
            {name: 'child', rowCount: 10}
          ]
        }
      ];

      setImmediate(done);
    });

    it('should render list items', (done) => {
      component.waitForElement('[data-selector~=multi-list-panel-item]').then(() => {
        // Select them
        let listItems = document.querySelectorAll('[data-selector~=multi-list-panel-item]');
        expect(listItems.length).toEqual(3);
        done();
      });
    });

    it('should render a title', (done) => {
      component.waitForElement('[data-selector="multi-list-panel-heading"]').then((heading) => {
        expect(heading.innerHTML).toEqual('Testy Name');
        done();
      });
    });

    it('should render "Select /select all" links', () => {
      let selectAllLink = document.querySelector('[data-selector="multi-list-panel"] [data-selector="select-all"]');
      let clearAllLink = document.querySelector('[data-selector="multi-list-panel"] [data-selector="clear-all"]');
      expect(selectAllLink.textContent).toContain('Select all');
      expect(clearAllLink.textContent).toContain('Clear all');
    });

    it('should render a search panel', () => {
      const searchPanel = document.querySelectorAll('.search-panel');
      expect(searchPanel.length).toEqual(1);
    });

    it('should NOT display search panel results', () => {
      const searchPanelResults = document.querySelectorAll('[data-selector="search-panel-results"] li');
      expect(searchPanelResults.length).toEqual(0);
    });

    it('should render a drill down button for a branch', () => {
      const items = document.querySelectorAll('[data-selector*="multi-list-panel-item"]');
      expect(items[2].querySelectorAll('[data-selector="arrow-next"]').length).toBeGreaterThan(0);
    });

    it('should NOT render a drill down button for a leaf', () => {
      const items = document.querySelectorAll('[data-selector*="multi-list-panel-item"]');
      expect(items[0].querySelectorAll('[data-selector="arrow-next"]').length).toEqual(0);
    });

  });

  describe('Next / Previous', () => {
    let childList = [
      {name: 'Child 1'},
      {name: 'Child 2'},
      {name: 'Child 3'},
      {name: 'Child 4'},
      {name: 'Child 5'}
    ];

    let parentList = [
      {name: 'Parent A', count: 5},
      {name: 'Parent B', count: 3},
      {name: 'Parent C', count: 10}
    ];

    beforeEach(done => {
      model.data = parentList;
      setImmediate(done);
    });

    describe('Next', () => {
      it('should be called by the drill down arrow', done => {
        const spy = spyOn(component.viewModel, 'next');
        component.viewModel.withResultCounts = false;
        const items = document.querySelectorAll('[data-selector*="multi-list-panel-item"]');

        items[0].querySelectorAll('[data-selector="arrow-next"]')[0].click();
        setImmediate(() => {
          expect(spy).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('Previous', () => {

      beforeEach(done => {
        model.data = childList;
        component.viewModel.level = 1;
        setImmediate(done);
      });


    });

  });

  describe('HasNext', () => {
    const items = [
      {name: 'Parent A', count: 5},
      {name: 'Parent B', count: 0}
    ];

    beforeEach(done => {
      component.viewModel.data = items;
      setImmediate(done);
    });

    it('should return true for items with a count greater than zero', () => {
      component.viewModel.withResultCounts = false;
      expect(component.viewModel.hasNext(items[0])).toBeTruthy();
      expect(component.viewModel.hasNext(items[1])).toBeFalsy();
    });
  });

  describe('Selection', () => {

    beforeEach(done => {
      model.data = [
        {name: 'test1', rowCount: 10},
        {name: 'test2', rowCount: 10},
        {
          name: 'test3',
          count: 1,
          rowCount: 10,
          children: [
            {name: 'child', rowCount: 10}
          ]
        }
      ];

      setImmediate(done);
    });

    describe('toggleSelection', () => {
      let setItemStateSpy;
      beforeEach(() => {
        setItemStateSpy = spyOn(component.viewModel, 'setItemState');
      });

      it('should call onItemSelectChange callback if provided', () => {
        component.viewModel.withResultCounts = false;
        const spy = spyOn(model, 'onItemSelectChange');
        component.viewModel.toggleSelection(model.data[0]);
        expect(spy).toHaveBeenCalled();
      });

      it('should call setItemState', () => {
        component.viewModel.withResultCounts = false;
        component.viewModel.toggleSelection(model.data[0]);
        expect(setItemStateSpy).toHaveBeenCalled();
      });
    });

    describe('setItemState', () => {
      let item;

      beforeEach(() => {
        item = {
          state:STATES.UNCHECKED
        };
      });

      it('should change checked to unchecked', () => {
        component.viewModel.withResultCounts = false;
        item.state = STATES.CHECKED;
        component.viewModel.setItemState(item);
        expect(item.state).toEqual(STATES.UNCHECKED);
      });
      it('should change unchecked to checked', () => {
        component.viewModel.withResultCounts = false;
        item.state = STATES.UNCHECKED;
        component.viewModel.setItemState(item);
        expect(item.state).toEqual(STATES.CHECKED);
      });
      it('should change indeterminate to checked', () => {
        component.viewModel.withResultCounts = false;
        item.state = STATES.INDETERMINATE;
        component.viewModel.setItemState(item);
        expect(item.state).toEqual(STATES.CHECKED);
      });
    });

    describe('select / clear all ', () => {
      let selectAllLink, clearAllLink;

      beforeEach(done => {
        selectAllLink = document.querySelector('[data-selector="multi-list-panel"] [data-selector="select-all"]');
        clearAllLink = document.querySelector('[data-selector="multi-list-panel"] [data-selector="clear-all"]');

        const list = [
          {name: 'test1', state: STATES.UNCHECKED, count: 0, rowCount: 1},
          {name: 'test2', state: STATES.UNCHECKED, count: 0, rowCount: 1},
          {
            name: 'test3',
            state: STATES.UNCHECKED,
            count: 1,
            rowCount: 1,
            children: [
              {name: 'child', state: STATES.UNCHECKED, count:0, rowCount: 1},
              {
                name: 'test4',
                state: STATES.CHECKED,
                count: 1,
                rowCount: 1,
                children: [
                  {name: 'child', state: STATES.CHECKED, count: 0, rowCount: 1}
                ]
              }
            ]
          }
        ];

        model.data = list;

        setImmediate(done);
      });

      it('should call selectAllChange with true', () => {
        component.viewModel.withResultCounts = false;
        const spy = spyOn(component.viewModel, 'selectAllChange');
        selectAllLink.click();
        expect(spy).toHaveBeenCalledWith(true);
      });

      it('should update list items to state checked', (done) => {
        const expectedNameStates = {
          'test1': STATES.CHECKED,
          'test2': STATES.CHECKED,
          'test3': STATES.CHECKED,
          'test3.test4': STATES.CHECKED,
          'test3.child': STATES.CHECKED,
          'test3.test4.child': STATES.CHECKED
        };

        component.viewModel.withResultCounts = false;
        component.viewModel.selectAllChange(true);

        setImmediate(() => {
          expect(flattenedNameStates(component.viewModel.list)).toEqual(expectedNameStates);
          done();
        });
      });

      it('should update list items to state unchecked', (done) => {
        const expectedNameStates = {
          'test1': STATES.UNCHECKED,
          'test2': STATES.UNCHECKED,
          'test3': STATES.UNCHECKED,
          'test3.test4': STATES.UNCHECKED,
          'test3.child': STATES.UNCHECKED,
          'test3.test4.child': STATES.UNCHECKED
        };

        component.viewModel.withResultCounts = false;
        component.viewModel.selectAllChange(false);

        setImmediate(() => {
          expect(flattenedNameStates(component.viewModel.list)).toEqual(expectedNameStates);
          done();
        });
      });

      it('should call selectAllChange with false', () => {
        component.viewModel.withResultCounts = false;
        const spy = spyOn(component.viewModel, 'selectAllChange');
        clearAllLink.click();
        expect(spy).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('list handlers for search results', () => {

    beforeEach(done => {
      component.viewModel.dataChangedCb = (() => {
        done();
      });

      component.viewModel.data = fixtures.data;      
    });

    it('should update list state (updateListState)', () => {
      expect(fixtures.data.map(updateListState)).toEqual(fixtures.dataUpdateListState);
    });

    it('should have created the flattened list including levels ', () => {
      expect(component.viewModel.flatList).toEqual(fixtures.dataFlattenHierachicalList);
    });

    it('should unselect all search results on RESET_SEARCH_RESULTS event', () => {
      const spy = spyOn(component.viewModel, 'selectAllChange');
      component.viewModel.eventAggregator.publish(GLOBAL_EVENTS.RESET_SEARCH_RESULTS);
      expect(spy).toHaveBeenCalledWith(false);
    });
  });
});
