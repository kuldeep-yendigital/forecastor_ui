const dataApiBase = 'http://localhost:3000';
const exportApiBase = 'http://localhost:3001';
// const dataApiBase = 'https://forecaster-api.dev.tmt.informa-labs.com';
// const exportApiBase = 'https://forecaster-export-api.dev.tmt.informa-labs.com';

window.config = window.config || {
  includeFullStory: false,
  dataApiBase: dataApiBase,
  taxonomyApiUrl: dataApiBase + '/dimensions',
  longFetchTimerMs: 20000,
  dataApiUrl: dataApiBase + '/query',
  searchUrl: dataApiBase + '/search',
  bookmarkApiUrl: dataApiBase + '/bookmark',
  getFileUrl: dataApiBase + '/getFiles',
  exportApiUrl: exportApiBase + '/export',
  eventsUrl: exportApiBase + '/events',
  exportApi: exportApiBase,
  bookmarkCategoriesApiUrl: dataApiBase + '/bookmark-categories',
  filterColumnDistinctUrl: dataApiBase + '/dimensions/filterDistinct',
  dashboardUrl: dataApiBase + '/dashboard',
  authDomain: 'ovumforecaster.eu.auth0.com',
  authClientId: 'P7snk2228sXwKLbDJnjeeo0MI63jhTSr',
  authAudience: 'https://api.forecaster.qa.tmt.informa-labs.com/',
  dataStoreType: 'mssql',
  authLogoutUrl: 'http://localhost:9000/',
  intercomId: 'wg81uhl3',
  systemMessage: {
    delay: 8000
  },
  dashboard: {
    showSubscriptions: true
  },
  timeframe: {
    // Set the offset in years for the default timerange
    defaultOffset: {
      end: 5,
      start: 2
    },
    intervals: ['quarterly', 'yearly'],
    // Maximum timerange in years
    maximumTimerangeYears: 14,
    maximumTimerangeQuarter: 10
  },
  REQUEST_TIMEOUT: 30000,
  logLevel: 'info',
  websocket: {
    host: 'http://localhost:3000'
  }
};
