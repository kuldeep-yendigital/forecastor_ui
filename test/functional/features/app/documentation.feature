Feature: Documentation

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load

    Scenario: Find information about Data Methodology
        When I click the "user-details"
        And I wait for update to finish
        And I click the "data-methodology"
        Then I should expect "data-methodology-title" text to "match" "Data methodology"

    Scenario: Find Help documentation
        When I click the "user-details"
        And I wait for update to finish
        And I click the "help"
        Then I should expect "help-title" text to "match" "Help"
