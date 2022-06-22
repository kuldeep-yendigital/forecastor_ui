@smoke
Feature: Smoke test

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load

    Scenario: Intercom present
        And I should wait for "intercom" to exist
        Then I should expect "intercom" to exist

    Scenario: Data grid loaded
        Then I should wait for "data-grid-row" to exist
        Then I should see "data-grid-row" at least "2" times

    Scenario: Search selection
        Then I should expect "search-ribbon|title-text" to be visible
        When I click "taxonomy-item.geography"
        Then I should wait for "first-list-panel-item" to exist
        And I click "first-list-panel-item"
        And I wait for the grid to load
        And I click "taxonomy-item.metric"
        And I should wait for "first-list-panel-item-arrow" to exist
        And I click "first-list-panel-item-arrow"
        And I should wait for "first-simple-list-panel-item" to exist
        And I click "first-simple-list-panel-item"
        And I wait for the grid to load
        And I click "taxonomy-item.timeframe"
        And I should wait for "date-selector-year-From:" to exist
        And I select the "2016" option for "date-selector-year-From:"
        And I wait for the grid to load
        Then I should see "data-grid-row" at least "2" times

    Scenario: Visualisation present
        And I should wait for "data-grid-row" to exist
        And I click "first-row-select-checkbox"
        And I click "second-row-select-checkbox"
        And I click "show-chart-button"
        Then I should expect "visualisation-canvas" to exist
