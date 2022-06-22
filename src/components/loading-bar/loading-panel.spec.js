import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

describe('Loading Panel', () => {
  let component;
  let bindings = { action() {} };

  beforeEach(done => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('components/loading-bar/index'))
      .inView('<loading-panel action.call="action($event)"></loading-panel>')
      .boundTo(bindings);

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  it('replay triggers action', (done) => {
    bindings.action = (event) => {
      done();
    };

    const el = document.querySelector('.material-icons');

    expect(el.classList.contains('replay')).toBeTruthy();
    document.querySelector('.material-icons').click();
  });

});
