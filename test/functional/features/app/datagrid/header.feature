Feature: Data Grid Header

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I should wait for "unpinned-data-grid|data-grid-row" to exist
        And I should expect "first-row-select-checkbox" to be visible within viewport

    Scenario: Header remains in view on scroll
        When I scroll down "500" px in "unpinned-data-grid|data-grid-data"
        Then I should expect "first-row-select-checkbox" to not be visible within viewport
        And I should expect "unpinned-data-grid|data-grid-heading" to be visible within viewport
