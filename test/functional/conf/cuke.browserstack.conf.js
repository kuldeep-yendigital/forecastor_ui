if (!process.env.BS_USER) {
    throw 'You need to set your Browserstack username in the BS_USER environment variable';
}
if (!process.env.BS_KEY) {
    throw 'You need to set your Browserstack key in the BS_KEY environment variable';
}

const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const tagProcessor = require('../features/support/tagProcessor');

const baseConfig = require('./cuke.conf');
const config = Object.assign(baseConfig.config, {
    remote: true,
    user: process.env.BS_USER,
    key: process.env.BS_KEY,
    capabilities: [
        {
            os: 'Windows',
            os_version: '10',
            browserName: 'chrome'
        }
    ],
    maxInstances: 2
});

config.cucumberOpts.tagExpression = tagProcessor(config, argv);
exports.config = config;
