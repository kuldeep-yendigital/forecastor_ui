import {TaxonomyStore} from './taxonomyStore';
import {DataSetStore} from './dataSetStore';
import {MetricStore} from './metricStore';
import {MetricIndicatorStore} from './metricIndicatorStore';
import {TimeframeStore} from './timeframeStore';
import {GeographyStore} from './geographyStore';
import {ServicesStore} from './servicesStore';
import {CompanyStore} from './companyStore';
import {TechnologyStore} from './technologyStore';
import {BillingTypeStore} from './billingTypeStore';
import {ChannelStore} from './channelStore';
import {DeviceStore} from './deviceStore';
import {CustomerTypeStore} from './customerTypeStore';
import {IndustryStore} from './industryStore';
import {PricebandStore} from './pricebandStore';
import {PlatformStore} from './platformStore';

import {Container} from 'aurelia-dependency-injection';
import {BindingEngine} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {FakeBindingEngine, FakeEventAggregator} from '../../test/unit/helpers/fakes';
import * as GLOBAL_EVENTS from '../events';

describe('Taxonomy Store', () => {

  class FakeDimensionStore {
    loadTaxonomy() {}
  }

  beforeEach(() => {
    const container = new Container().makeGlobal();
    container.registerInstance(DataSetStore, new FakeDimensionStore());
    container.registerInstance(MetricStore, new FakeDimensionStore());
    container.registerInstance(MetricIndicatorStore, new FakeDimensionStore());
    container.registerInstance(TimeframeStore, new FakeDimensionStore());
    container.registerInstance(GeographyStore, new FakeDimensionStore());
    container.registerInstance(ServicesStore, new FakeDimensionStore());
    container.registerInstance(CompanyStore, new FakeDimensionStore());
    container.registerInstance(TechnologyStore, new FakeDimensionStore());
    container.registerInstance(BillingTypeStore, new FakeDimensionStore());
    container.registerInstance(ChannelStore, new FakeDimensionStore());
    container.registerInstance(DeviceStore, new FakeDimensionStore());
    container.registerInstance(CustomerTypeStore, new FakeDimensionStore());
    container.registerInstance(IndustryStore, new FakeDimensionStore());
    container.registerInstance(PricebandStore, new FakeDimensionStore());
    container.registerInstance(PlatformStore, new FakeDimensionStore());
    container.registerInstance(BindingEngine, new FakeBindingEngine());
    container.registerInstance(EventAggregator, new FakeEventAggregator());
  });

  it('creates a central point to query dimension taxonomy', () => {
    const taxonomyStore = Container.instance.get(TaxonomyStore);
    expect(taxonomyStore.data.dimensions).toEqual([
      { name: 'DataSet', key: 'dataset', type: DataSetStore, loaded: false, children: [], composite: true, description: 'Pre-defined data views' },
      { name: 'Metric', key: 'metric', type: MetricStore, loaded: false, children: [], composite: true, description: 'Numerical measures' },
      { name: 'MetricIndicator', key: 'metricindicator', type: MetricIndicatorStore, loaded: false, children: [], composite: true, description: 'Numerical format of the metric: total value, growth rate (%), growth rate absolute or market share' },
      { name: 'Timeframe', type: TimeframeStore, timeframe: true, description: 'Time period and frequency' },
      { name: 'Geography', key: 'geography', type: GeographyStore, loaded: false, children: [], composite: true, description: 'Region and country' },
      { name: 'Services', key: 'services', type: ServicesStore, loaded: false, children: [], composite: true, description: 'Service type' },
      { name: 'Company', key: 'company', type: CompanyStore, loaded: false, children: [], composite: false, description: 'Organisation' },
      { name: 'Technology', key: 'technology', type: TechnologyStore, loaded: false, children: [], composite: true, description: 'Network, device, platform and application technologies' },
      { name: 'BillingType', key: 'billingtype', type: BillingTypeStore, loaded: false, children: [], composite: true, description: 'Free or paid for services including prepaid, postpaid and carrier-billing' },
      { name: 'Channel', key: 'channel', type: ChannelStore, loaded: false, children: [], composite: true, description: 'Retail or wholesale' },
      { name: 'Device', key: 'device', type: DeviceStore, loaded: false, children: [], composite: true, description: 'Device type and attributes including mobile handsets, TVs, smart home and screen resolution' },
      { name: 'CustomerType', key: 'customertype', type: CustomerTypeStore, loaded: false, children: [], composite: true, description: 'Business or consumer segments' },
      { name: 'Industry', key: 'industry', type: IndustryStore, loaded: false, children: [], composite: true, description: 'Industry segment' },
      { name: 'PriceBand', key: 'priceband', type: PricebandStore, loaded: false, children: [], composite: true, description: 'Price band' },
      { name: 'Platform', key: 'platform', type: PlatformStore, loaded: false, children: [], composite: true, description: 'Type of platform: including IT delivery, device operating systems and application platforms' }
    ]);
  });

  it('lazily loads taxonomy for a given dimension upon request', () => {
    const eventAggregator = Container.instance.get(EventAggregator);
    const taxonomyStore = Container.instance.get(TaxonomyStore);
    spyOn(eventAggregator, 'publish');
    taxonomyStore.loadDimensionTaxonomy('dataset');
    expect(eventAggregator.publish).toHaveBeenCalledWith(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, 'dataset');
  });

  it('returns loaded taxonomy information for dimensions', () => {
    const dataSetStore = Container.instance.get(DataSetStore);
    const taxonomyStore = Container.instance.get(TaxonomyStore);
    dataSetStore.data = {
      items: [
        { name: 'Subscriptions', state: 0, children: [] }
      ]
    };
    taxonomyStore.onStoreChange(dataSetStore.data, DataSetStore);
    
    expect(taxonomyStore.data.dimensions).toEqual([
      { name: 'DataSet', key: 'dataset', type: DataSetStore, loaded: false, children: [], composite: true, description: 'Pre-defined data views' },
      { name: 'Metric', key: 'metric', type: MetricStore, loaded: false, children: [], composite: true, description: 'Numerical measures' },
      { name: 'MetricIndicator', key: 'metricindicator', type: MetricIndicatorStore, loaded: false, children: [], composite: true, description: 'Numerical format of the metric: total value, growth rate (%), growth rate absolute or market share' },
      { name: 'Timeframe', type: TimeframeStore, timeframe: true, description: 'Time period and frequency' },
      { name: 'Geography', key: 'geography', type: GeographyStore, loaded: false, children: [], composite: true, description: 'Region and country' },
      { name: 'Services', key: 'services', type: ServicesStore, loaded: false, children: [], composite: true, description: 'Service type' },
      { name: 'Company', key: 'company', type: CompanyStore, loaded: false, children: [], composite: false, description: 'Organisation' },
      { name: 'Technology', key: 'technology', type: TechnologyStore, loaded: false, children: [], composite: true, description: 'Network, device, platform and application technologies' },
      { name: 'BillingType', key: 'billingtype', type: BillingTypeStore, loaded: false, children: [], composite: true, description: 'Free or paid for services including prepaid, postpaid and carrier-billing' },
      { name: 'Channel', key: 'channel', type: ChannelStore, loaded: false, children: [], composite: true, description: 'Retail or wholesale' },
      { name: 'Device', key: 'device', type: DeviceStore, loaded: false, children: [], composite: true, description: 'Device type and attributes including mobile handsets, TVs, smart home and screen resolution' },
      { name: 'CustomerType', key: 'customertype', type: CustomerTypeStore, loaded: false, children: [], composite: true, description: 'Business or consumer segments' },
      { name: 'Industry', key: 'industry', type: IndustryStore, loaded: false, children: [], composite: true, description: 'Industry segment' },
      { name: 'PriceBand', key: 'priceband', type: PricebandStore, loaded: false, children: [], composite: true, description: 'Price band' },
      { name: 'Platform', key: 'platform', type: PlatformStore, loaded: false, children: [], composite: true, description: 'Type of platform: including IT delivery, device operating systems and application platforms' }
    ]);
  });

});
