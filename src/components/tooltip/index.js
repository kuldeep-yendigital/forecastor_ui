import { HELP_TEXT } from './help-text';
import { bindable, computedFrom, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as GLOBAL_EVENTS from './../../events';

require('./index.scss');

@inject(EventAggregator)
export class Tooltip {
  @bindable taxonomy;
  @bindable textContent;
  @bindable direction = 'right';

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.toggle = this.toggle.bind(this);
  }

  @computedFrom('taxonomy')
  get text() {
    return this.textContent ? this.textContent : HELP_TEXT[this.taxonomy];
  }

  @computedFrom('direction')
  get placement() {
    return this.direction === 'left' ? 'left' : 'right';
  }

  @computedFrom('direction')
  get arrowDirection() {
    return this.direction === 'left' ? 'right' : 'left';
  }

  toggle(event) {
    this.expanded = !this.expanded;

    if(this.expanded) {
      setImmediate(() => {
        if(event) {
          this.content.style.top = (event.target.getBoundingClientRect().top) + 'px';
        }
        document.body.addEventListener('click', this.toggle);
        this.eventAggregator.subscribeOnce(GLOBAL_EVENTS.MULTI_LIST_PANEL_SCROLL, this.toggle);
      });
    } else {
      document.body.removeEventListener('click', this.toggle);
    }
  }
}
