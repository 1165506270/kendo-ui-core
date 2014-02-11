(function() {
   var Grid = kendo.ui.Grid,
        table,
        data = [{ foo: "foo", bar: "bar" }],
        ns,
        DataSource = kendo.data.DataSource;

    module("grid column menu", {
        setup: function() {
            ns = kendo.ns;
            kendo.ns = "";
            table = $("<table></table>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
            table.closest(".k-grid").remove();
            kendo.ns = ns;
        }
    });

    function setup(options) {
        return new Grid(table, $.extend(true, {}, {
            columnMenu: true,
            dataSource: data
        },
        options));
    }

    test("column menu in config options", function() {
        strictEqual(Grid.fn.options.columnMenu, false);
    });

    test("column menu initialized in Grid header", function() {
        var grid = setup({
            columns: ["foo", "bar"]
        });

        var th = grid.thead.find("th");
        ok(th.eq(0).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
        ok(th.eq(1).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
    });

    test("column menu initialized in Grid header when auto columns", function() {
        var grid = setup();

        var th = grid.thead.find("th");
        ok(th.eq(0).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
        ok(th.eq(1).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
    });

    test("columnMenu as true boolean", function() {
        var grid = setup();

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.sortable, false);
        equal(menu.options.columns, true);
        equal(menu.options.filterable, false);
    });

    test("columnMenu columns message changed", function() {
        var grid = setup({
            columnMenu: {
                messages: {
                    columns: "foo"
                }
            }
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.messages.columns, "foo");
    });

    test("columnMenu columns set to false", function() {
        var grid = setup({
            columnMenu: {
                columns: false
            }
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.columns, false);
    });

    test("columnMenu as true boolean and sortable grid", function() {
        var grid = setup({ sortable: true });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.sortable, true);
        equal(menu.options.filterable, false);
    });

    test("columnMenu as true boolean and sortable grid not sortable column", function() {
        var grid = setup({
            sortable: true,
            columns: [{ field: "foo", sortable: false }]
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.sortable, false);
    });

    test("columnMenu in sortable grid changed text", function() {
        var grid = setup({
            sortable: true,
            columnMenu: {
                messages: {
                    sortAscending: "foo"
                }
            }
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.sortable, true);
        equal(menu.options.messages.sortAscending, "foo");
    });

    test("columnMenu as true boolean and filterable grid", function() {
        var grid = setup({ filterable : true });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        ok(menu.options.filterable);
    });

    test("columnMenu as true boolean and filterable grid not filterable column", function() {
        var grid = setup({
            filterable: true,
            columns: [{ field: "foo", filterable: false }]
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.filterable, false);
    });

    test("columnMenu in filterable grid changed text", function() {
        var grid = setup({
            filterable: true,
            columnMenu: {
                messages: {
                    filter: "foo"
                }
            }
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        ok(menu.options.filterable);
        equal(menu.options.messages.filter, "foo");
    });

    test("filterable grid does not render header filter link", function() {
        var grid = setup({ filterable: true });

        equal(grid.thead.find(".k-grid-filter").length, 0);
    });

    test("column menu init event", 1, function() {
        var grid = setup({
            columns: ["foo"],
            columnMenu: true,
            columnMenuInit: function(e) {
                equal(e.field, "foo");
            }
        });

        grid.thead.find("th:first").data("kendoColumnMenu").link.click();
    });

    test("column menu initialization over locked columns", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "bar" }
            ]
        });

        var th = grid.wrapper.find("th");
        ok(th.eq(0).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu, "locked column doesn't have column menu");
        ok(th.eq(1).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu, "non locked column doesn't have column menu");
    });

    test("column menu lockedColumns is set", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "bar" }
            ]
        });

        var th = grid.wrapper.find("th");
        equal(th.eq(0).data("kendoColumnMenu").options.lockedColumns, true);
        equal(th.eq(1).data("kendoColumnMenu").options.lockedColumns, true);
    });

    test("column menu lockedColumns is not set", function() {
        var grid = setup({
            columns: [
                { field: "foo" },
                { field: "bar" }
            ]
        });

        var th = grid.wrapper.find("th");
        equal(th.eq(0).data("kendoColumnMenu").options.lockedColumns, false);
        equal(th.eq(1).data("kendoColumnMenu").options.lockedColumns, false);
    });
})();
