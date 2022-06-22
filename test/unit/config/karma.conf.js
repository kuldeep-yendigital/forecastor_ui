require('@babel/register')({ only: ['*.babel.js'] });
const nconf = require('nconf');

const unitTestReporter = nconf.argv().get('teamcity') ? 'teamcity' : 'spec';


module.exports = function karmaConf(config) {
  config.set({
    basePath: '../../../',
    frameworks: ['jasmine'],
    exclude: [],
    files: [
      { pattern: 'test/spec-bundle.js', watched: false }
    ],
    plugins: [
      'karma-coverage',
      'karma-coverage-istanbul-reporter',
      'istanbul-instrumenter-loader',
      'karma-webpack',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-spec-reporter',
      'karma-teamcity-reporter'
    ],

    preprocessors: {
      'test/spec-bundle.js': ['webpack']
    },
    webpack: require('../../../webpack.config.test.js'),
    webpackMiddleware: {
      logLevel: 'warn',
      stats: {
        chunks: false
      }
    },

    reporters: [unitTestReporter],
    specReporter: {
      suppressSkipped: true      // do not print information about skipped tests
    },
    coverageIstanbulReporter: {
      reports: [ 'text', 'text-summary', 'html' ],
      fixWebpackSourcePaths: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browserNoActivityTimeout: 100000,
    browsers: ['PhantomJS'],
    concurrency: 1,
    singleRun: false
  });
};
