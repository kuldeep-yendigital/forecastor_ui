@retestme
Feature: Panel search

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load

#  Scenario: Search for "wire" in technology panel and select all found
#    When I click "taxonomy-item.technology"
#    And I type "wire" in "search-panel-input"
#    And I should wait for "first-list-panel-item" to exist
#    Then I should expect search results for "technology-panel|search-panel-results" to contain "wire"
#    When I click "select-all"
#    Then I should expect "technology-panel" checkboxes to be checked

    Scenario: Search for "USA" and "Canada" that makes up for the "North America" continent that should be selected
        Given I click "taxonomy-item.geography"
        And I should wait for "first-list-panel-item" to exist
        When I type "USA" in "search-panel-input"
        Then I should wait for "search-panel-item.USA" to exist
        Then I should expect "search-panel-item.USA" to exist
        And I click "search-panel-item.USA"
        When I type "canada" in "search-panel-input"
        Then I should wait for "search-panel-item.Canada" to exist
        Then I should expect "search-panel-item.Canada" to exist
        And I click "search-panel-item.Canada"
        When I type "north america total" in "search-panel-input"
        Then I should wait for "search-panel-item.North.America.Total" to exist
        Then I should expect "search-panel-item.North.America.Total" to exist
        And I click "search-panel-item.North.America.Total"
        When I click "arrow-back"
        And I click "multi-list-panel-item.Americas|next-link"
        Then I should expect "geography-panel" to have a selected checkbox containing "North America"
