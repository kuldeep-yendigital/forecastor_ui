const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given}) {
    Given(/^I should be able to sort by the following$/, {retry: 2}, function (table) {
        const rows = table.hashes();

        rows.forEach(row => {
            const ellipsisSelector = this.getSelector(`unpinned-columns.${row.column}|ellipsis`)
            const sortItem = this.getSelector(`unpinned-columns.${row.column}|sort-column-${row.direction}`);
            const sortIndicator = this.getSelector(`unpinned-columns.${row.column}|sort-indicator-${row.direction}`);

            this.client
                .click(ellipsisSelector)
                .click(sortItem)

        });

        console.log(table.hashes());
    });
});
