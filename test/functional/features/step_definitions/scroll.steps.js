const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given}) {
    Given(/^I scroll down "(.*)" px in "(.*)"$/, {retry: 3}, function (yOffset, selector) {
        this.client.execute(function (selector, yOffset) {
            document.querySelector(selector).scrollTop = yOffset;
        }, this.getSelector(selector), yOffset);
    });

    Given(/^I scroll to "(.*)" in "(.*)"$/, function (target, selector) {
        /*
         * NOTE: The pauses exists because of the grid in the
         * app loads. The header columns are resized to match
         * the column widths of the data rows.
         * This means scrolling to a column can happen
         * before the layout of the grid is complete
         * and then the column is pushed out of view.
         */
        this.client.pause(1000);
        this.client.waitUntil(() => {
            const containerSelector = this.getSelector(selector);
            const targetSelector = this.getSelector(target);
            this.client.execute(function (container, target) {
                const scrollElement = document.querySelector(container);
                const targetElement = document.querySelector(target);
                scrollElement.scrollTop = targetElement.offsetTop;
                scrollElement.scrollLeft = targetElement.offsetLeft;
            }, containerSelector, targetSelector);
            this.client.pause(1000);
            return this.client.isVisibleWithinViewport(targetSelector);
        }, this.EXPECTATION_TIMEOUT);
    });
});
