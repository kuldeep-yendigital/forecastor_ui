import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

import {ExportStore} from '../../stores/exportStore';
import { FakeExportStore } from '../../../test/unit/helpers/fakes';

describe('Export Menu', () => {
  let component;

  beforeEach(done => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('components/export-menu/index'))
      .inView('<export-menu></export-menu>');

      component.bootstrap(aurelia => {
        aurelia.use.standardConfiguration();

        aurelia.container.registerInstance(ExportStore, new FakeExportStore());
      });

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Initialise', () => {
    it('should set default open state to false', () => {
      expect(component.viewModel.open).toEqual(false);
    });
  });

  describe('Interaction', () => {
    let menuBtn;

    beforeEach(() => {
      menuBtn = document.querySelector('[data-selector="export-menu"]');
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
