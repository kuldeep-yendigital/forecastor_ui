/* global describe, it, expect, PLATFORM, afterEach, beforeEach, spyOn, window */
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';

function waitTick() {
  return new Promise(resolve => setTimeout(resolve, 0));
}
describe('back panel button', () => {
  let component;
  let publishSpy;
  afterEach(() => {
    component.dispose();
  });
  it('should render the button that sends the event', (done) => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('components/back-panel-button/index'))
      .inView('<back-panel-button></back-panel-button>');
    component.create(bootstrap)
    .then(waitTick)
    .then(() => {
      publishSpy = spyOn(component.viewModel.eventAggregator, 'publish');
      window.document.querySelector('[data-selector="back-panel-button"]').click();
    })
    .then(waitTick)
    .then(() => {
      expect(publishSpy).toHaveBeenCalledTimes(1);
    })
    .then(done)
    .catch(done.fail);
  });
});
