// const dataApiBase = 'http://localhost:3000';
const dataApiBase = 'https://forecaster-api.qa.tmt.informa-labs.com';
const exportApiBase = 'https://forecaster-export-api.qa.tmt.informa-labs.com';

window.config = window.config || {
  envName: 'qa',
  includeFullStory: true,
  dataApiBase: dataApiBase,
  taxonomyApiUrl: dataApiBase + '/dimensions',
  dataApiUrl: dataApiBase + '/query',
  searchUrl: dataApiBase + '/search',
  bookmarkApiUrl: dataApiBase + '/bookmark',
  bookmarkCategoriesApiUrl: dataApiBase + '/bookmark-categories',
  getFileUrl: dataApiBase + '/getFiles',
  exportApiUrl: exportApiBase + '/export',
  eventsUrl: exportApiBase + '/events',
  filterColumnDistinctUrl: dataApiBase + '/dimensions/filterDistinct',
  dashboardUrl: dataApiBase + '/dashboard',
  exportApi: exportApiBase,
  authDomain: 'ovumforecaster.eu.auth0.com',
  authClientId: '2Fv9QNdqVEp9MHDipGWX3oMC481Z2ktb',
  authAudience: 'https://api.forecaster.qa.tmt.informa-labs.com/',
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
  gtmAuth: '3b4q4qfgJTc0P2PLcaqcog',
  gtmEnv: 'env-18',
  adobeAccount: 'informaovumdatatoolsdev',
  adobeTrackingServer: 'informa.d2.sc.omtrdc.net',
  adobeVisitorNamespace: 'informa',
  adobeVisitor: '301334FA53DB0A850A490D44@AdobeOrg',
  logLevel: 'error',
  REQUEST_TIMEOUT: 30000,
  websocket: {
    host: dataApiBase
  }
};
