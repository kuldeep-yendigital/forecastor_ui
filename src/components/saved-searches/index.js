import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { inject, bindable } from 'aurelia-framework';
import * as GLOBAL_EVENTS from './../../events';
import { BookmarkStore, EVENTS as BOOKMARK_EVENTS, TYPES as BOOKMARK_TYPES } from '../../stores/bookmarkStore';
import { debug } from 'util';
import Sortable from 'sortablejs';

require('./index.scss');

@inject(EventAggregator, Router)
export class SavedSearches {
  @bindable onSaveSearch;
  @bindable onSearchClick;
  @bindable title = '';
  @bindable fromall = false;
  @bindable disableDelete = false;
  @bindable displayFilter = true;
  @bindable horizontal = false;
  @bindable catid = '';
  @bindable sortable = false;
  @bindable clonesortable = false;
  @bindable displaySaveCurrentSearchMessage = true;
  @bindable searches = [];
  @bindable isFetching = false;
  @bindable tooltipDirection = 'left';
  @bindable isAdmin = false;
  @bindable isPopular = false;
  @bindable parentid = 0;

  constructor(eventAggregator, router) {
    this.ea               = eventAggregator;
    this.filteredSearches = [];
    this.router           = router;
    this.scroll           = this.scroll.bind(this);
  }

  attached() {
    this.scrollArea.addEventListener('scroll', this.scroll);

    if(this.horizontal && this.sortable && this.isAdmin) {
      const sortableContainer = this.sortableContainer;
      Sortable.create(sortableContainer, {
        sort: this.clonesortable ? false : true,
        group: {
          name: 'sortables',
          pull: this.clonesortable ? 'clone' : true,
          put: !this.clonesortable
        },
        animation: 100,
        onAdd: (evt) => {
          const isFromAll = evt.from.dataset.fromall === 'true';
          const addedItem = evt.item.dataset;
          const newSubCatId = evt.to.dataset.subcategoryid;
          const newIndex = evt.newIndex;
          let replacedHash;
          if(evt.target.children.item(newIndex+1)) {
            replacedHash = evt.target.children.item(newIndex+1).dataset;
          }
          const fromSubcategoryId = evt.from.dataset;
          const payload = {
            replacedHash,
            newSubCatId: parseInt(newSubCatId),
            addedItem,
            isFromAll
          };
          this.ea.publish(BOOKMARK_EVENTS.UPDATE_HASH, payload);
        }
      });
    }
  }

  detached() {
    this.scrollArea.removeEventListener('scroll', this.scroll);
  }

  scroll() {
    this.ea.publish(GLOBAL_EVENTS.MULTI_LIST_PANEL_SCROLL);
  }

  onKeyUp(event) {
    this.filteredSearch = event.srcElement.value.length > 0;
    this.filteredSearches = this.searches.filter(
      s => s.title.toLowerCase().indexOf(event.srcElement.value.toLowerCase()) > -1
    );
  }

  saveSearch() {
    this.onSaveSearch();
  }

  openSavedSearch(bookmark) {
    this.router.navigate(`/grid?s=${bookmark.type}-${bookmark.hash}`);
    this.ea.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, bookmark.title);
    this.ea.publish(GLOBAL_EVENTS.RESET_SEARCH_RESULTS);
    if (this.onSearchClick) {
      this.onSearchClick(bookmark);
    }
  }
}
