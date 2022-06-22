import { bindable } from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { StoreComponent } from './../store-component';

import {ExportStore, FORMATS as EXPORT_FORMATS, EVENTS as EXPORT_EVENTS} from '../../stores/exportStore';

require('./index.scss');

export class ExportMenu extends StoreComponent {
  @bindable inLandingMode = false;

  static inject() {
    return [EventAggregator, ExportStore];
  }

  constructor(eventAggregator, exportStore) {
    super(exportStore, eventAggregator);

    this.open = false;
    this.toggleOpenClose = this.toggleOpenClose.bind(this);
  }

  toggleOpenClose() {
    if (this.inLandingMode) return;

    this.menu.style.left = `${this.root.getBoundingClientRect().left}px`;
    this.open = !this.open;
    this.registerBodyListener();
  }

  isReadOnly(group) {
    return group.columns.every(c => c.readOnly);
  }

  registerBodyListener() {
    if (this.open === true) {
      const callback = (e) => {
        let path = e.path || (e.composedPath && e.composedPath());
        if (!path) {
          let current = e.target;
          path = [{ className: current.className }];
          while (current.parentNode) {
            path.push({ className: current.parentNode.className });
            current = current.parentNode;
          }
        }
        const elInsideContextMenu = path.filter((element) => {
          return element.className ? element.className.indexOf('export-menu') > -1 : false;
        });
        if (elInsideContextMenu.length === 0) {
          this.close();
          document.body.removeEventListener('click', callback);
        }
      };
      setImmediate(() => {
        document.body.addEventListener('click', callback);
      });
    }
  }

  close() {
    this.open = false;
  }

  adobeTrackDownload() {
    if (window.config.envName === 'qa') {
      window.adobe_s.events = 'event13';
      window.adobe_s.tl(true, 'd', 'download');
    }
  }

  csv() {
    this.adobeTrackDownload();
    this.publish(EXPORT_EVENTS.STARTED, { format: EXPORT_FORMATS.CSV });
    this.toggleOpenClose();
  }

  excel() {
    this.adobeTrackDownload();
    this.publish(EXPORT_EVENTS.STARTED, { format: EXPORT_FORMATS.EXCEL });
    this.toggleOpenClose();
  }
}
