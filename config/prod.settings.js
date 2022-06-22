const dataApiBase = 'https://forecaster-api.prod.tmt.informa-labs.com';
const exportApiBase = 'https://forecaster-export-api.prod.tmt.informa-labs.com';

window.config = window.config || {
  envName: 'prod',
  includeFullStory: true,
  dataApiBase: dataApiBase,
  taxonomyApiUrl: dataApiBase + '/dimensions',
  dataApiUrl: dataApiBase + '/query',
  searchUrl: dataApiBase + '/search',
  bookmarkCategoriesApiUrl: dataApiBase + '/bookmark-categories',
  bookmarkApiUrl: dataApiBase + '/bookmark',
  getFileUrl: dataApiBase + '/getFiles',
  exportApiUrl: exportApiBase + '/export',
  eventsUrl: exportApiBase + '/events',
  filterColumnDistinctUrl: dataApiBase + '/dimensions/filterDistinct',
  exportApi: exportApiBase,
  dashboardUrl: dataApiBase + '/dashboard',
  authDomain: 'ovumforecaster.eu.auth0.com',
  authClientId: '6dI7g5DdRLpoa0szjLSEpp6kDn6MJc2W',
  authAudience: 'https://api.forecaster.ovum.com/',
  dataStoreType: 'mssql',
  authLogoutUrl: 'http://localhost:9000/',
  intercomId: 'd35ke18f',
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
  gtmAuth: 'lIRV3A4Pv-KSq-TB91XCNw',
  gtmEnv: 'env-2',
  logLevel: 'error',
  REQUEST_TIMEOUT: 30000,
  websocket: {
    host: 'https://forecaster-api.prod.tmt.informa-labs.com'
  }
};
