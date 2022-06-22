import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {DataStore} from '../../stores/dataStore';
import Store from '../../stores/store';
import {flattenDatapoints} from "./index";
import {DatapointFormatterValueConverter} from "../../value-converters/datapoint-formatter";
import {addCommas, toTwoDecimalPlaces, toZeroDecimalPlaces} from "../../value-converters/number-format";

describe('data grid', () => {
  let component;
  let model;
  let mockData;

  class mockStore extends Store {
    get EVENTS() {
      return [];
    }

    getDefaultState() {
      return mockData;
    }
  }

  beforeEach(done => {
    model = {data: {}};
    component = StageComponent
      .withResources(PLATFORM.moduleName('components/data-grid/index'))
      .inView('<data-grid></data-grid>')
      .boundTo(model);

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerSingleton(DataStore, mockStore);
    });

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
    document.body.innerHTML = '';
  });

  describe('Grid', () => {
    it('should render no rows when no data provided', (done) => {
      setImmediate(() => {
        expect(getNumberOfRows()).toBe(0);
        done();
      });
    });

    it('should render each record in a row', (done) => {
      const startDate = new Date(Date.parse('Jan 01, 2015 UTC')).getTime();
      const endDate = new Date(Date.parse('Dec 31, 2017 UTC')).getTime();
      component.viewModel.dataStore.data = {
        "keys": [],
        "dateRange": {start: startDate, end: endDate},
        "records": [
          {
            "version": "Actual",
            "reportingcurrency": "Local",
            "billingtype": "Paid for Total",
            "source": "Real",
            "currencytype": "Base",
            "channel": "No Specific Channel",
            "customer": "No Specific Customer Type",
            "device": "No Specific Device",
            "networkstatus": "No Specific Network Status",
            "platform": "No Specific Platform",
            "priceband": "No Specific Price Band",
            "servicetype": "Mobile Connectivity Total",
            "technology": "Wireless Total",
            "company": "BG0I8FE0Q",
            "metric": "Service Revenues",
            "currency": "EUR",
            "country": "Austria",
            "region": "Western Europe",
            "unit": "Absolute",
            "datapoints": [
              {
                "month": "31/03/2006",
                "value": "209"
              },
              {
                "month": "30/06/2006",
                "value": "271"
              }
            ]
          },
          {
            "version": "Actual",
            "reportingcurrency": "Local",
            "billingtype": "Paid for Total",
            "source": "Real",
            "currencytype": "Base",
            "channel": "No Specific Channel",
            "customer": "No Specific Customer Type",
            "device": "No Specific Device",
            "networkstatus": "No Specific Network Status",
            "platform": "No Specific Platform",
            "priceband": "No Specific Price Band",
            "servicetype": "Mobile Non Voice Total",
            "technology": "Wireless Total",
            "company": "BG0I8FE0Q",
            "metric": "Service Revenues",
            "currency": "EUR",
            "country": "Austria",
            "region": "Western Europe",
            "unit": "Absolute",
            "datapoints": [
              {
                "month": "30/09/2012",
                "value": "82.41"
              },
              {
                "month": "31/12/2012",
                "value": "81.06"
              },
              {
                "month": "31/03/2013",
                "value": "81.8"
              }
            ]
          },
          {
            "version": "Actual",
            "reportingcurrency": "Local",
            "billingtype": "Paid for Total",
            "source": "Real",
            "currencytype": "Base",
            "channel": "No Specific Channel",
            "customer": "No Specific Customer Type",
            "device": "No Specific Device",
            "networkstatus": "No Specific Network Status",
            "platform": "No Specific Platform",
            "priceband": "No Specific Price Band",
            "servicetype": "Mobile Non Voice Total",
            "technology": "Wireless Total",
            "company": "BG0I8FE0Q",
            "metric": "Service Revenues",
            "currency": "USD",
            "country": "Austria",
            "region": "Western Europe",
            "unit": "Absolute",
            "datapoints": [
              {
                "month": "31/03/2004",
                "value": "31.61"
              },
              {
                "month": "30/06/2004",
                "value": "25.4"
              },
              {
                "month": "30/09/2004",
                "value": "27.4"
              }
            ]
          }
        ]
      };

      setImmediate(() => {
        expect(getNumberOfRows()).toBe(3);
        done();
      });
    });

  });

  describe('Columns', () => {

    beforeEach(done => {
      component.viewModel.columnStore.data.columns = [
        {display: 'field1', field: 'field1_field', parent: 'group1', checked: true},
        {display: 'field2', field: 'field2_field', parent: 'group1', checked: true},
        {display: 'field3', field: 'companyname_name', parent: 'group2', checked: true}
      ];

      setImmediate(() => {
        done();
      });
    });

    it('should render column group headings', () => {
      component.viewModel.generateGrid();
      expect(component.viewModel.groupHeaders).toEqual([
        {label: 'group1', key: 'group1', colspan: 2},
        {label: 'group2', key: 'group2', colspan: 1}]);
    });

    it('should render columns', () => {
      spyOn(component.viewModel, 'getNumericalHeaders').and.returnValue([]);
      component.viewModel.generateGrid();

      expect(component.viewModel.headers).toEqual([{
        "display": "field1",
        "field": "field1_field",
        "parent": "group1",
        "checked": true
      }, {"display": "field2", "field": "field2_field", "parent": "group1", "checked": true}, {
        "display": "field3", "field": "companyname_name", "parent": "group2", "checked": true
      }]);
    });

    describe('Quarterly interval', () => {
      it('should render quarters as columns when quarterly date range specified for a whole year', () => {
        const JANUARY = 0;
        const DECEMBER = 11;
        const start = Date.UTC(2015, JANUARY, 1);
        const end = Date.UTC(2015, DECEMBER, 31);
        const dateRange = {start, end, interval: 'quarterly'};

        const numericalHeaders = component.viewModel.getNumericalHeaders(dateRange);
        expect(numericalHeaders).toEqual([
          {key: '31/03/2015', label: 'Q1 2015', type: 'numeric'},
          {key: '30/06/2015', label: 'Q2 2015', type: 'numeric'},
          {key: '30/09/2015', label: 'Q3 2015', type: 'numeric'},
          {key: '31/12/2015', label: 'Q4 2015', type: 'numeric'}]);
      });

      it('should render quarters as columns when quarterly date range specified between years', () => {
        const APRIL = 3;
        const JUNE = 5;
        const start = Date.UTC(2015, APRIL, 1);
        const end = Date.UTC(2016, JUNE, 30);
        const dateRange = {start, end, interval: 'quarterly'};

        const numericalHeaders = component.viewModel.getNumericalHeaders(dateRange);
        expect(numericalHeaders).toEqual([
          {key: '30/06/2015', label: 'Q2 2015', type: 'numeric'},
          {key: '30/09/2015', label: 'Q3 2015', type: 'numeric'},
          {key: '31/12/2015', label: 'Q4 2015', type: 'numeric'},
          {key: '31/03/2016', label: 'Q1 2016', type: 'numeric'},
          {key: '30/06/2016', label: 'Q2 2016', type: 'numeric'}]);
      });
    });

    describe('Yearly interval', () => {
      it('should render years as columns when yearly date range specified', () => {
        const JANUARY = 0;
        const DECEMBER = 11;
        const start = Date.UTC(2015, JANUARY, 1);
        const end = Date.UTC(2017, DECEMBER, 31);
        const dateRange = {start, end, interval: 'yearly'};

        const numericalHeaders = component.viewModel.getNumericalHeaders(dateRange);
        expect(numericalHeaders).toEqual([
          {key: '31/12/2015', label: '2015', type: 'numeric'},
          {key: '31/12/2016', label: '2016', type: 'numeric'},
          {key: '31/12/2017', label: '2017', type: 'numeric'}]);
      });
    });
  });

  describe('Loading', () => {
    it('should display loading mesage and disable overlay on initial load', () => {
      expect(getDisableOverlay()).not.toBe(null);
      expect(getMessage().textContent).toBe('Loading. Please wait...');
    });

    it('should hide disable overlay when finished updating', (done) => {
      component.viewModel.dataStore.data = {isUpdating: false};

      setImmediate(() => {
        expect(getDisableOverlay()).toBe(null);
        done();
      });
    });

    it('should show disable overlay without loading text when updating', (done) => {
      component.viewModel.dataStore.data = {isUpdating: false};

      setImmediate(() => {
        component.viewModel.dataStore.data = {isUpdating: true};

        setTimeout(() => {
          expect(getDisableOverlay()).not.toBe(null);
          expect(getMessage()).toBe(null);
          done();
        }, 500);
      });
    });
  });

  describe('Helpers - flattenDatapoints', () => {
    let formatter;

    beforeEach(() => {
      formatter = new DatapointFormatterValueConverter();
    });

    it('should set type to numeric and set currency to true for monetary data', () => {
      const record = {
        "geographylevel1": "Africa",
        "geographylevel2": "Chad",
        "serviceslevel1": "Service Provider and Markets",
        "dataset": "Mobile Network Operator Services",
        "metriclevel1": "Service Revenues",
        "metriclevel2": null,
        "metricindicator": "Growth rate (absolute)",
        "currency": "USD",
        "unit": "Absolute",
        "31/12/2015": -66301424.57450001,
        "31/12/2016": 9898247.979500014,
        "31/12/2017": -3472575.7450000094,
        "31/12/2018": null,
        "31/12/2019": null,
        "31/12/2020": null,
        "31/12/2021": null,
        "31/12/2022": null,
        "avg_31/12/2015": "Computed",
        "avg_31/12/2016": "Computed",
        "avg_31/12/2017": "Computed",
        "avg_31/12/2018": "Market Intelligence",
        "avg_31/12/2019": "Market Intelligence",
        "avg_31/12/2020": "Market Intelligence",
        "avg_31/12/2021": "Market Intelligence",
        "avg_31/12/2022": "Market Intelligence",
        "avgColour": "Market Intelligence",
        "datapoints": [
          {
            "month": "31/12/2015",
            "value": -66301424.57450001,
            "name": "Computed"
          },
          {
            "month": "31/12/2016",
            "value": 9898247.979500014,
            "name": "Computed"
          },
          {
            "month": "31/12/2017",
            "value": -3472575.7450000094,
            "name": "Computed"
          },
          {
            "month": "31/12/2018",
            "value": null,
            "name": "Market Intelligence"
          },
          {
            "month": "31/12/2019",
            "value": null,
            "name": "Market Intelligence"
          },
          {
            "month": "31/12/2020",
            "value": null,
            "name": "Market Intelligence"
          },
          {
            "month": "31/12/2021",
            "value": null,
            "name": "Market Intelligence"
          },
          {
            "month": "31/12/2022",
            "value": null,
            "name": "Market Intelligence"
          }
        ]
      };

      const formattedRecord = flattenDatapoints(record);

      formattedRecord.datapoints.forEach(data => {
        expect(record[data.month].type).toEqual('numeric');
        expect(record[data.month].isCurrency).toEqual(true);
        if(record[data.month].value) {
          expect(addCommas(toTwoDecimalPlaces(record[data.month].value)))
            .toEqual(formatter.toView(record[data.month]));
        }
      });
    });

    it('should format correctly percentage values', () => {
      const record = {
        "geographylevel1": "Africa",
        "geographylevel2": "Ghana",
        "serviceslevel1": "Service Provider and Markets",
        "dataset": "Mobile Data Subscriptions",
        "metriclevel1": "Data Revenue % of Service Revenue",
        "metriclevel2": null,
        "metricindicator": "Growth rate (absolute)",
        "currency": "",
        "unit": "%",
        "31/12/2015": 61.25999999999999,
        "31/12/2016": 53.400000000000006,
        "31/12/2017": null,
        "31/12/2018": null,
        "31/12/2019": null,
        "31/12/2020": null,
        "31/12/2021": null,
        "31/12/2022": null,
        "avg_31/12/2015": "Computed",
        "avg_31/12/2016": "Computed",
        "avg_31/12/2017": "Market Intelligence",
        "avg_31/12/2018": "Market Intelligence",
        "avg_31/12/2019": "Market Intelligence",
        "avg_31/12/2020": "Market Intelligence",
        "avg_31/12/2021": "Market Intelligence",
        "avg_31/12/2022": "Market Intelligence",
        "avgColour": "Market Intelligence",
        "datapoints": [
          {
            "month": "31/12/2015",
            "value": 61.25999999999999,
            "name": "Computed"
          },
          {
            "month": "31/12/2016",
            "value": 53.400000000000006,
            "name": "Computed"
          },
          {
            "month": "31/12/2017",
            "value": null,
            "name": "Market Intelligence"
          },
          {
            "month": "31/12/2018",
            "value": null,
            "name": "Market Intelligence"
          },
          {
            "month": "31/12/2019",
            "value": null,
            "name": "Market Intelligence"
          },
          {
            "month": "31/12/2020",
            "value": null,
            "name": "Market Intelligence"
          },
          {
            "month": "31/12/2021",
            "value": null,
            "name": "Market Intelligence"
          },
          {
            "month": "31/12/2022",
            "value": null,
            "name": "Market Intelligence"
          }
        ]
      };

      const formattedRecord = flattenDatapoints(record);

      formattedRecord.datapoints.forEach(data => {
        expect(record[data.month].type).toEqual('percentage');
        expect(record[data.month].isCurrency).toEqual(false);
        if(record[data.month].value) {
          expect(addCommas(toTwoDecimalPlaces(record[data.month].value)))
            .toEqual(formatter.toView(record[data.month]));
        }
      });
    });

    it('should format correctly numerical values', () => {
      const record = {
        "geographylevel1": "Africa",
        "geographylevel2": "Ghana",
        "serviceslevel1": "Service Provider and Markets",
        "dataset": "Mobile Device Subscriptions",
        "metriclevel1": "Subscriptions",
        "metriclevel2": null,
        "metricindicator": "Growth rate (absolute)",
        "currency": "",
        "unit": "Absolute",
        "31/12/2015": 4647613,
        "31/12/2016": 3295934,
        "31/12/2017": 39824487,
        "31/12/2018": 1901831,
        "31/12/2019": 1677664,
        "31/12/2020": 1494949,
        "31/12/2021": 1324755,
        "31/12/2022": 1173937,
        "avg_31/12/2015": "Computed",
        "avg_31/12/2016": "Computed",
        "avg_31/12/2017": "Computed",
        "avg_31/12/2018": "Computed",
        "avg_31/12/2019": "Computed",
        "avg_31/12/2020": "Computed",
        "avg_31/12/2021": "Computed",
        "avg_31/12/2022": "Computed",
        "avgColour": "Market Intelligence",
        "datapoints": [
          {
            "month": "31/12/2015",
            "value": 4647613,
            "name": "Computed"
          },
          {
            "month": "31/12/2016",
            "value": 3295934,
            "name": "Computed"
          },
          {
            "month": "31/12/2017",
            "value": 39824487,
            "name": "Computed"
          },
          {
            "month": "31/12/2018",
            "value": 1901831,
            "name": "Computed"
          },
          {
            "month": "31/12/2019",
            "value": 1677664,
            "name": "Computed"
          },
          {
            "month": "31/12/2020",
            "value": 1494949,
            "name": "Computed"
          },
          {
            "month": "31/12/2021",
            "value": 1324755,
            "name": "Computed"
          },
          {
            "month": "31/12/2022",
            "value": 1173937,
            "name": "Computed"
          }
        ]
      };

      const formattedRecord = flattenDatapoints(record);

      formattedRecord.datapoints.forEach(data => {
        expect(record[data.month].type).toEqual('numeric');
        expect(record[data.month].isCurrency).toEqual(false);
        if(record[data.month].value) {
          expect(addCommas(toZeroDecimalPlaces(record[data.month].value)))
            .toEqual(formatter.toView(record[data.month]));
        }
      });
    });
  });
});

function getNumberOfRows() {
  return global.document.querySelectorAll('[data-selector="unpinned-data-grid"] [data-selector="data-grid-row"]').length;
}

function getDisableOverlay() {
  return global.document.querySelector('.disable-overlay');
}

function getMessage() {
  return global.document.querySelector('.message-text');
}

function getColumnNames() {
  const columnElements = global.document.querySelectorAll('[data-selector="column-name"]');
  const columnsArray = Array.prototype.slice.call(columnElements);
  return columnsArray.map(x => x.innerHTML);
}

function getColumnGroupNames() {
  const columnElements = global.document.querySelectorAll('[data-selector="column-group-name"]');
  const columnsArray = Array.prototype.slice.call(columnElements);
  return columnsArray.map(x => x.innerHTML);
}
