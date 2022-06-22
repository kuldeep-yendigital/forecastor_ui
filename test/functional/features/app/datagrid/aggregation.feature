Feature: Data Grid Aggregation

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load

    Scenario: A new column (company) is added then removed
        When I click "column-selector"
        Then I should expect "column-selector-menu" to be visible
        When I click "column-selector|column-selector-menu|column-group.company|checkbox"
        Then I should wait for "unpinned-data-grid|column-group-name.company" to exist
        Then I should expect "unpinned-data-grid|column-group-name.company" to exist
        When I click "column-selector|column-selector-menu|column-group.company|checkbox"
        And I wait for update to finish
        Then I should expect "unpinned-data-grid|column-group-name.company" to not exist
