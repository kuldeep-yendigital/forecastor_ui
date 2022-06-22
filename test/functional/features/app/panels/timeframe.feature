Feature: Ribbon Timeframe

  Background:
    Given I visit forecaster
    And I login
    And I click "navigate-grid"
    And I wait for the grid to load

  Scenario Outline: Change timeframe interval
    Then I should wait for "column-header.31/12/2016" to exist
    When I click "taxonomy-item.timeframe"
    And I click the "<interval>"
    And I wait for update to finish
    Then I should expect "<column>" to exist

    Examples:
     | interval            | column                    |
     | timeframe-quarterly | column-header.31/03/2016  |

  Scenario: Change timeframe
    And I click "taxonomy-item.timeframe"
    And I select the "2000" option for "date-selector-year-From:"
    And I wait for the grid to load
    And I should wait for "column-header.31/12/2000" to exist
    Then I should expect "column-header.31/12/2000" to be visible
