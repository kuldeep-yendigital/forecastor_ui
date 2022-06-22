@export
Feature: Export Data

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load

    Scenario: Export csv data with export enabled
        When I click the "export-menu"
        And I click the "export-csv"
        And I wait for update to finish
        And I should wait for "snackbar|message" to exist
        And I wait 1 second
        Then I should expect "snackbar|message" text to "match" "Export started"
