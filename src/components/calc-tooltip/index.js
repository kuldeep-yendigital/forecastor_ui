import { bindable, computedFrom, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as GLOBAL_EVENTS from './../../events';

require('./index.scss');

@inject(EventAggregator)
export class CalcTooltip {
  @bindable taxonomy;
  @bindable textContent;
  @bindable disabled = false;

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.toggle = this.toggle.bind(this);
  }

  @computedFrom('taxonomy')
  get text() {
    return this.textContent;
  }

  toggle(event) {
    if (this.disabled) {
      return;
    }

    this.expanded = !this.expanded;

    if(this.expanded) {
      setImmediate(() => {
        if(event) {
          this.content.style.top = (event.target.getBoundingClientRect().top - 10) + 'px';
        }
        document.body.addEventListener('click', this.toggle);
        this.eventAggregator.subscribeOnce(GLOBAL_EVENTS.MULTI_LIST_PANEL_SCROLL, this.toggle);
      });
    } else {
      document.body.removeEventListener('click', this.toggle);
    }
  }
}
