Feature: Data Grid Visualisation

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load

    Scenario: Select row and visualise
        Given I click "first-row-select-checkbox"
        And I wait 1 second
        When I click "show-chart-button"
        Then I should expect "visualisation-canvas" to exist
        And I should see "plot-trace" exactly "1" times

    Scenario: Cannot visualise without selection
        Given I click "first-row-select-checkbox"
        And I wait 1 second
        And I should expect "show-chart-button" to exist
        When I click "first-row-select-checkbox"
        And I wait 1 second
        And I should expect "show-chart-button" to not exist

    Scenario: Select multiple rows and visualise
        And I click "first-row-select-checkbox"
        And I click "second-row-select-checkbox"
        And I wait 1 second
        And I click "show-chart-button"
        Then I should expect "visualisation-canvas" to exist
        And I should see "plot-trace" exactly "2" times
