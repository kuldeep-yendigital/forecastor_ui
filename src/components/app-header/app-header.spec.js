import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {SelectionStore, EVENTS as SELECTION_EVENTS} from '../../stores/selectionStore';
import {GraphStore} from '../../stores/graphStore';
import { FakeAuthStore, FakeDataStore, FakeExportStore, FakeColumnStore } from '../../../test/unit/helpers/fakes';
import * as GLOBAL_EVENTS from "../../events";
import {AuthStore} from '../../stores/authStore';
import {ExportStore} from '../../stores/exportStore';
import {ColumnStore} from '../../stores/columnStore';

describe('App Header', () => {
  let component, model, fakeDataStore;

  beforeEach(done => {
    model = {view: 'data-grid'};

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/app-header/index'))
      .inView('<app-header view.two-way="view"></app-header>')
      .boundTo(model);

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(AuthStore, new FakeAuthStore());
      aurelia.container.registerInstance(ExportStore, new FakeExportStore());
      aurelia.container.registerInstance(SelectionStore, {
        data: { selected: [ {}, {}, {} ] },
        subscribe: () => ({ dispose: () => {} })
      });
      aurelia.container.registerInstance(GraphStore, {});
      aurelia.container.registerInstance(ColumnStore, new FakeColumnStore());
    });

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Visualisation view', () => {
    it('does not render export', (done) => {
      expect(document.querySelectorAll('[data-selector=export]').length).toEqual(1);

      model.view = 'visualisation';

      setTimeout(() => {
        expect(document.querySelectorAll('[data-selector=export]').length).toEqual(0);
        done();
      }, 500);
    });

    it('does not render column-selector', (done) => {
      expect(document.querySelectorAll('.column-selector').length).toEqual(1);

      model.view = 'visualisation';

      setImmediate(() => {
        expect(document.querySelectorAll('.column-selector').length).toEqual(0);
        done();
      });
    });

    it('does not render restore defaults', (done) => {
      expect(document.querySelectorAll('.show-reset-confirmation-button').length).toEqual(1);

      model.view = 'visualisation';

      setImmediate(() => {
        expect(document.querySelectorAll('.show-reset-confirmation-button').length).toEqual(0);
        done();
      });
    });
  });

  describe('Toggling Grid/Visualisation view', () => {
    it('toggles isVisualisation', (done) => {
      document.querySelector('.chart a').click();

      setImmediate(() => {
        expect(model.view).toBe('visualisation');

        document.querySelector('.back a').click();

        setImmediate(() => {
          expect(model.view).toBe('data-grid');
          done();
        });
      });
    });

    it('displays number of records selected', () => {
      const clearButton = document.querySelector('.clear');

      expect(clearButton.textContent.trim()).toEqual('3 selected');
    });
  });

  describe('actions', () => {
    it('should call clear handler when row-selection button is clicked', () => {
      const actionSpy = spyOn(component.viewModel, 'clear');
      const actionElement = document.querySelector('[data-selector=row-selection]');
      actionElement.click();
      expect(actionSpy).toHaveBeenCalled();
    });

    it('clear call to publish uncheck ', () => {
      const publishSpy = spyOn(component.viewModel.ea, 'publish');
      component.viewModel.clear(new Event('Click'));
      expect(publishSpy).toHaveBeenCalledWith(SELECTION_EVENTS.CLEAR_SELECTION);
    });
  });
});

describe('App Header (no subheader)', () => {
  let component, model, fakeDataStore;

  beforeEach(done => {
    model = {noSubHeader: true};
    fakeDataStore = new FakeDataStore();
    fakeDataStore.data.records = [{checked: true}, {checked: true}, {checked: true}];

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/app-header/index'))
      .inView('<app-header containerless no-sub-header="noSubHeader"></app-header>')
      .boundTo(model);

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(AuthStore, new FakeAuthStore());
      aurelia.container.registerInstance(ExportStore, new FakeExportStore());
      aurelia.container.registerInstance(DataStore, fakeDataStore);
    });

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });
});
