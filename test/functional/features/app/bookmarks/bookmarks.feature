@current
Feature: Bookmarks

    Scenario: Navigate to grid from dashboard
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load
        Then I should wait for the url to "match" "/#/grid$"
    
    Scenario: Start from help page and navigate to grid
        Given I visit forecaster
        And I login
        And I click the "user-details"
        And I wait for update to finish
        And I click the "help"
        And I should expect "help-title" text to "match" "Help"
        When I refresh the page
        And I navigate to "grid"
        And I wait for the grid to load
        Then I should wait for the url to "match" "/#/grid$"
    
    Scenario: Click popular link on dashboard
        Given I visit forecaster
        And I login
        Then I should wait for "dashboard|popular-searches|saved-search-title" to exist
        When I click "dashboard|popular-searches|saved-search-title"
        And I wait for the grid to load
        Then I should wait for the url to "contain" "/#/grid?s=saved-"
    @bob
    Scenario: Click saved link on dashboard
        Given I have a saved search
        And I visit forecaster
        And I login
        Then I should wait for "dashboard|saved-searches|saved-search-title" to exist
        When I click "dashboard|saved-searches|saved-search-title"
        And I wait for the grid to load
        Then I should wait for the url to "contain" "/#/grid?s=temporary-"

    Scenario: Share saved link on dashboard
        Given I have a saved search
        And I visit forecaster
        And I login
        Then I should wait for "dashboard|saved-searches|saved-search-share" to exist
        When I click "dashboard|saved-searches|saved-search-share"
        Then I should wait for "clipboard-dialog" to be visible
        And I should expect "clipboard-dialog|clipboard-value" text to "contain" "/#/grid?s=shared-"

    Scenario: Logged in directly visit grid without hash
        And I visit forecaster
        And I login
        When I visit forecaster at the route "/#/grid"
        And I wait for the grid to load
        Then I should wait for the url to "match" "/#/grid$"
#
#    Scenario: Logged in directly visit grid with temporary hash
#        And I visit forecaster
#        And I login
#        And I navigate to "grid"
#        And I should wait for "unpinned-data-grid|data-grid-row" to exist
#        And I click "unpinned-columns.geographylevel1|ellipsis"
#        And I click "unpinned-columns.geographylevel1|pin-column"
#        And I click "unpinned-columns.geographylevel2|ellipsis"
#        And I click "unpinned-columns.geographylevel2|sort-column-desc"
#        And I click "taxonomy-item.geography"
#        And I should wait for "first-list-panel-item" to exist
#        And I click "first-list-panel-item"
#        And I click "taxonomy-item.timeframe"
#        And I click "timeframe-quarterly"
#        And I select the "2000" option for "date-selector-year-From:"
#        And I select the "2000" option for "date-selector-year-To:"
#        And I wait for the grid to load
#        And I should wait for "pinned-columns.geographylevel1" to exist
#        And I should wait for "unpinned-columns.31/03/2000" to exist
#        And I should wait for "unpinned-columns.geographylevel2|sort-indicator.desc" to be visible
#        And I should expect the url to "contain" "/#/grid?s=temporary-"
#        When I refresh the page
#        And I wait for the grid to load
#        Then I should wait for "pinned-columns.geographylevel1" to exist
#        And I should wait for "unpinned-columns.31/03/2000" to exist
#        And I should wait for "unpinned-columns.geographylevel2|sort-indicator.desc" to be visible
#        And I should expect the url to "contain" "/#/grid?s=temporary-"
#
#    Scenario: Back to grid from help page
#        And I visit forecaster
#        And I login
#        And I navigate to "grid"
#        And I should wait for "unpinned-data-grid|data-grid-row" to exist
#        And I click "unpinned-columns.geographylevel1|ellipsis"
#        And I click "unpinned-columns.geographylevel1|pin-column"
#        And I click "unpinned-columns.geographylevel2|ellipsis"
#        And I click "unpinned-columns.geographylevel2|sort-column-desc"
#        And I click "taxonomy-item.geography"
#        And I should wait for "first-list-panel-item" to exist
#        And I click "first-list-panel-item"
#        And I click "taxonomy-item.timeframe"
#        And I click "timeframe-quarterly"
#        And I select the "2000" option for "date-selector-year-From:"
#        And I select the "2000" option for "date-selector-year-To:"
#        And I wait for the grid to load
#        And I should wait for "pinned-columns.geographylevel1" to exist
#        And I should wait for "unpinned-columns.31/03/2000" to exist
#        And I should wait for "unpinned-columns.geographylevel2|sort-indicator.desc" to be visible
#        And I should expect the url to "contain" "/#/grid?s=temporary-"
#        And I click the "user-details"
#        And I wait for update to finish
#        And I click the "help"
#        And I should expect "help-title" text to "match" "Help"
#        When I hit the back button
#        And I wait for the grid to load
#        Then I should wait for "pinned-columns.geographylevel1" to exist
#        And I should wait for "unpinned-columns.31/03/2000" to exist
#        And I should wait for "unpinned-columns.geographylevel2|sort-indicator.desc" to be visible
#        And I should expect the url to "contain" "/#/grid?s=temporary-"
#
#    Scenario: Refresh on help page and hit back to grid
#        And I visit forecaster
#        And I login
#        And I navigate to "grid"
#        And I should wait for "unpinned-data-grid|data-grid-row" to exist
#        And I click "unpinned-columns.geographylevel1|ellipsis"
#        And I click "unpinned-columns.geographylevel1|pin-column"
#        And I click "unpinned-columns.geographylevel2|ellipsis"
#        And I click "unpinned-columns.geographylevel2|sort-column-desc"
#        And I click "taxonomy-item.geography"
#        And I should wait for "first-list-panel-item" to exist
#        And I click "first-list-panel-item"
#        And I click "taxonomy-item.timeframe"
#        And I click "timeframe-quarterly"
#        And I select the "2000" option for "date-selector-year-From:"
#        And I select the "2000" option for "date-selector-year-To:"
#        And I wait for the grid to load
#        And I should wait for "pinned-columns.geographylevel1" to exist
#        And I should wait for "unpinned-columns.31/03/2000" to exist
#        And I should wait for "unpinned-columns.geographylevel2|sort-indicator.desc" to be visible
#        And I should expect the url to "contain" "/#/grid?s=temporary-"
#        And I click the "user-details"
#        And I wait for update to finish
#        And I click the "help"
#        And I should expect "help-title" text to "match" "Help"
#        When I refresh the page
#        And I hit the back button
#        And I wait for the grid to load
#        Then I should wait for "pinned-columns.geographylevel1" to exist
#        And I should wait for "unpinned-columns.31/03/2000" to exist
#        And I should wait for "unpinned-columns.geographylevel2|sort-indicator.desc" to be visible
#        And I should expect the url to "contain" "/#/grid?s=temporary-"
#
#    Scenario: Logged in directly visit grid with saved hash
#        Given I have a saved search
#        And I visit forecaster
#        And I login
#        And I navigate to "grid"
#        And I click "save-search-menu-button"
#        And I click "dialog-save-search|saved-search-title"
#        When I refresh the page
#        And I wait for the grid to load
#        Then I should wait for the url to "contain" "/#/grid?s=saved-"
#
#    Scenario: Logged in directly visit grid with shared hash
#        Given I have a saved search
#        And I visit forecaster
#        And I login
#        When I click "dashboard|saved-searches|saved-search-share"
#        Then I should wait for "clipboard-dialog" to be visible
#        And I should expect "clipboard-dialog|clipboard-value" text to "contain" "/#/grid?s=shared-"
#        When I visit the url at "clipboard-dialog|clipboard-value"
#        And I wait for the grid to load
#        Then I should wait for the url to "contain" "/#/grid?s=shared-"
