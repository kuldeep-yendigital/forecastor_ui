Feature: Restore Defaults

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I wait for the grid to load

#  @notheadless
    Scenario: Change selection and restore defaults
        And I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|sort-column-asc"
        And I wait for update to finish
        And I should expect "unpinned-columns.geographylevel2|sort-indicator.asc" to be visible
        And I click "unpinned-columns.serviceslevel1|ellipsis"
        And I click "unpinned-columns.serviceslevel1|remove-column"
        And I wait for update to finish
        And I should expect "unpinned-columns.serviceslevel1" to not exist
        And I click "unpinned-columns.datasetlevel1|ellipsis"
        And I click "unpinned-columns.datasetlevel1|pin-column"
        And I wait for update to finish
        And I should wait for "pinned-columns.datasetlevel1" to exist
#    When I click "show-reset-confirmation-button"
#    And I accept the alert
#    And I wait for the grid to load
#    Then I should expect "unpinned-columns.country|sort-indicator.asc" to not be visible
#    And I should expect "unpinned-columns.region|sort-indicator.asc" to be visible
#    And I should expect "unpinned-columns.level1" to exist
#    And I should expect "pinned-columns.datasetlevel1" to not exist
#    And I should expect "unpinned-columns.datasetlevel1" to exist
