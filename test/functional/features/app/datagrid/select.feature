Feature: Data Grid Select

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load

    Scenario: Select rows in data grid
        When I click "first-row-select-checkbox"
        Then I should expect "row-selection" text to "match" "1 selected"
        When I click "second-row-select-checkbox"
        And I wait 1 second
        Then I should expect "row-selection" text to "match" "2 selected"

    Scenario: Select and deselect rows in data grid
        When I click "first-row-select-checkbox"
        When I click "second-row-select-checkbox"
        Then I should expect "row-selection" text to "match" "2 selected"
        When I click "first-row-select-checkbox"
        Then I should expect "row-selection" text to "match" "1 selected"
        When I click "second-row-select-checkbox"
        Then I should expect "row-selection" to not exist

    Scenario: Select rows and clear selection
        When I click "first-row-select-checkbox"
        And I click "second-row-select-checkbox"
        Then I should expect "row-selection" text to "match" "2 selected"
        When I click "row-selection"
        Then I should expect "row-selection" to not exist

    Scenario: Select rows and change filter
        Given I click "first-row-select-checkbox"
        And I click "second-row-select-checkbox"
        And I should expect "row-selection" text to "match" "2 selected"
        When I click "taxonomy-item.geography"
        And I wait for update to finish
        And I should wait for "first-list-panel-item" to exist
        And I click "first-list-panel-item"
        And I wait for update to finish
        Then I should expect "row-selection" to not exist


    Scenario: Select rows and sort
        Given I click "first-row-select-checkbox"
        And I click "second-row-select-checkbox"
        And I should expect "row-selection" text to "match" "2 selected"
        And I wait for update to finish
        When I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|sort-column-desc"
        And I wait for update to finish
        Then I should expect "row-selection" to not exist

  # Currently doesn't work with new lazy style grid rendering

    @ignore
    Scenario: Select rows and paginate
        Given I click "first-row-select-checkbox"
        And I click "second-row-select-checkbox"
        And I should expect "row-selection" text to "match" "2 selected"
        When I scroll to "unpinned-data-grid|last-row" in "unpinned-data-scrolling"
        And I wait for update to finish
        Then I should expect "row-selection" text to "match" "2 selected"
