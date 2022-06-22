/* global describe, it, expect, beforeEach, afterEach, document, PLATFORM */
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import * as GLOBAL_EVENTS from './../../events';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Snackbar } from './index';


describe('Snackbar', () => {
  let component;
  let manualComponent;
  let config;
  let ea;

  beforeEach((done) => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('components/snackbar/index'))
      .inView('<snackbar></snackbar>');

    component.create(bootstrap).then(() => {
    }).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      const div = document.querySelector('.component-snackbar');
      
      expect(div).not.toBeUndefined();
      expect(div).not.toBeNull();
    });
  });

  describe('Events', () => {
    it('should listen for the global populate system message event', () => {
      expect(component
              .viewModel
              .ea
              .eventLookup[GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE][0])
              .toEqual(component.viewModel.showMessage);
    });
  });

  describe('EventAggregator Handling', () => {
    beforeEach(() => {
      config = {
        get: () => ({delay: 1000})
      };
      ea = new EventAggregator();
      manualComponent = new Snackbar(config, ea);
    });

    it('should set the snackbar text with the populate system message event', () => {
      ea.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, 'A test message');

      expect(manualComponent.message).toEqual('A test message');
    });

    it('should hide the message after the timeout', (done) => {
      setTimeout(() => {
        expect(manualComponent.message).toEqual('');
        done();
      }, config.get('systemMessage').delay);
    });
  });
});
