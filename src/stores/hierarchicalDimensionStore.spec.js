import {EventAggregator} from 'aurelia-event-aggregator';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';
import * as GLOBAL_EVENTS from '../events';
import {FakeBindingEngine, FakeGenericService} from '../../test/unit/helpers/fakes';
import {Container} from 'aurelia-dependency-injection';
import Store from './store';
import {QueryStore} from "./queryStore";

const eventAggregator = new EventAggregator();
let store, service, bindingEngine, hashStateStoreMockData;
class MockHashStateStore extends Store {
  get EVENTS() {
    return [];
  }

  getDefaultState() {
    return hashStateStoreMockData;
  }
}

describe('Hierarchical Dimension Store', () => {
  beforeEach(() => {
    hashStateStoreMockData = {};

    let container = new Container().makeGlobal();
    service = new FakeGenericService();
    bindingEngine = new FakeBindingEngine();

    let hashStateStore = new MockHashStateStore(bindingEngine, eventAggregator, service);


    container.registerInstance(QueryStore, hashStateStore);
    store = new TestStore(bindingEngine, eventAggregator, service);
  });

  it('fetches data from the service and adds it to data prop', (done) => {
    const data = [];
    service.setData(data);

    eventAggregator.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, 'dimension');

    setTimeout(() => {
      expect(store.data.items).toEqual(data);
      done();
    });
  });


  it('sorts dimensions alphabetically by name', (done) => {
    const items = [{name: 'b'}, {name: 'A'}, {name: 'd'}, {name: 'C'}];
    store.setDefaultState({ items });

    setImmediate(() => {
      expect(store.data.items).toEqual([{name: 'A', state:0}, {name: 'b', state:0}, {name: 'C', state:0}, {name: 'd', state:0}]);
      done();
    });
  });

  // it('handles dataset dimension SELECT_ALL events', (done) => {
  //   const dataNoFilters = [ { "name": "All core datasets", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Broadband by Speed", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Core", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Core", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Data Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Mobile M2M Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Mobile MVNO Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Subscriptions Billing Type", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Subscriptions Excluding M2M", "count": 0, "children": [], "state": 0 }, { "name": "OTT Core", "count": 0, "children": [], "state": 0 }, { "name": "OTT SVOD Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Public Service TV", "count": 0, "children": [], "state": 0 }, { "name": "Smartphones", "count": 0, "children": [], "state": 0 }, { "name": "Tablets", "count": 0, "children": [], "state": 0 }, { "name": "TV Core", "count": 0, "children": [], "state": 0 }, { "name": "TV Devices", "count": 0, "children": [], "state": 0 }, { "name": "TV Subscriptions and Households", "count": 0, "children": [], "state": 0 } ]
  //   const dataAllFilters = [ { "name": "All core datasets", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Broadband by Speed", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Core", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Core", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Data Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Mobile M2M Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Mobile MVNO Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Subscriptions Billing Type", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Subscriptions Excluding M2M", "count": 0, "children": [], "state": 1 }, { "name": "OTT Core", "count": 0, "children": [], "state": 1 }, { "name": "OTT SVOD Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Public Service TV", "count": 0, "children": [], "state": 1 }, { "name": "Smartphones", "count": 0, "children": [], "state": 1 }, { "name": "Tablets", "count": 0, "children": [], "state": 1 }, { "name": "TV Core", "count": 0, "children": [], "state": 1 }, { "name": "TV Devices", "count": 0, "children": [], "state": 1 }, { "name": "TV Subscriptions and Households", "count": 0, "children": [], "state": 1 } ]
  //
  //   service.setData(dataNoFilters);
  //   eventAggregator.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, 'dimension');
  //
  //   setImmediate(() => {
  //     eventAggregator.publish(TEST_EVENTS.SELECT_ALL, dataNoFilters);
  //     setImmediate(() => {
  //       expect(store.data.items).toEqual(dataAllFilters);
  //       done();
  //     })
  //   });
  // });

  // it('handles dataset dimension UNSELECT_ALL events', (done) => {
  //
  //   const dataNoFilters = [ { "name": "All core datasets", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Broadband by Speed", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Core", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Core", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Data Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Mobile M2M Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Mobile MVNO Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Subscriptions Billing Type", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Subscriptions Excluding M2M", "count": 0, "children": [], "state": 0 }, { "name": "OTT Core", "count": 0, "children": [], "state": 0 }, { "name": "OTT SVOD Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Public Service TV", "count": 0, "children": [], "state": 0 }, { "name": "Smartphones", "count": 0, "children": [], "state": 0 }, { "name": "Tablets", "count": 0, "children": [], "state": 0 }, { "name": "TV Core", "count": 0, "children": [], "state": 0 }, { "name": "TV Devices", "count": 0, "children": [], "state": 0 }, { "name": "TV Subscriptions and Households", "count": 0, "children": [], "state": 0 } ]
  //   const dataAllFilters = [ { "name": "All core datasets", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Broadband by Speed", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Core", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Core", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Data Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Mobile M2M Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Mobile MVNO Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Subscriptions Billing Type", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Subscriptions Excluding M2M", "count": 0, "children": [], "state": 1 }, { "name": "OTT Core", "count": 0, "children": [], "state": 1 }, { "name": "OTT SVOD Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Public Service TV", "count": 0, "children": [], "state": 1 }, { "name": "Smartphones", "count": 0, "children": [], "state": 1 }, { "name": "Tablets", "count": 0, "children": [], "state": 1 }, { "name": "TV Core", "count": 0, "children": [], "state": 1 }, { "name": "TV Devices", "count": 0, "children": [], "state": 1 }, { "name": "TV Subscriptions and Households", "count": 0, "children": [], "state": 1 } ]
  //
  //   service.setData(dataAllFilters);
  //
  //   eventAggregator.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, 'dimension');
  //
  //   setImmediate(() => {
  //     eventAggregator.publish(TEST_EVENTS.UNSELECT_ALL, dataAllFilters);
  //     setImmediate(() => {
  //       expect(store.data.items).toEqual(dataNoFilters);
  //       done();
  //     })
  //   });
  // });


  // it('handles technology dimension SELECT_ALL events', (done) => {
  //   const dataAllFilters= [ { "name": "All Technologies Total", "count": 0, "children": [], "state": 1 }, { "name": "No Specific Technology", "count": 0, "children": [], "state": 1 }, { "name": "Wireless", "count": 2, "children": [ { "name": "Cellular", "count": 5, "children": [ { "name": "1G", "count": 1, "children": [ { "name": "1G Total", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "2G", "count": 5, "children": [ { "name": "1xRTT", "count": 0, "children": [], "state": 1 }, { "name": "GSM", "count": 0, "children": [], "state": 1 }, { "name": "PHS", "count": 0, "children": [], "state": 1 }, { "name": "US TDMA", "count": 0, "children": [], "state": 1 }, { "name": "iDEN", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "3G", "count": 3, "children": [ { "name": "1xEV-DO", "count": 0, "children": [], "state": 1 }, { "name": "TD-SCDMA", "count": 0, "children": [], "state": 1 }, { "name": "W-CDMA", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "4G", "count": 1, "children": [ { "name": "LTE", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "5G", "count": 1, "children": [ { "name": "-tba-5G-", "count": 0, "children": [], "state": 1 } ], "state": 1 } ], "state": 1 }, { "name": "Wireless Total", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "Wireline", "count": 2, "children": [ { "name": "Fixed", "count": 2, "children": [ { "name": "Broadband", "count": 5, "children": [ { "name": "Broadband Total", "count": 0, "children": [], "state": 1 }, { "name": "Cable modem", "count": 2, "children": [ { "name": "Cable modem Total", "count": 0, "children": [], "state": 1 }, { "name": "DOCSIS 3.0/3.1", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "DSL", "count": 1, "children": [ { "name": "DSL Total", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "Fibre", "count": 3, "children": [ { "name": "FTTH/B", "count": 0, "children": [], "state": 1 }, { "name": "FTTx", "count": 0, "children": [], "state": 1 }, { "name": "Fibre Total", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "Other BB Technologies", "count": 6, "children": [ { "name": "Ethernet inc UTP/FTP", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Wireless Broadband", "count": 3, "children": [ { "name": "Fixed Wireless LTE", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Wireless Proprietry", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Wireless WiMAX", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "Other BB Technologies Total", "count": 0, "children": [], "state": 1 }, { "name": "Powerline", "count": 0, "children": [], "state": 1 }, { "name": "Satellite - General", "count": 0, "children": [], "state": 1 }, { "name": "Unspecified Technologies", "count": 0, "children": [], "state": 1 } ], "state": 1 } ], "state": 1 }, { "name": "Voice", "count": 7, "children": [ { "name": "Cable Telephony", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Wireless", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Wireless Telephony", "count": 0, "children": [], "state": 1 }, { "name": "ISDN", "count": 0, "children": [], "state": 1 }, { "name": "PSTN", "count": 0, "children": [], "state": 1 }, { "name": "VoIP", "count": 0, "children": [], "state": 1 }, { "name": "Voice Total", "count": 0, "children": [], "state": 1 } ], "state": 1 } ], "state": 1 }, { "name": "TV", "count": 6, "children": [ { "name": "Analog TV", "count": 4, "children": [ { "name": "Analog Cable/MMDS", "count": 0, "children": [], "state": 1 }, { "name": "Analog Direct to Home (DTH)", "count": 0, "children": [], "state": 1 }, { "name": "Analog TV Total", "count": 0, "children": [], "state": 1 }, { "name": "Analog Terrestrial", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "Cable/MMDS", "count": 1, "children": [ { "name": "Cable/MMDS Total", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "Digital TV", "count": 5, "children": [ { "name": "Digital Cable/MMDS", "count": 0, "children": [], "state": 1 }, { "name": "Digital Direct to Home (DTH)", "count": 0, "children": [], "state": 1 }, { "name": "Digital TV Total", "count": 0, "children": [], "state": 1 }, { "name": "Digital Terrestrial", "count": 0, "children": [], "state": 1 }, { "name": "IPTV", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "Direct to Home (DTH)", "count": 1, "children": [ { "name": "Direct to Home (DTH) Total", "count": 0, "children": [], "state": 1 } ], "state": 1 }, { "name": "TV Total", "count": 0, "children": [], "state": 1 }, { "name": "Terrestrial", "count": 1, "children": [ { "name": "Terrestrial Total", "count": 0, "children": [], "state": 1 } ], "state": 1 } ], "state": 1 } ], "state": 1 } ]
  //   const dataNoFilters = [ { "name": "All Technologies Total", "count": 0, "children": [], "state": 0 }, { "name": "No Specific Technology", "count": 0, "children": [], "state": 0 }, { "name": "Wireless", "count": 2, "children": [ { "name": "Cellular", "count": 5, "children": [ { "name": "1G", "count": 1, "children": [ { "name": "1G Total", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "2G", "count": 5, "children": [ { "name": "1xRTT", "count": 0, "children": [], "state": 0 }, { "name": "GSM", "count": 0, "children": [], "state": 0 }, { "name": "PHS", "count": 0, "children": [], "state": 0 }, { "name": "US TDMA", "count": 0, "children": [], "state": 0 }, { "name": "iDEN", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "3G", "count": 3, "children": [ { "name": "1xEV-DO", "count": 0, "children": [], "state": 0 }, { "name": "TD-SCDMA", "count": 0, "children": [], "state": 0 }, { "name": "W-CDMA", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "4G", "count": 1, "children": [ { "name": "LTE", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "5G", "count": 1, "children": [ { "name": "-tba-5G-", "count": 0, "children": [], "state": 0 } ], "state": 0 } ], "state": 0 }, { "name": "Wireless Total", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "Wireline", "count": 2, "children": [ { "name": "Fixed", "count": 2, "children": [ { "name": "Broadband", "count": 5, "children": [ { "name": "Broadband Total", "count": 0, "children": [], "state": 0 }, { "name": "Cable modem", "count": 2, "children": [ { "name": "Cable modem Total", "count": 0, "children": [], "state": 0 }, { "name": "DOCSIS 3.0/3.1", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "DSL", "count": 1, "children": [ { "name": "DSL Total", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "Fibre", "count": 3, "children": [ { "name": "FTTH/B", "count": 0, "children": [], "state": 0 }, { "name": "FTTx", "count": 0, "children": [], "state": 0 }, { "name": "Fibre Total", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "Other BB Technologies", "count": 6, "children": [ { "name": "Ethernet inc UTP/FTP", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Wireless Broadband", "count": 3, "children": [ { "name": "Fixed Wireless LTE", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Wireless Proprietry", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Wireless WiMAX", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "Other BB Technologies Total", "count": 0, "children": [], "state": 0 }, { "name": "Powerline", "count": 0, "children": [], "state": 0 }, { "name": "Satellite - General", "count": 0, "children": [], "state": 0 }, { "name": "Unspecified Technologies", "count": 0, "children": [], "state": 0 } ], "state": 0 } ], "state": 0 }, { "name": "Voice", "count": 7, "children": [ { "name": "Cable Telephony", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Wireless", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Wireless Telephony", "count": 0, "children": [], "state": 0 }, { "name": "ISDN", "count": 0, "children": [], "state": 0 }, { "name": "PSTN", "count": 0, "children": [], "state": 0 }, { "name": "VoIP", "count": 0, "children": [], "state": 0 }, { "name": "Voice Total", "count": 0, "children": [], "state": 0 } ], "state": 0 } ], "state": 0 }, { "name": "TV", "count": 6, "children": [ { "name": "Analog TV", "count": 4, "children": [ { "name": "Analog Cable/MMDS", "count": 0, "children": [], "state": 0 }, { "name": "Analog Direct to Home (DTH)", "count": 0, "children": [], "state": 0 }, { "name": "Analog TV Total", "count": 0, "children": [], "state": 0 }, { "name": "Analog Terrestrial", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "Cable/MMDS", "count": 1, "children": [ { "name": "Cable/MMDS Total", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "Digital TV", "count": 5, "children": [ { "name": "Digital Cable/MMDS", "count": 0, "children": [], "state": 0 }, { "name": "Digital Direct to Home (DTH)", "count": 0, "children": [], "state": 0 }, { "name": "Digital TV Total", "count": 0, "children": [], "state": 0 }, { "name": "Digital Terrestrial", "count": 0, "children": [], "state": 0 }, { "name": "IPTV", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "Direct to Home (DTH)", "count": 1, "children": [ { "name": "Direct to Home (DTH) Total", "count": 0, "children": [], "state": 0 } ], "state": 0 }, { "name": "TV Total", "count": 0, "children": [], "state": 0 }, { "name": "Terrestrial", "count": 1, "children": [ { "name": "Terrestrial Total", "count": 0, "children": [], "state": 0 } ], "state": 0 } ], "state": 0 } ], "state": 0 } ]
  //
  //   service.setData(dataNoFilters);
  //   eventAggregator.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, 'dimension');
  //
  //   setImmediate(() => {
  //     eventAggregator.publish(TEST_EVENTS.SELECT_ALL, dataNoFilters);
  //     setImmediate(() => {
  //       expect(store.data.items).toEqual(dataAllFilters);
  //       done();
  //     })
  //   });
  // });

  // it('handles technology dimension UNSELECT_ALL events (with children)', (done) => {
  //
  //   const dataNoFilters = [ { "name": "All core datasets", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Broadband by Speed", "count": 0, "children": [], "state": 0 }, { "name": "Fixed Core", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Core", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Data Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Mobile M2M Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Mobile MVNO Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Subscriptions Billing Type", "count": 0, "children": [], "state": 0 }, { "name": "Mobile Subscriptions Excluding M2M", "count": 0, "children": [], "state": 0 }, { "name": "OTT Core", "count": 0, "children": [], "state": 0 }, { "name": "OTT SVOD Subscriptions", "count": 0, "children": [], "state": 0 }, { "name": "Public Service TV", "count": 0, "children": [], "state": 0 }, { "name": "Smartphones", "count": 0, "children": [], "state": 0 }, { "name": "Tablets", "count": 0, "children": [], "state": 0 }, { "name": "TV Core", "count": 0, "children": [], "state": 0 }, { "name": "TV Devices", "count": 0, "children": [], "state": 0 }, { "name": "TV Subscriptions and Households", "count": 0, "children": [], "state": 0 } ]
  //   const dataAllFilters = [ { "name": "All core datasets", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Broadband by Speed", "count": 0, "children": [], "state": 1 }, { "name": "Fixed Core", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Core", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Data Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Mobile M2M Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Mobile MVNO Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Subscriptions Billing Type", "count": 0, "children": [], "state": 1 }, { "name": "Mobile Subscriptions Excluding M2M", "count": 0, "children": [], "state": 1 }, { "name": "OTT Core", "count": 0, "children": [], "state": 1 }, { "name": "OTT SVOD Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Public Service TV", "count": 0, "children": [], "state": 1 }, { "name": "Smartphones", "count": 0, "children": [], "state": 1 }, { "name": "Tablets", "count": 0, "children": [], "state": 1 }, { "name": "TV Core", "count": 0, "children": [], "state": 1 }, { "name": "TV Devices", "count": 0, "children": [], "state": 1 }, { "name": "TV Subscriptions and Households", "count": 0, "children": [], "state": 1 } ]
  //
  //   service.setData(dataAllFilters);
  //
  //   eventAggregator.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, 'dimension');
  //
  //   setImmediate(() => {
  //     eventAggregator.publish(TEST_EVENTS.UNSELECT_ALL, dataAllFilters);
  //     setImmediate(() => {
  //       expect(store.data.items).toEqual(dataNoFilters);
  //       done();
  //     })
  //   });
  // });


  // it('handles metrics dimension SELECT_ALL events (with children)', (done) => {
  //
  //   const dataNoFilters = [ { "name": "Advertising Revenues", "count": 0, "children": [], "state": 0 }, { "name": "Call Revenues", "count": 0, "children": [], "state": 0 }, { "name": "CAPEX", "count": 0, "children": [], "state": 0 }, { "name": "EBIT", "count": 0, "children": [], "state": 0 }, { "name": "EBITDA", "count": 0, "children": [], "state": 0 }, { "name": "EBITDA margin", "count": 0, "children": [], "state": 0 }, { "name": "EBT", "count": 0, "children": [], "state": 0 }, { "name": "Households", "count": 0, "children": [], "state": 0 }, { "name": "Installed Base", "count": 0, "children": [], "state": 0 }, { "name": "Lines", "count": 0, "children": [], "state": 0 }, { "name": "OPEX (Reported)", "count": 0, "children": [], "state": 0 }, { "name": "Primary Households", "count": 0, "children": [], "state": 0 }, { "name": "Service Revenues", "count": 0, "children": [], "state": 0 }, { "name": "Subscriber Acquisition Cost", "count": 0, "children": [], "state": 0 }, { "name": "Subscription Revenues", "count": 0, "children": [], "state": 0 }, { "name": "Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Total Revenue", "count": 0, "children": [], "state": 0 }, { "name": "TV Household", "count": 0, "children": [], "state": 0 }, { "name": "Unique Users", "count": 0, "children": [], "state": 0 } ];
  //   const dataAllFilters = [ { "name": "Advertising Revenues", "count": 0, "children": [], "state": 1 }, { "name": "Call Revenues", "count": 0, "children": [], "state": 1 }, { "name": "CAPEX", "count": 0, "children": [], "state": 1 }, { "name": "EBIT", "count": 0, "children": [], "state": 1 }, { "name": "EBITDA", "count": 0, "children": [], "state": 1 }, { "name": "EBITDA margin", "count": 0, "children": [], "state": 1 }, { "name": "EBT", "count": 0, "children": [], "state": 1 }, { "name": "Households", "count": 0, "children": [], "state": 1 }, { "name": "Installed Base", "count": 0, "children": [], "state": 1 }, { "name": "Lines", "count": 0, "children": [], "state": 1 }, { "name": "OPEX (Reported)", "count": 0, "children": [], "state": 1 }, { "name": "Primary Households", "count": 0, "children": [], "state": 1 }, { "name": "Service Revenues", "count": 0, "children": [], "state": 1 }, { "name": "Subscriber Acquisition Cost", "count": 0, "children": [], "state": 1 }, { "name": "Subscription Revenues", "count": 0, "children": [], "state": 1 }, { "name": "Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Total Revenue", "count": 0, "children": [], "state": 1 }, { "name": "TV Household", "count": 0, "children": [], "state": 1 }, { "name": "Unique Users", "count": 0, "children": [], "state": 1 } ]
  //
  //   service.setData(dataNoFilters);
  //   eventAggregator.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, 'dimension');
  //
  //   setImmediate(() => {
  //     eventAggregator.publish(TEST_EVENTS.SELECT_ALL, dataNoFilters);
  //     setImmediate(() => {
  //       expect(store.data.items).toEqual(dataAllFilters);
  //       done();
  //     })
  //   });
  // });

  // it('handles metrics dimension UNSELECT_ALL events that leaves out the subscription field', (done) => {
  //
  //   const dataNoFilters = [ { "name": "Advertising Revenues", "count": 0, "children": [], "state": 0 }, { "name": "Call Revenues", "count": 0, "children": [], "state": 0 }, { "name": "CAPEX", "count": 0, "children": [], "state": 0 }, { "name": "EBIT", "count": 0, "children": [], "state": 0 }, { "name": "EBITDA", "count": 0, "children": [], "state": 0 }, { "name": "EBITDA margin", "count": 0, "children": [], "state": 0 }, { "name": "EBT", "count": 0, "children": [], "state": 0 }, { "name": "Households", "count": 0, "children": [], "state": 0 }, { "name": "Installed Base", "count": 0, "children": [], "state": 0 }, { "name": "Lines", "count": 0, "children": [], "state": 0 }, { "name": "OPEX (Reported)", "count": 0, "children": [], "state": 0 }, { "name": "Primary Households", "count": 0, "children": [], "state": 0 }, { "name": "Service Revenues", "count": 0, "children": [], "state": 0 }, { "name": "Subscriber Acquisition Cost", "count": 0, "children": [], "state": 0 }, { "name": "Subscription Revenues", "count": 0, "children": [], "state": 0 }, { "name": "Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Total Revenue", "count": 0, "children": [], "state": 0 }, { "name": "TV Household", "count": 0, "children": [], "state": 0 }, { "name": "Unique Users", "count": 0, "children": [], "state": 0 } ];
  //   const dataAllFilters = [ { "name": "Advertising Revenues", "count": 0, "children": [], "state": 1 }, { "name": "Call Revenues", "count": 0, "children": [], "state": 1 }, { "name": "CAPEX", "count": 0, "children": [], "state": 1 }, { "name": "EBIT", "count": 0, "children": [], "state": 1 }, { "name": "EBITDA", "count": 0, "children": [], "state": 1 }, { "name": "EBITDA margin", "count": 0, "children": [], "state": 1 }, { "name": "EBT", "count": 0, "children": [], "state": 1 }, { "name": "Households", "count": 0, "children": [], "state": 1 }, { "name": "Installed Base", "count": 0, "children": [], "state": 1 }, { "name": "Lines", "count": 0, "children": [], "state": 1 }, { "name": "OPEX (Reported)", "count": 0, "children": [], "state": 1 }, { "name": "Primary Households", "count": 0, "children": [], "state": 1 }, { "name": "Service Revenues", "count": 0, "children": [], "state": 1 }, { "name": "Subscriber Acquisition Cost", "count": 0, "children": [], "state": 1 }, { "name": "Subscription Revenues", "count": 0, "children": [], "state": 1 }, { "name": "Subscriptions", "count": 0, "children": [], "state": 1 }, { "name": "Total Revenue", "count": 0, "children": [], "state": 1 }, { "name": "TV Household", "count": 0, "children": [], "state": 1 }, { "name": "Unique Users", "count": 0, "children": [], "state": 1 } ]
  //
  //   service.setData(dataAllFilters);
  //
  //   eventAggregator.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, 'dimension');
  //
  //   setImmediate(() => {
  //     eventAggregator.publish(TEST_EVENTS.UNSELECT_ALL, dataAllFilters);
  //     setImmediate(() => {
  //       expect(store.data.items).toEqual(dataNoFilters);
  //       done();
  //     })
  //   });
  // });

});

const TEST_EVENTS = {
  PARENT_REQUESTED: 'TestPanel_ParentRequested',
  CHILDREN_REQUESTED: 'TestPanel_ChildrenRequested',
  PARENT_SELECTED: 'TestPanel_ParentSelected',
  PARENT_UNSELECTED: 'TestPanel_ParentUnSelected',
  CHILD_SELECTED: 'TestPanel_ChildSelected',
  CHILD_UNSELECTED: 'TestPanel_ChildUnSelected',
  UNSELECT_ALL: 'TestPanelPanel_unselect_all',
  SELECT_ALL: 'TestPanelPanel_select_all'
};

class TestStore extends HierarchicalDimensionStore {
  constructor(BindingEngine, EventAggregator, GenericService) {
    super('Dimension', 'dimension', TEST_EVENTS, BindingEngine, EventAggregator, GenericService);
  }

  get EVENTS() {
    return [
      GLOBAL_EVENTS.FETCH_TAXONOMY_DATA,
      TEST_EVENTS.PARENT_REQUESTED,
      TEST_EVENTS.CHILDREN_REQUESTED,
      TEST_EVENTS.PARENT_SELECTED,
      TEST_EVENTS.PARENT_UNSELECTED,
      TEST_EVENTS.CHILD_SELECTED,
      TEST_EVENTS.CHILD_UNSELECTED,
      TEST_EVENTS.UNSELECT_ALL,
      TEST_EVENTS.SELECT_ALL
    ];
  }
}
