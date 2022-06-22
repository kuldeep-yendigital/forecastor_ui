const {
  defineSupportCode
} = require('cucumber');
const qs = require('qs');

defineSupportCode(function({
  Given
}) {
  Given(/^I visit "(.*)"$/, function(url) {
    this.client.url(url);
  });

  Given(/^I visit forecaster$/, function() {
    this.client.url(this.config.serverUrls[this.config.targetEnv]);
    // // localStorage DELETE causing exception for IE hence using JS script to clear
    this.client.execute(() => {
      localStorage.removeItem('forecaster-searchribbon-viewmode');
    });

    if (!this.useapi) {
      this.client.execute(() => {
        localStorage.removeItem('id_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');
      });
      this.client.refresh();
    } else {
      this.getAccessToken().then(body => {
        const q = qs.stringify(body);
        const x = `${this.config.serverUrls[this.config.targetEnv]}/callback.html#${q}`;
        this.client.url(x);
      });
    }
  });

  Given(/^I visit forecaster at the route "(.*)"$/, function(route) {
    this.client.newWindow(this.config.serverUrls[this.config.targetEnv] + route);
  });

  Given(/^I navigate to "(.*)"$/, function(name) {
    this.client.click(this.getSelector(`navigate-${name}`));
  });

  Given(/^I visit the url at "(.*)"$/, function(selector) {
    this.client.newWindow(this.client.getText(this.getSelector(selector)));
  });

  Given(/^I hit the back button$/, function() {
    this.client.back();
  });

  Given(/^I hit the forward button$/, function() {
    this.client.forward();
  });
});
