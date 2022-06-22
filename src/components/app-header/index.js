import {bindable} from 'aurelia-framework';
import {Confirm as ConfirmDialog} from './../dialog/confirm/';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {EVENTS as AUTH_EVENTS} from '../../stores/authStore';
import {GraphStore, EVENTS as GRAPH_EVENTS} from '../../stores/graphStore';
import {DashboardStore, EVENTS as DASHBOARD_EVENTS} from '../../stores/dashboardStore';
import {SelectionStore, EVENTS as SELECTION_EVENTS} from '../../stores/selectionStore';
import {QueryStore} from '../../stores/queryStore';
import {EVENTS as ACTIVE_FILTER_EVENTS} from '../../stores/activeFilterStore';
import {DialogService} from 'aurelia-dialog';
import {SaveSearch} from './../dialog/save-search/';
import {DashboardSlot} from '../dialog/dashboard-slot';
import * as GLOBAL_EVENTS from './../../events';

require('./index.scss');

export const EVENTS = {
  FILTER_BUTTON_ACTION: 'app-header_filter-button-action'
};

export class AppHeader {

  @bindable view;
  @bindable noSubHeader;
  @bindable visualisationType;
  @bindable numberOfSelectRecords;
  @bindable historyCounter = 0;
  @bindable historyIndex = 0;
  @bindable inLandingMode = false;

  static inject() {
    return [
      Router,
      EventAggregator,
      SelectionStore,
      GraphStore,
      DashboardStore,
      DialogService,
      QueryStore
    ];
  }

  constructor(
    Router,
    eventAggregator,
    SelectionStore,
    GraphStore,
    DashboardStore,
    DialogService,
    QueryStore
  ) {
    this.ea = eventAggregator;
    this.selectionStore = SelectionStore;
    this.routing = Router;
    this.dialogService = DialogService;
    this.dashboardStore = DashboardStore;
    this.queryStore = QueryStore;
    this.undid = false;
    this.redid = false;
    this.changeValueField = this.changeValueField.bind(this);
    this.updateNumberOfSelectRecords();
    this.valueField = 'usd';
  }

  attached() {
    this.queryStore.subscribe(() => {
      this.valueField = this.queryStore.data.valueField;
    }),
    this.subscriptions = [
      this.selectionStore.subscribe(this.onRowSelectionChanged.bind(this))
    ];
    this.view = 'data-grid';
    window.addEventListener('popstate', () => {
      const historyCounter = this.historyCounter;
      const historyIndex = this.historyIndex;
      
      if ((historyCounter !== historyIndex) && !this.undid && !this.redid) {
        // Override the counters, they now become top
        this.historyCounter = this.historyIndex + 1;
        this.historyIndex = this.historyIndex + 1;
      }
      else {
        if (!this.undid && !this.redid) {
          this.historyCounter = this.historyCounter + 1;
          this.historyIndex = this.historyIndex + 1;
        }
        else if (this.redid) {
          this.historyIndex = this.historyIndex + 1;
          this.redid = false;
        }
        else {
          this.historyIndex = this.historyIndex - 1;
          this.undid = false;
        }
      }
    });
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }

  viewChanged() {
    setImmediate(() => {
      this.ea.publish(GLOBAL_EVENTS.VIEW_CHANGED, this.view);
    });
  }

  clickFilterButton() {
    if (this.inLandingMode) return;

    this.ea.publish(EVENTS.FILTER_BUTTON_ACTION);
  }

  logout() {
    this.ea.publish(AUTH_EVENTS.LOGOUT);
  }

  changeValueField(valueField) {
    this.ea.publish(GLOBAL_EVENTS.ADD_VALUE_FIELD, valueField);

    switch(valueField) {
    case 'valuereported':
      this.ea.publish(GLOBAL_EVENTS.COLUMNS_ADDED, ['geographylevel1', 'geographylevel2', 'geographylevel3', 'companyname']);
      this.ea.publish(GLOBAL_EVENTS.COLUMNS_READONLY_ON, ['geographylevel1', 'geographylevel2', 'geographylevel3', 'companyname']);
      break;
    case 'valuelocal':
      this.ea.publish(GLOBAL_EVENTS.COLUMNS_ADDED, ['geographylevel1', 'geographylevel2', 'geographylevel3']);
      this.ea.publish(GLOBAL_EVENTS.COLUMNS_READONLY_ON, ['geographylevel1', 'geographylevel2', 'geographylevel3']);
      this.ea.publish(GLOBAL_EVENTS.COLUMNS_READONLY_OFF, ['companyname']);
      break;
    case 'valueeur':
      this.ea.publish(GLOBAL_EVENTS.COLUMNS_READONLY_OFF, ['geographylevel1', 'geographylevel2', 'geographylevel3', 'companyname']);
      break;
    case 'usd':
      this.ea.publish(GLOBAL_EVENTS.COLUMNS_READONLY_OFF, ['geographylevel1', 'geographylevel2', 'geographylevel3', 'companyname']);
      break;
    }
  }

  displayVisualisation(type) {
    if (this.inLandingMode) return;

    if (this.numberOfSelectRecords > 50) {
      this.ea.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, 'Charting is limited to 50 rows of data.');
    }
    else {
      this.view = 'visualisation';
      this.ea.publish(GRAPH_EVENTS.CHANGE_GRAPH_TYPE, type);
    }
  }

  saveGraphToDashboard() {
    this.dialogService.open({
      lock           : true,
      model          : [],
      overlayDismiss : true,
      viewModel      : DashboardSlot
    });
  }

  displayActiveFilter() {
    if (this.inLandingMode) return;

    this.view = 'active-filter';
  }

  clear(e) {
    e.preventDefault();
    this.ea.publish(SELECTION_EVENTS.CLEAR_SELECTION);
  }

  applyActiveFilterChanges() {
    this.ea.publish(ACTIVE_FILTER_EVENTS.APPLY_FILTER_CHANGES);
    this.view = 'data-grid';
  }

  back() {
    this.view = 'data-grid';
    this.visualisationType = '';
  }

  backFromActiveFilter() {
    this.view = 'data-grid';
    this.ea.publish(ACTIVE_FILTER_EVENTS.CANCEL_FILTER_CHANGES);
  }

  onRowSelectionChanged() {
    this.updateNumberOfSelectRecords();
  }

  updateNumberOfSelectRecords() {
    this.numberOfSelectRecords = this.selectionStore.data.selected.length;
  }

  handleClickResetConfirmation() {
    if (this.inLandingMode) return;
    
    this.dialogService.open({
      viewModel : ConfirmDialog,
      model     : {
        text   : 'Restoring defaults will reset all filter selections and all column selections. Do you want to continue?'
      }
    }).whenClosed((response) => {
      if (!response.wasCancelled) {

        // The bare grid route resets all search and timeframe
        // to defaults.
        this.routing.navigateTo.grid();
        this.ea.publish(GLOBAL_EVENTS.RESTORED_DEFAULTS, true);
      }
    });
  }

  saveSearch() {
    if (this.inLandingMode) return;
    
    this.dialogService.open({
      lock           : true,
      model          : [],
      overlayDismiss : true,
      viewModel      : SaveSearch
    });
  }

  goBack() {
    if (this.historyCounter > 0 && this.historyIndex > 0) {
      this.undid = true;
      window.history.go(-1);
    }
  }

  goForward() {
    if (this.historyCounter === this.historyIndex) {
      return;
    }
    this.redid = true;
    window.history.go(1);
  }
}
