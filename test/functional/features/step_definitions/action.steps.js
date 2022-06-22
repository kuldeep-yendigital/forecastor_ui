const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given}) {
    Given(/^I click( the)? "([^"]*)"$/, {retry: 15}, function (ignore, selector) {
        selector = this.getSelector(selector);
        this.client.waitForExist(selector, this.EXPECTATION_TIMEOUT);
        this.client.waitForVisible(selector, this.EXPECTATION_TIMEOUT);
        this.client.click(selector);
    });

    Given(/^I type "(.*)" in "(.*)"$/, {retry: 2}, function (string, selector) {
        selector = this.getSelector(selector);
        this.client.setValue(selector, '');
        this.client.click(selector);
        this.client.keys(string)
    });

    Given(/^I accept the alert$/, function () {
        this.client.alertAccept();
    });
});
