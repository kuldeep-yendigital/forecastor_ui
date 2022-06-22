@searchribbon
Feature:
    As a forecaster customer
    I want to open the ribbon bar
    So that I can navigate filtering options

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load

    Scenario: Search ribbon is in text view by default
        Then I should expect "search-ribbon|title-text" to be visible

    Scenario: Search ribbon displays icon view when clicking collapse
        Given I click "search-ribbon|collapse-btn"
        Then I should expect "search-ribbon|title-text" to not be visible
        And I should expect "search-ribbon|title-logo" to be visible

    @bob @ben
    Scenario: Search ribbon displays text view when clicking expand
        Given I click "search-ribbon|collapse-btn"
        And I wait 1 second
        Then I should expect "search-ribbon|title-text" to not be visible
        And I should expect "search-ribbon|title-logo" to be visible
        And I click "search-ribbon|collapse-btn"
        And I wait 1 second
        Then I should expect "search-ribbon|title-text" to be visible
        And I should expect "search-ribbon|title-logo" to be visible

    @bob
    Scenario: Search ribbon remembers the users previous view preference
        Given I click "search-ribbon|collapse-btn"
        Then I should expect "search-ribbon|title-text" to not be visible
        And I should expect "search-ribbon|title-logo" to be visible
        And I refresh the page
        And I should wait for "search-ribbon" to exist
        Then I should expect "search-ribbon|title-text" to not be visible
        And I should expect "search-ribbon|title-logo" to be visible
