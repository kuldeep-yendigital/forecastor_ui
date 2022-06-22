/* global describe, it, expect, beforeEach, afterEach, PLATFORM, document */
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';

describe('Ribbon Panel', () => {
  let component;
  let model;

  beforeEach((done) => {
    model = { 
      disabled: false,
      panelData: {
        dimension: 'dataset'
      }
    };
    component = StageComponent
      .withResources(PLATFORM.moduleName('components/panels/ribbon-panel/index'))
      .inView(`
        <ribbon-panel
          panel-data.bind="panelData"
          disabled.bind="disabled"></ribbon-panel>`
      )
      .boundTo(model);

    component.create(bootstrap).then(() => {
    }).then(done).catch(done.fail);
  });
  

  afterEach(() => {
    component.dispose();
  });

  describe('Initialise', () => {
    it('should create the ribbon panel', () => {
      const div = document.querySelector('.ribbon-panel');

      expect(div).not.toBeNull();
      expect(div).not.toBeUndefined();
    });
  });

  describe('Bindings', () => {
    it('should not be disabled', () => {
      expect(component.viewModel.disabled).toBe(false);
    });

    it('should be disabled', (done) => {
      model.disabled = true;
      setImmediate(() => {
        expect(component.viewModel.disabled).toBe(true);
        done();
      });
    });

    it('should update the panel name', (done) => {
      model.panelData = {
        dimension: 'dataset'
      };
      setImmediate(() => {
        expect(component.viewModel.panelName).toEqual('dataset-panel');
        done();
      });
    });
  });
});
