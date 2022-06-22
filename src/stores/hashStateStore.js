import { EVENTS as BOOKMARK_EVENTS, TYPES as BOOKMARK_TYPES } from './bookmarkStore';
import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import Store from './store';
import * as GLOBAL_EVENTS from "../events";

const bookmarkToHash = bookmark => `${bookmark.type}-${bookmark.hash}`;

const hashToBookmarkHash = hash => hash.replace(/.*-/, '');

@inject('config', HttpClient, Router)
export class HashStateStore extends Store {

  constructor(config, httpClient, router, ...rest) {
    super(...rest);

    this.config        = config;
    this.httpClient    = httpClient;
    this.router        = router;
  }

  get EVENTS() {
    return [
      BOOKMARK_EVENTS.CREATE_BOOKMARK_SUCCESS,
      'router:navigation:complete'
    ];
  }

  getDefaultState() {
    return {};
  }

  verifyResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      this.router.navigateTo.grid();
      this.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, 'Unable to load the requested search. Loading the default search!');
    }
  }

  getState(hash) {
    return this.httpClient.fetch(`${this.config.get('bookmarkApiUrl')}/${hashToBookmarkHash(hash)}`)
      .then(this.verifyResponse.bind(this))
      .catch(error => console.error("restore state error", error));
  }

  isRouteGrid = () => this.router.currentInstruction && this.router.currentInstruction.config.name === 'grid';

  onCreateBookmarkSuccess(bookmark) {
    this.hash = bookmarkToHash(bookmark);

    if (this.isRouteGrid() && BOOKMARK_TYPES.TEMPORARY === bookmark.type) {
      this.router.navigateTo.grid({ s : this.hash });
    }
  }

  onEvent(data, event) {
    switch (event) {
      case BOOKMARK_EVENTS.CREATE_BOOKMARK_SUCCESS:
        this.onCreateBookmarkSuccess(data);
        break;
      case 'router:navigation:complete':
        this.onNavigationComplete(data);
        break;
    }
  }

  onNavigationComplete({ instruction }) {
    if (this.isRouteGrid()) {
      const hash = instruction.queryParams.s;

      // If the user doesn't have a hash in the URL we clear the hash state store.
      if (!hash) {
        this.hash = null;
        this.data = {};
        this.eventAggregator.publish(GLOBAL_EVENTS.TOGGLE_GRID_LANDING_PAGE, true);
      } else if (hash !== this.hash) {

        // The user has a hash in their URL on the grid and it doesn't
        // match the current state therefore we fetch the bookmarked state
        // from the bookmarks API. Triggering the state propagation on
        // completion.
        this.eventAggregator.publish(GLOBAL_EVENTS.TOGGLE_GRID_LANDING_PAGE, false);
        this.getState(hash)
          .then(response => {
            this.hash = hash;
            this.data = response.payload;

            if(response.type === BOOKMARK_TYPES.SHARED) {
              this.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE,
                'You may see different data to what was contained in the original search, based on your access rights.');
            }
          });
      }
      else {
        this.eventAggregator.publish(GLOBAL_EVENTS.TOGGLE_GRID_LANDING_PAGE, false);
      }
    }

    // Don't do anything if the user isn't currently on the grid or
    // the hash matches, we already have the correct state and/or
    // there is nothing to do.
  }
}
