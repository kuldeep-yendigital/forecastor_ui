const baseConfig = require('./cuke.conf');
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const tagProcessor = require('../features/support/tagProcessor');

const config = Object.assign(baseConfig.config, {
    defaultTags: baseConfig.config.defaultTags.concat(['not @headlessignore']),
    capabilities: [
        {
            maxInstances: 1,
            browserName: 'chrome',
            chromeOptions: {
                args: [
                    'headless',
                    // Use --disable-gpu to avoid an error from a missing Mesa
                    // library, as per
                    // https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
                    'disable-gpu'
                ]
            }
        }
    ]
});

config.cucumberOpts.tagExpression = tagProcessor(config, argv);
exports.config = config;
