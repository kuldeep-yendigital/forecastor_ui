Feature: Data Grid Sort

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load
        And I click "taxonomy-item.metric"
        And I should wait for "multi-list-panel-item.Financial" to exist
        And I click "Financial|arrow-next"
        And I click "Service.revenues"
        And I wait for the grid to load
        And I click "arrow-back"
        And I click "taxonomy-item.metric"

    Scenario: Should display an icon when sorting by dimension
        When I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|sort-column-desc"
        And I wait for the grid to load
        Then I should expect "unpinned-columns.geographylevel2|sort-indicator.desc" to be visible
        When I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|sort-column-asc"
        And I wait for the grid to load
        Then I should expect "unpinned-columns.geographylevel2|sort-indicator.asc" to be visible

    Scenario: Sort descending by value
        When I scroll to "unpinned-columns.31/12/2017" in "unpinned-data-scrolling"
        When I click "unpinned-columns.31/12/2017|ellipsis"
        And I click "unpinned-columns.31/12/2017|sort-column-desc"
        And I wait for the grid to load
        Then I should expect "unpinned-columns.31/12/2017|sort-indicator.desc" to be visible

    Scenario: Sort ascending by value
        When I scroll to "unpinned-columns.31/12/2017" in "unpinned-data-scrolling"
        When I click "unpinned-columns.31/12/2017|ellipsis"
        And I click "unpinned-columns.31/12/2017|sort-column-asc"
        And I wait for the grid to load
        Then I should expect "unpinned-columns.31/12/2017|sort-indicator.asc" to be visible

    Scenario: Sort by column and then remove it
        When I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|sort-column-asc"
        And I wait for the grid to load
        And I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|remove-column"
        And I wait for the grid to load
        Then I should expect "unpinned-columns.geographylevel1|sort-indicator" to be visible

    Scenario: Sort and then pin column
        When I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|sort-column-asc"
        And I wait for the grid to load
        And I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|pin-column"
        Then I should expect "pinned-columns.geographylevel2|sort-indicator.asc" to be visible

    Scenario: Sort by pinned column and unpin it
        When I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|pin-column"
        And I wait 1 seconds
        And I click "pinned-columns.geographylevel2|ellipsis"
        And I should wait for "pinned-columns.geographylevel2|sort-column-desc" to exist
        And I click "pinned-columns.geographylevel2|sort-column-desc"
        And I wait for the grid to load
        And I click "pinned-columns.geographylevel2|ellipsis"
        And I click "pinned-columns.geographylevel2|pin-column"
        Then I should expect "unpinned-columns.geographylevel2|sort-indicator.desc" to be visible

    @bob
    Scenario: Sort by value disabled with multiple metrics
        Given I should expect "search-ribbon|title-text" to be visible
        When I click "taxonomy-item.metric"
        And I should wait for "first-list-panel-item-arrow" to exist
        And I click "first-list-panel-item-arrow"
        And I should wait for "first-simple-list-panel-item" to exist
        And I click "first-simple-list-panel-item"
        And I wait for the grid to load
        And I scroll to "unpinned-columns.31/12/2017" in "unpinned-data-scrolling"
        When I click "unpinned-columns.31/12/2017|ellipsis"
        Then I should expect "unpinned-columns.31/12/2017|pin-column" to not be enabled

    Scenario: Sort by value and then select multiple metrics
        Given I scroll to "unpinned-columns.31/12/2017" in "unpinned-data-scrolling"
        And I click "unpinned-columns.31/12/2017|ellipsis"
        And I click "unpinned-columns.31/12/2017|sort-column-desc"
        And I wait for the grid to load
        And I should expect "unpinned-columns.31/12/2017|sort-indicator.desc" to be visible
        And I should expect "search-ribbon|title-text" to be visible
        When I click "taxonomy-item.metric"
        And I should wait for "first-list-panel-item-arrow" to exist
        And I click "first-list-panel-item-arrow"
        And I should wait for "first-simple-list-panel-item" to exist
        And I click "first-simple-list-panel-item"
        And I wait for the grid to load
        And I scroll to "unpinned-columns.geographylevel1" in "unpinned-data-scrolling"
        Then I should expect "unpinned-columns.geographylevel1|sort-indicator" to be visible


    Scenario: Sort by leftmost column and remove it
        Given I should expect "unpinned-columns.geographylevel1|sort-indicator" to be visible
        When I click "unpinned-columns.geographylevel1|ellipsis"
        And I click "unpinned-columns.geographylevel1|remove-column"
        And I wait for the grid to load
        Then I should expect "unpinned-columns.geographylevel2|sort-indicator" to be visible

#  @bob
#    Scenario: Sorting by column
#      Then I should be able to sort by the following
#        | column  | direction | type    | key             |
#        | country | asc       | text    | geographylevel2 |
#        | country | desc      | text    | geographylevel2 |
#        | dataset | asc       | text    | dataset         |
#        | dataset | desc      | text    | dataset         |
#        | 2012    | asc       | numeric | 31/12/2012      |
#        | 2012    | desc      | numeric | 31/12/2012      |
#        | 2015    | asc       | numeric | 31/12/2015      |
#        | 2015    | desc      | numeric | 31/12/2015      |

  # Currently broken by new MSSQL query changes

    @ignore
    Scenario Outline: Sorting by column
        And I click "unpinned-columns.<column>| ellipsis"
        And I click "unpinned-columns.<column>| sort-column-<direction>"
        And I wait for the grid to load
        Then I should expect "unpinned-columns.<column>| sort-indicator.<direction>" to be visible
        And I should expect "unpinned-data-grid|data-grid-row" to be sorted by "<key>" in "<direction>" "<type>" order

        Examples:
            | column          | direction | type    | key             |
            | geographylevel2 | asc       | text    | geographylevel2 |
            | geographylevel2 | desc      | text    | geographylevel2 |
            | dataset         | asc       | text    | dataset         |
            | dataset         | desc      | text    | dataset         |
            | 31/12/2015      | asc       | numeric | 31/12/2015      |
            | 31/12/2015      | desc      | numeric | 31/12/2015      |
            | 31/12/2017      | asc       | numeric | 31/12/2017      |
            | 31/12/2017      | desc      | numeric | 31/12/2017      |

  # Currently broken by new MSSQL query changes

    @ignore
    Scenario Outline: Sort by column and paginate
        Given I scroll to "unpinned-columns.<column>" in "unpinned-data-scrolling"
        When I click "unpinned-columns.<column>| ellipsis"
        And I click "unpinned-columns.<column>| sort-column-<direction>"
        And I wait for the grid to load
        Then I should expect "unpinned-columns.<column>| sort-indicator.<direction>" to be visible
        When I scroll to "unpinned-data-grid|last-row" in "unpinned-data-scrolling"
        And I should expect "unpinned-data-grid|data-grid-row" to be sorted by "<key>" in "<direction>" "<type>" order

        Examples:
            | column          | direction | type    | key             |
            | geographylevel2 | asc       | text    | geographylevel2 |
            | 31/12/2015      | desc      | numeric | 31/12/2015      |
