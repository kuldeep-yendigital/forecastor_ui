const baseConfig = require('./cuke.conf');
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const tagProcessor = require('../features/support/tagProcessor');

const config = Object.assign(baseConfig.config, {
    defaultTags: baseConfig.config.defaultTags.concat(['not @phantomignore']),
    capabilities: [
        {
            'browserName': 'phantomjs'
        }
    ],

    services: ['phantomjs']
});

config.cucumberOpts.tagExpression = tagProcessor(config, argv);
exports.config = config;
