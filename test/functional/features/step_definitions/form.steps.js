const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given}) {
    Given(/^I set the "([^"]*)" input value to "([^"]*)"$/, function (selector, value) {
        selector = this.getSelector(selector);
        this.client.setValue(selector, value);
    });

    Given(/^I select the "([^"]*)" option for "([^"]*)"$/, function (fieldValue, selector) {
        selector = this.getSelector(selector);
        this.client.selectByValue(selector, fieldValue);
    });
});
