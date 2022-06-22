const {
  defineSupportCode
} = require('cucumber');

defineSupportCode(function ({
  Given
}) {
  const AUTH0_OPENED = '.auth0-lock-opened';
  const AUTH0_EMAIL_INPUT = '.auth0-lock-input-email .auth0-lock-input';
  const AUTH0_PASSWORD_INPUT = '.auth0-lock-input-show-password .auth0-lock-input';
  const AUTH0_NOT_YOU_OR_EMAIL_INPUT = '.auth0-lock-alternative-link, ' + AUTH0_EMAIL_INPUT;
  const AUTH0_SUBMIT = '.auth0-label-submit';

  // On localhost the permissions consent dialog will show, localhost
  // cannot be made to be able to skip the dialog. For clients set up
  // in Auth0, the domains are considered verifiable first-party clients
  // and therefore the dialog will not appear.
  const AUTH0_AUTHORIZE = '#authorize';
  const AUTH0_ALLOW = '#allow';

  const FORECASTER_APP = '[data-selector="forecaster-app"]'
  const FORECASTER_HEADER = '[data-selector="forecaster-header"]';
  const FORECASTER_HEADER_OR_AUTH0_OPENED = FORECASTER_HEADER + ', ' + AUTH0_OPENED;
  const FORECASTER_HEADER_OR_AUTH0_AUTHORIZE = FORECASTER_HEADER + ', ' + AUTH0_AUTHORIZE;

  const login = (client, username, password, timeout) => {
    client.waitForExist(AUTH0_OPENED, timeout);

    // Interact with input or not you button whichever becomes visible
    // Converges flow to input username and password
    client.waitForVisible(AUTH0_NOT_YOU_OR_EMAIL_INPUT, timeout);
    client.click(AUTH0_NOT_YOU_OR_EMAIL_INPUT);

    client.waitForVisible(AUTH0_EMAIL_INPUT, timeout);
    client.setValue(AUTH0_EMAIL_INPUT, username);
    client.setValue(AUTH0_PASSWORD_INPUT, password);
    client.click(AUTH0_SUBMIT);
    client.waitForExist(FORECASTER_APP, timeout);
    client.waitForExist(FORECASTER_HEADER, timeout);
  };

  Given(/^I login$/, function () {
    if (!this.useapi) {
      const user = this.getUser();
      console.log(`Logging in as: ${user.email}`);
      login(this.client, this.user.email, this.user.password, this.EXPECTATION_TIMEOUT);
    }
  });
});
