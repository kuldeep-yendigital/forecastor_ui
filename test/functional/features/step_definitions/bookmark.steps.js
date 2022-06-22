const {
  defineSupportCode
} = require('cucumber');

const hashMatchesType = (url, type) => {
  const result = url.match(/\/#\/grid\?s=(.*)$/);
  console.log(`hash matches type, url: ${url}, type expected: ${type}`);
  if (result) {
    const hash = result[1];
    console.log(`hash matches type, hash: ${hash}, type expected: ${type}`);
    return hash.indexOf(`${type}-`) !== -1;
  } else {
    return false;
  }
};

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -_';

const randomString = n => {
  let result = '';
  while (n-- > 0) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const randomTitle = () => randomString(40);
const randomDescription = () => randomString(200);
const randomBookmark = () => ({
  'title': randomTitle(),
  'description': randomDescription(),
  'type': 'saved',

  // TODO: Setup a number of preset bookmarks we can sample from
  'payload': {
    'query': {
      'filters': {},
      'compositeFilters': {
        'metric': [
          'Subscriptions'
        ],
        'services': [
          'Fixed broadband total'
        ],
        'geography': [
          'United Kingdom'
        ]
      },
      'range': {
        'interval': 'quarterly',
        'start': 1483228800000,
        'end': 1514678400000
      },
      'sortedColumnId': 'geographylevel1',
      'sortDirection': 'asc',
      'columnKeys': [
        'geographylevel1',
        'datasetlevel1',
        'metriclevel1',
        'metriclevel2',
        'metricindicator',
        'currency',
        'unit'
      ]
    },
    'pinned': [
      'datasetlevel1',
      'geographylevel1'
    ]
  }
});

defineSupportCode(function({Given}) {
  Given(/^I am given a "(.*)" bookmark$/, function(type) {
    this.client.waitUntil(() => hashMatchesType(this.client.getUrl(), type), this.EXPECTATION_TIMEOUT);
  });

  Given(/^I have a saved search$/, function() {
    const bookmark = randomBookmark();
    return this.getBookmarkClient().then(client =>
      client.deleteAllUserBookmarks().then(() => client.createBookmark(bookmark))
    );
  });

});
