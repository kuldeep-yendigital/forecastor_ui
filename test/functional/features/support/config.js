module.exports = {

  lookups: {
    'auth0-username': '.auth0-lock-input-email .auth0-lock-input',
    'auth0-password': '.auth0-lock-input-show-password .auth0-lock-input',
    'auth0-login-button': '.auth0-label-submit',
    'auth0-notyouraccount': '.auth0-lock-alternative-link',

    'intercom': '#intercom-frame',
    'intercom-launcher': '#intercom-container .intercom-launcher-discovery-frame',
    'intercom-messenger': '#intercom-container .intercom-messenger-frame',

    'first-list-panel-item': '[data-selector*="list-panel-item"]:nth-child(1)',
    'first-list-panel-item-arrow': '[data-selector*="list-panel-item"]:nth-child(1) [data-selector="next-link"]',
    'first-simple-list-panel-item': '.Simple[data-selector*="list-panel-item"]:nth-child(1)',
    'first-row-select-checkbox': '[data-selector="pinned-data-grid"] [data-selector="data-grid-row"]:nth-child(1) [data-selector="select-row-checkbox"]',
    'last-row': '[data-selector="data-grid-row"]:last-child',
    'second-row-select-checkbox': '[data-selector="pinned-data-grid"] [data-selector="data-grid-row"]:nth-child(2) [data-selector="select-row-checkbox"]',

    'pinned-columns': 'pinned-data-grid|column-header',
    'unpinned-columns': 'unpinned-data-grid|column-header',
    'unpinned-data-scrolling': 'unpinned-data-grid|data-grid-data',

    'plot-trace': '[data-selector="visualisation"] .plot .trace',
    'save-to-plotly-cloud': '.modebar-btn[data-title="Save and edit plot in cloud"]',
    'timeframe-quarterly': '[data-selector~="timeframe-option-quarterly"] + [data-selector~="timeframe-option-label"]',
    'timeframe-yearly': '[data-selector~="timeframe-option-yearly"] + [data-selector~="timeframe-option-label"]',

    'export-in-progress': '[data-selector~="export"].in-progress'
  }
};
