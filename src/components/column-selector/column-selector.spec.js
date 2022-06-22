import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {ColumnStore} from '../../stores/columnStore';
import Store from '../../stores/store';

describe('Column Selector', () => {

  let component;
  let mockData;

  class MockStore extends Store {
    constructor(data) {
      super();

      this.data = data;
    }

    get EVENTS() {
      return [];
    }

    subscribe() {

    }

    getDefaultState() {
      return this.data;
    }

    getGroups() {
      return [];
    }
  }

  beforeEach(done => {
    mockData = {};

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/column-selector/index'))
      .inView('<column-selector></column-selector>');

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(ColumnStore, new MockStore({ columns: [
        {display: 'field1', field: 'field1_field', parent: 'group1', checked: true},
        {display: 'field2', field: 'field2_field', parent: 'group1', checked: true},
        {display: 'field3', field: 'companyname_name', parent: 'group2', checked: true}
      ] }));
    });

    component.create(bootstrap).then(() => {
    }).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Initialise', () => {
    it('should set default open state to false', () => {
      expect(component.viewModel.open).toEqual(false);
    });

    it('should collapse all column groups', () => {
      expect(component.viewModel.expanded).toEqual([]);
    });

    it('should select all if all columns are checked', () => {
      expect(component.viewModel.all).toEqual({ checked: true, "indeterminate":false });
    });
  });

  describe('Interaction', () => {
    let menuBtn;

    beforeEach(() => {
      menuBtn = document.querySelector('[data-selector="menubtn"]');
    });

    it('should toggle open state', () => {
      expect(component.viewModel.open).toEqual(false);
      menuBtn.click();
      expect(component.viewModel.open).toEqual(true);
      menuBtn.click();
      expect(component.viewModel.open).toEqual(false);
    });

    it('should call registerBodyListener', () => {
      const spy = spyOn(component.viewModel, 'registerBodyListener');
      menuBtn.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should close when open and click off the menu', (done) => {
      component.viewModel.open = true;
      component.viewModel.registerBodyListener();
      setImmediate(() => {
        document.body.click();
        setImmediate(() => {
          expect(component.viewModel.open).toEqual(false);
          done();
        });
      });
    });
  });


});
