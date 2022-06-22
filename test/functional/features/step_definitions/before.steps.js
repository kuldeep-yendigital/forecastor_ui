const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Before}) {
    Before(function () {
        //made this conditional so it doesn't run in safari as it claims the world object is undefined
        if (this.client.desiredCapabilities.browserName.toLowerCase() !== "safari") {
            this.client.setViewportSize({
                width: 3000,
                height: 1080
            });
        }
    });
});
