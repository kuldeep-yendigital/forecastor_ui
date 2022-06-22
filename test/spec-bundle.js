import 'babel-polyfill';
import 'aurelia-polyfills';
import 'aurelia-loader-webpack';
import '../config/default.settings';

Error.stackTraceLimit = Infinity;

const loadTestModules = () => {
  const srcContext = require.context(
    '../src',
    true,
    /\.spec\.js$/
  );

  const testContext = require.context(
    './unit',
    true,
    /\.spec\.js$/
  );

  return [srcContext, testContext];
};

const requireAllInContext = (requireContext) => requireContext.keys().map(requireContext);
const runTests = (contexts) => contexts.forEach(requireAllInContext);

const testModuleContexts = loadTestModules();
runTests(testModuleContexts);
