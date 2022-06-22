Feature: Data Grid Pagination

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I should wait for "unpinned-data-grid|data-grid-row" to exist

  # TODO: Test loading in new page compatible
  # with grid optimizations.

    @ignore
    Scenario: Scroll down to load in more rows
        And I should see "unpinned-data-grid|data-grid-row" exactly "200" times
        When I scroll to "unpinned-data-grid|last-row" in "unpinned-data-scrolling"
        And I should see "unpinned-data-grid|data-grid-row" exactly "400" times
