import { EventAggregator } from 'aurelia-event-aggregator';
import { inject, bindable } from 'aurelia-framework';

require('./index.scss');

@inject(EventAggregator)
export class Products {
  @bindable title = '';
  @bindable products = [];
  @bindable isFetching = true;
}
