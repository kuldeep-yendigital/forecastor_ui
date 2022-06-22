import {ServicesStore} from './servicesStore';
import {MetricStore} from './metricStore';
import {MetricIndicatorStore} from './metricIndicatorStore';
import {CompanyStore} from './companyStore';
import {GeographyStore} from './geographyStore';
import {TechnologyStore} from './technologyStore';
import {BillingTypeStore} from './billingTypeStore';
import {ChannelStore} from './channelStore';
import {DeviceStore} from './deviceStore';
import {CustomerTypeStore} from './customerTypeStore';
import {TimeframeStore} from './timeframeStore';
import {DataSetStore} from './dataSetStore';
import {PlatformStore} from './platformStore';
import {IndustryStore} from './industryStore';
import {PricebandStore} from './pricebandStore';
import Store from './store';
import * as GLOBAL_EVENTS from '../events';

const DEFAULT_TAXONOMY_DIMENSIONS = [
  { name: 'DataSet', key: 'dataset', type: DataSetStore, composite: true, description: 'Pre-defined data views' },
  { name: 'Metric', key: 'metric', type: MetricStore, composite: true, description: 'Numerical measures' },
  { name: 'MetricIndicator', key: 'metricindicator', type: MetricIndicatorStore, composite: true, description: 'Numerical format of the metric: total value, growth rate (%), growth rate absolute or market share' },
  { name: 'Timeframe', type: TimeframeStore, timeframe: true, description: 'Time period and frequency' },
  { name: 'Geography', key: 'geography', type: GeographyStore, composite: true, description: 'Region and country' },
  { name: 'Services', key: 'services', type: ServicesStore, composite: true, description: 'Service type' },
  { name: 'Company', key: 'company', type: CompanyStore, composite: false, description: 'Organisation' },
  { name: 'Technology', key: 'technology', type: TechnologyStore, composite: true, description: 'Network, device, platform and application technologies' },
  { name: 'BillingType', key: 'billingtype', type: BillingTypeStore, composite: true, description: 'Free or paid for services including prepaid, postpaid and carrier-billing' },
  { name: 'Channel', key: 'channel', type: ChannelStore, composite: true, description: 'Retail or wholesale' },
  { name: 'Device', key: 'device', type: DeviceStore, composite: true, description: 'Device type and attributes including mobile handsets, TVs, smart home and screen resolution' },
  { name: 'CustomerType', key: 'customertype', type: CustomerTypeStore, composite: true, description: 'Business or consumer segments' },
  { name: 'Industry', key: 'industry', type: IndustryStore, composite: true, description: 'Industry segment' },
  { name: 'PriceBand', key: 'priceband', type: PricebandStore, composite: true, description: 'Price band' },
  { name: 'Platform', key: 'platform', type: PlatformStore, composite: true, description: 'Type of platform: including IT delivery, device operating systems and application platforms' }
];

const validateKey = key => {
  if (!key) throw new Error('key empty');
  return key;
};

const getStoreForDimension = (stores, dimension) =>
  stores[dimension.type.name];

const getStoreChildren = store =>
  store.data ? store.data.items : []

const isStoreLoaded = store =>
  Boolean(store.data)

const getDimensionWithStoreState = (dimension, store) => ({
  ...dimension,
  children: getStoreChildren(store),
  loaded: isStoreLoaded(store)
})

export class TaxonomyStore extends Store {

  get STORES() {
    return DEFAULT_TAXONOMY_DIMENSIONS.map(entry => entry.type);
  }

  get EVENTS() {
    return [
      GLOBAL_EVENTS.BATCH_FETCH_TAXONOMY_DATA
    ];
  }

  constructor(...args) {
    super(...args);
    this.updateState();
  }

  updateState() {
    this.data = {
      dimensions: this.data.dimensions.map(dimension => {
        if (dimension.timeframe) {
          return dimension;
        } else {
          const store = getStoreForDimension(this.stores, dimension);
          return getDimensionWithStoreState(dimension, store);
        }
      })
    };
  }

  getDefaultState() {
    return {
      dimensions: DEFAULT_TAXONOMY_DIMENSIONS
    };
  }

  loadDimensionTaxonomy(key) {
    key = validateKey(key);
    this.eventAggregator.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, key);
  }

  onStoreChange(data, store) {
    this.updateState();
  }

  onEvent(data, event) {
    switch (event) {
    case GLOBAL_EVENTS.BATCH_FETCH_TAXONOMY_DATA:
      data.forEach(dimension => this.loadDimensionTaxonomy(dimension));
      break;
    }
  }

}
