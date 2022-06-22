import {bootstrap} from 'aurelia-bootstrapper';
import {StageComponent} from 'aurelia-testing';
import {Router} from 'aurelia-router';

import {AuthStore} from '../../stores/authStore';
import {FakeAuthStore} from '../../../test/unit/helpers/fakes';

describe('Nav Header', () => {

  const model = { isVisualisation: false };
  const component = StageComponent
    .withResources(PLATFORM.moduleName('components/nav-header/index'))
    .inView('<nav-header></nav-header>')
    .boundTo(model);

  component.bootstrap(aurelia => {
    aurelia.use.standardConfiguration();
    aurelia.container.registerInstance(Router, {
      navigateTo : {
        dataMethodology : () => true,
        dashboard       : () => true,
        help            : () => true,
        passwordChange  : () => true
      }
    });
    aurelia.container.registerInstance(AuthStore, new FakeAuthStore());
  });

  beforeEach(done => component.create(bootstrap).then(done).catch(done.fail));
  afterEach(() => component.dispose());

  describe('Should handle routing', () => {
    const scenarios = [
      { userMenu: false, querySelector : '[data-selector=forecaster-header] > span', route : 'dashboard' },
      { userMenu: true, querySelector : '[data-selector=data-methodology]', route : 'dataMethodology' },
      { userMenu: true, querySelector : '[data-selector=help]', route : 'help' },
      { userMenu: true, querySelector : '[data-selector=change-password]', route : 'passwordChange' }
    ];

    scenarios.forEach(scenario => {
      if (scenario.userMenu) {
        it(`Should open the user menu and navigate to ${scenario.route}`, (done) => {
          const spyRoute = spyOn(component.viewModel.router.navigateTo, scenario.route);
          const spyMenu  = spyOn(document.querySelector('[data-selector=user-details]'), 'click');

          document.querySelector('[data-selector=user-details]').click();
          document.querySelector(scenario.querySelector).click();

          expect(spyMenu).toHaveBeenCalled();
          expect(spyRoute).toHaveBeenCalled();
          done();
        });
      }
      else {
        it(`Should navigate to ${scenario.route}`, (done) => {
          const spyRoute = spyOn(component.viewModel.router.navigateTo, scenario.route);
          document.querySelector(scenario.querySelector).click();

          expect(spyRoute).toHaveBeenCalled();
          done();
        });
      }
    });
  });

});
