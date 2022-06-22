// const dataApiBase = 'http://localhost:3000';
const dataApiBase = 'https://forecaster-api.dev.tmt.informa-labs.com';
const exportApiBase = 'https://forecaster-export-api.dev.tmt.informa-labs.com';

window.config = window.config || {
  envName: 'dev',
  includeFullStory: false,
  dataApiBase: dataApiBase,
  taxonomyApiUrl: dataApiBase + '/dimensions',
  dataApiUrl: dataApiBase + '/query',
  searchUrl: dataApiBase + '/search',
  bookmarkCategoriesApiUrl: dataApiBase + '/bookmark-categories',
  bookmarkApiUrl: dataApiBase + '/bookmark',
  getFileUrl: dataApiBase + '/getFiles',
  exportApiUrl: exportApiBase + '/export',
  eventsUrl: exportApiBase + '/events',
  dashboardUrl: dataApiBase + '/dashboard',
  filterColumnDistinctUrl: dataApiBase + '/dimensions/filterDistinct',
  exportApi: exportApiBase,
  authDomain: 'ovumforecaster.eu.auth0.com',
  authClientId: 'P7snk2228sXwKLbDJnjeeo0MI63jhTSr',
  authAudience: 'https://api.forecaster.dev.tmt.informa-labs.com/',
  dataStoreType: 'mssql',
  authLogoutUrl: 'http://localhost:9000/',
  intercomId: 'wg81uhl3',
  longFetchTimerMs: 20000,
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
  gtmId: 'GTM-NLQGG8P',
  gtmAuth: 'eur9GQevo3bSRqUlkB3BLw',
  gtmEnv: 'env-19',
  logLevel: 'error',
  REQUEST_TIMEOUT: 30000,
  websocket: {
    host: 'https://forecaster-api.dev.tmt.informa-labs.com'
  }
};
