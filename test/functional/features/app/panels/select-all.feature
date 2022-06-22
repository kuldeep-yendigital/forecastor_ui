Feature: Panel select all

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load

    Scenario: Select all ticks all the filters including children
        When I click "taxonomy-item.technology"
        And I click "technology-panel|select-all"
        And I wait for update to finish
        Then I should expect "technology-panel" checkboxes to be checked

        When I click "arrow-next"
        Then I should expect "technology-panel" checkboxes to be checked

        When I click "arrow-back"
        And I click "technology-panel|clear-all"
        Then I should expect "technology-panel" checkboxes to not be checked

        When I click "arrow-next"
        And I click "technology-panel|clear-all"
        Then I should expect "technology-panel" checkboxes to not be checked
