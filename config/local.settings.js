const dataApiBase = 'http://localhost:3000';
const exportApiBase = 'http://localhost:3001';

window.config = window.config || {
  envName: 'local',
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
  exportApi: exportApiBase,
  dashboardUrl: dataApiBase + '/dashboard',
  filterColumnDistinctUrl: dataApiBase + '/dimensions/filterDistinct',
  authDomain: 'ovumforecaster.eu.auth0.com',
  authClientId: '5QETG4av3ZF9QUAKzSlrHUcEwUCyJzRw',
  authAudience: 'https://api.forecaster.dev.tmt.informa-labs.com/',
  dataStoreType: 'mssql',
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
  logLevel: 'info',
  REQUEST_TIMEOUT: 30000,
  websocket: {
    host: 'http://localhost:3000'
  }
};
