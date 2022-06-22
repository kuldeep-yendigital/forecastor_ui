module.exports = {
  id: 'forecaster-welome-tour-01',
  onClose: 'endTour',
  steps: [{
    title: 'Welcome to Omdia Forecaster',
    content: 'This short tour will help you get started with Forecaster, the new home of Omdia 5-year forecasts.<br/><br/><span class="action">Click x to exit at any time.</span>',
    target: '[data-selector="tour"]',
    placement: 'bottom',
    arrowOffset: 'center',
    xOffset: -75
  },
  {
    title: 'This page is your dashboard',
    content: 'Popular Searches are links to useful data views.',
    target: '[data-selector="saved-search-title"]',
    placement: 'left',
    showNextButton: true
  },
  {
    title: 'Let’s get started by looking at some data',
    content: '<span class="action">Click "To data view" to see the default data view.<span>',
    target: '[data-selector="navigate-grid"]',
    placement: 'bottom',
    multipage: true,
    nextOnTargetClick: true,
    showNextButton: false,
    onNext: 'dynamicField',
    onShow: 'enable'
  },
  {
    title: 'This is the Data View',
    content: 'You can click "To dashboard" to return to the dashboard at any time. The default view is subscriptions and service revenues by country across our 5 year forecasts.',
    target: '[data-selector="navigate-dashboard"]',
    placement: 'bottom',
    xOffset: -50,
    arrowOffset: 50,
    showNextButton: true
  },
  {
    title: 'This is the search ribbon',
    content: 'You can use it to filter data in the grid by selecting combinations of filters.',
    target: '[data-selector=search-ribbon]',
    placement: 'right'
  },
  {
    title: 'Filters - Data Set',
    content: 'When you select a filter, like Data Set, the ribbon expands to show the levels you can select.<br/><br/>Data Sets are useful collections of forecast and historical data.',
    target: '[data-selector="taxonomy-item dataset"]',
    placement: 'right',
    xOffset: -30
  },
  {
    title: 'Filters - Metric',
    content: 'You can select the type of numerical measure here.<br/><br/>When you select a filter, like Metric, the ribbon expands to show the addional levels you can select.<br><br><span class="action">Click on "Metric" in the ribbon to expand the filter.</span>',
    target: '[data-selector="taxonomy-item metric"]',
    placement: 'right',
    xOffset: -30,
    multipage: true,
    nextOnTargetClick: true,
    showNextButton: false,
    onNext: 'dynamicField',
    onShow: 'enable'
  },
  {
    title: 'Search within filters',
    content: 'You can search within filters here.',
    target: '[data-selector="search-panel"]',
    placement: 'bottom'
  },
  {
    title: 'Expand the filter level',
    content: 'You can expand your filter level here.<br/><br/><span class="action">Click the arrow to continue.</span>',
    target: '[data-selector="multi-list-panel-item Financial"] [data-selector="next-link"]',
    placement: 'left',
    nextOnTargetClick: true,
    showNextButton: false,
    onNext: 'dynamicField',
    onShow: 'enable'
  },
  {
    title: 'Collapse the filter level',
    content: 'You can click back to higher filter levels here.<br/><br/><span class="action">Click on the arrow above to continue.</span>',
    target: '[data-selector="arrow-back"]',
    placement: 'bottom',
    nextOnTargetClick: true,
    showNextButton: false,
    onNext: ['click', '[data-selector="taxonomy-item metric"]'],
    onShow: 'enable'
  },
  {
    title: 'Select your Timeframe',
    content: 'You can select start and end dates here.',
    target: '[data-selector="taxonomy-item timeframe"]',
    placement: 'right',
    xOffset: -30,
    onShow: 'enable'
  },
  {
    title: 'Add and remove columns',
    content: 'Adding and removing columns enables you to see data and different levels of aggregation. If your filter returns no results, try expanding the columns.',
    target: '[data-selector="column-selector"]',
    placement: 'left',
    onShow: 'enable'
  },
  {
    title: 'Search filters',
    content: 'Use search filters to see the filters you have applied and to deselect them.',
    target: '[data-selector="show-active-filter-button"]',
    placement: 'left',
    onShow: 'enable'
  },
  {
    title: 'Export',
    content: 'When you have built a view that works, you can export to Excel or CSV file here.',
    target: '[data-selector="export"]',
    placement: 'left',
    onShow: 'enable'
  },
  {
    title: 'Save Search',
    content: 'Or save to your dashboard here. Just name your search and save.',
    target: '[data-selector="save-search-menu-button"]',
    placement: 'left',
    onShow: 'enable'
  },
  {
    title: 'Help & Feedback',
    content: 'That’s the end of the tour, we hope you enjoy exploring Forecaster. A further help guide is available by clicking your username above. Please use the chat feature to contact us directly with any issues or feedback.',
    target: '.intercom-launcher-frame',
    placement: 'top',
    xOffset: -270,
    arrowOffset: 270,
    showCTAButton: true,
    ctaLabel: 'Done',
    onCTA: 'endTour',
    showNextButton: false
  }]
};
