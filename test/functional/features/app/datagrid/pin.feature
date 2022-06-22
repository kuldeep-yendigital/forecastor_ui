Feature: Data Grid Pinning

    Background:
        Given I visit forecaster
        And I login
        And I click "navigate-grid"
        And I should wait for "unpinned-data-grid|data-grid-row" to exist

    Scenario: Pin column
        When I click "unpinned-columns.geographylevel1|ellipsis"
        And I click "unpinned-columns.geographylevel1|pin-column"
        Then I should wait for "pinned-columns.geographylevel1" to exist

    Scenario: Pin column ordering by first pinned
        Given I should expect "unpinned-columns" to be ordered:
            | column-header.geographylevel1 |
            | column-header.geographylevel2 |
        When I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|pin-column"
        And I should wait for "pinned-columns.geographylevel2" to exist
        Then I should expect "pinned-columns" to be ordered:
            | column-header.geographylevel2 |
        When I click "unpinned-columns.geographylevel1|ellipsis"
        And I click "unpinned-columns.geographylevel1|pin-column"
        And I should wait for "pinned-columns.geographylevel1" to exist
        Then I should expect "pinned-columns" to be ordered:
            | column-header.geographylevel2 |
            | column-header.geographylevel1 |

    Scenario: Pin column grouping
        Given I should expect "unpinned-columns" to be ordered:
            | column-header.geographylevel1 |
            | column-header.geographylevel2 |
            | column-header.datasetlevel1   |
        When I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|pin-column"
        And I should wait for "pinned-columns.geographylevel2" to exist
        Then I should expect "pinned-columns" to be ordered:
            | column-header.geographylevel2 |
        And I click "unpinned-columns.datasetlevel1|ellipsis"
        And I click "unpinned-columns.datasetlevel1|pin-column"
        And I should wait for "pinned-columns.datasetlevel1" to exist
        Then I should expect "pinned-columns" to be ordered:
            | column-header.geographylevel2 |
            | column-header.datasetlevel1   |
        And I click "unpinned-columns.geographylevel1|ellipsis"
        And I click "unpinned-columns.geographylevel1|pin-column"
        And I should wait for "pinned-columns.geographylevel1" to exist
        Then I should expect "pinned-columns" to be ordered:
            | column-header.geographylevel2 |
            | column-header.geographylevel1 |
            | column-header.datasetlevel1   |

    Scenario: Value columns are not pinnable
        When I scroll to "unpinned-columns.31/12/2016" in "unpinned-data-grid|data-grid-data"
        And I click "unpinned-columns.31/12/2016|ellipsis"
        Then I should expect "unpinned-columns.31/12/2016|pin-column" to not be enabled

    Scenario: Pin and unpin column
        Given I should expect "pinned-columns" to not exist
        When I click "unpinned-columns.geographylevel2|ellipsis"
        And I should wait for "unpinned-columns.geographylevel2|pin-column" to exist
        And I click "unpinned-columns.geographylevel2|pin-column"
        And I should wait for "pinned-columns.geographylevel2" to exist
        Then I should expect "pinned-columns" to match:
            | column-header.geographylevel2 |
        When I click "pinned-columns.geographylevel2|ellipsis"
        And I click "pinned-columns.geographylevel2|pin-column"
        Then I should wait for "pinned-columns.geographylevel2" to not exist

    Scenario: Pin and back
        When I click "unpinned-columns.geographylevel2|ellipsis"
        And I click "unpinned-columns.geographylevel2|pin-column"
        And I should wait for "pinned-columns.geographylevel2" to exist
        Then I should expect "pinned-columns" to be ordered:
            | column-header.geographylevel2 |
        And I click "unpinned-columns.datasetlevel1|ellipsis"
        And I click "unpinned-columns.datasetlevel1|pin-column"
        And I should wait for "pinned-columns.datasetlevel1" to exist
        Then I should expect "pinned-columns" to be ordered:
            | column-header.geographylevel2 |
            | column-header.datasetlevel1   |
        And I wait 1 second
        When I hit the back button
        Then I should wait for "pinned-columns.datasetlevel1" to not exist
        When I hit the forward button
        Then I should wait for "pinned-columns.datasetlevel1" to exist
        Then I should expect "pinned-columns" to be ordered:
            | column-header.geographylevel2 |
            | column-header.datasetlevel1   |
