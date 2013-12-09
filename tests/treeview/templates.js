(function() {
    var createTreeView = TreeViewHelpers.fromOptions;

    module("templates", TreeViewHelpers.basicModule);

    test("compiled item template", function() {
        createTreeView({
            dataSource: [
                { text: "bar" },
                { text: "baz" }
            ],
            template: kendo.template("foo #= item.text #")
        });

        var items = treeview.find(".k-item");

        equal(items.eq(0).text(), "foo bar");
        equal(items.eq(1).text(), "foo baz");
    });

    test("plain-text item template", function() {
        createTreeView({
            dataSource: [
                { text: "bar" },
                { text: "baz" }
            ],
            template: "foo #= item.text #"
        });

        var items = treeview.find(".k-item");

        equal(items.eq(0).text(), "foo bar");
        equal(items.eq(1).text(), "foo baz");
    });

    test("template applies to sub-items", function() {
        createTreeView({
            dataSource: [
                { text: "bar",
                  items: [
                    { text: "baz" }
                  ]
                }
            ],
            template: kendo.template("foo #= item.text #")
        });

        var items = treeview.find(".k-in");

        equal(items.eq(0).text(), "foo bar");
        equal(items.eq(1).text(), "foo baz");
    });

    test("update rendering when template-accessed property is changed", function() {
        createTreeView({
            dataSource: [
                { text: "foo", x: true }
            ],
            template: kendo.template("#= item.text # #= item.get('x') ? 'bar' : 'baz' #")
        });

        equal(treeview.find(".k-in").text(), "foo bar");

        treeviewObject.dataSource.data()[0].set("x", false);

        equal(treeview.find(".k-in").text(), "foo baz");
    });

    test("expands items if expanded attribute is accessed in template", function() {
        createTreeView({
            dataSource: [
                { text: "foo", expanded: false, items: [
                    { text: "bar" }
                ] }
            ],
            template: kendo.template("#= item.text # #= item.get('expanded') ? 'a' : 'b' #")
        });

        treeviewObject.expand(".k-item");

        equal(treeview.find(".k-item:visible").length, 2);
    });
})();
