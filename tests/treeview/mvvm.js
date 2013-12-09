(function() {
    module("MVVM", TreeViewHelpers.basicModule);
    /*

    test("initializes a treeview when data role is treeview", function() {
        var dom = $('<ul data-role="treeview"></ul>');

        kendo.bind(dom);

        ok(dom.data("kendoTreeView") instanceof kendo.ui.TreeView);
    });

    test("initializes a options from data attributes", function() {
        var dom = $('<ul data-role="treeview" data-animation="false"></ul>');

        kendo.bind(dom);

        var treeview = dom.data("kendoTreeView");

        ok($.isEmptyObject(treeview.options.animation.effects));
    });

    test("binding treeview initialized before binding", function() {
        var dom = $('<ul data-animation="false"></ul>');

        var treeview = dom.kendoTreeView().data("kendoTreeView");

        kendo.bind(dom);

        ok($.isEmptyObject(treeview.options.animation.effects));
    });

    test("binding containing binding attributes", function() {
        var dom = $('<ul data-role="treeview"><span data-bind="text:text"></span></ul>');

        var observable = kendo.observable({ text:"foo" });

        kendo.bind(dom, observable);

        equal($.trim(dom.find("span:first").html()), "foo");
    });

    test("updating viewModel updates the content", function() {
        var dom = $('<ul data-role="treeview"><span data-bind="text:text"></span></ul>');

        var observable = kendo.observable({ text:"foo" });

        kendo.bind(dom, observable);

        observable.set("text", "bar");

        equal($.trim(dom.find("span:first").html()), "bar");
    });

    test("event is raised if attached as option", 1, function() {
        var dom = $('<ul data-role="treeview" data-select="selectHandler"></ul>');

        kendo.bind(dom);

        window.selectHandler = function() { ok(true); };
        dom.data("kendoTreeView").trigger("select");
        delete window.selectHandler;
    });

    test("binding visible to true shows the treeview", function() {
        var dom = $('<div data-role="treeview" data-bind="visible: visible"></div>');

        kendo.bind(dom, { visible: true });

        var treeview = dom.data("kendoTreeView");

        ok(treeview.wrapper.css("display") != "none", "treeview is visible");
    });

    test("binding visible to false hides the treeview", function() {
        var dom = $('<div data-role="treeview" data-bind="visible: visible"></div>');

        kendo.bind(dom, { visible: false });

        var treeview = dom.data("kendoTreeView");

        ok(treeview.wrapper.css("display") == "none", "treeview is not visible");
    });

    test("binding invisible to true hides the treeview", function() {
        var dom = $('<div data-role="treeview" data-bind="invisible: invisible"></div>');

        kendo.bind(dom, { invisible: true });

        var treeview = dom.data("kendoTreeView");

        ok(treeview.wrapper.css("display") == "none", "treeview is invisible");
    });

    test("binding invisible to false shows the treeview", function() {
        var dom = $('<div data-role="treeview" data-bind="invisible: invisible"></div>');

        kendo.bind(dom, { invisible: false });

        var treeview = dom.data("kendoTreeView");

        ok(treeview.wrapper.css("display") != "none", "treeview is not invisible");
    });

    test("source binding", function() {
        var dom = $('<div data-role="treeview" data-bind="source: source"></div>');

        var viewModel = kendo.observable({
            source: new kendo.data.HierarchicalDataSource({
                data: [
                    { text: "baz" }
                ]}
            )
        });

        kendo.bind(dom, viewModel);

        equal(dom.text(), "baz");
    });

    test("template binding", function() {

        var dom = $(
            '<script id="fooTemplate" type="text/x-kendo-template">#:item.text# foo</script>' +
            '<div data-role="treview" data-template="fooTemplate" data-bind="source: source"></div>'
        );

        var viewModel = kendo.observable({
            source: [
                { text: "bar" }
            ]
        });

        kendo.bind(dom, viewModel);

        equal(dom.text(), "bar foo");
    });

    test("set multi-level dataTextField through data attribute", function() {
        var dom = $('<div data-text-field="[\'foo\',\'bar\']" data-bind="source: src" data-role="treeview" />');

        kendo.bind(dom, kendo.observable({
            src: new kendo.data.HierarchicalDataSource({
                data: [
                    { foo: "foo" }
                ]
            })
        }));

        equal(dom.find(".k-in:contains('undefined')").length, 0);
    });

    test("adding items to root level when datasource is in observable object", function() {
        var dom = $('<div data-bind="source: src" data-role="treeview" />');

        var viewModel = kendo.observable({
            src: new kendo.data.HierarchicalDataSource({
                data: [
                    { text: "foo" }
                ]
            })
        })

        kendo.bind(dom, viewModel);

        viewModel.src.add({ text: "bar" });

        equal(dom.find(".k-item").length, 2);
        equal(dom.find(".k-item:last").text(), "bar");
    });

    test("removing items from root level when datasource is in observable object", function() {
        var dom = $('<div data-bind="source: src" data-role="treeview" />');

        var viewModel = kendo.observable({
            src: new kendo.data.HierarchicalDataSource({
                data: [
                    { text: "foo" },
                    { text: "bar" }
                ]
            })
        })

        kendo.bind(dom, viewModel);

        var bar = viewModel.src.data()[1];

        viewModel.src.remove(bar);

        equal(dom.find(".k-item").length, 1);
        equal(dom.find(".k-item:last").text(), "foo");
    });



    (function() {
        module("MVVM : observableHierarchy", TreeViewHelpers.basicModule);

        var viewModel, dom, treeview;

        function setupObservableBinding(data) {
            viewModel = kendo.observable({
                    products: kendo.observableHierarchy(data)
                });

            dom = $('<div />').appendTo(QUnit.fixture)
                .kendoTreeView({
                    dataSource: viewModel.products
                });

            treeview = dom.data("kendoTreeView");
        }

        test("binding to hierarchical observable", function() {
            setupObservableBinding([
                { text: "foo", expanded: true, items: [
                    { text: "bar" }
                ] }
            ]);

            viewModel.get("products")[0].get("items")[0].set("text", "baz");

            equal(dom.find(".k-item .k-item").text(), "baz");
        });

        test("adding children to root array adds them to the treeview", function() {
            setupObservableBinding([
                { text: "foo" }
            ]);

            viewModel.products.push({ text: "bar" });

            equal(dom.find(".k-item").length, 2);
            equal(dom.find(".k-item:last").text(), "bar");
        });

        test("adding children to child array adds them to the treeview", function() {
            setupObservableBinding([
                { text: "foo", items: [] }
            ]);

            viewModel.products[0].items.push({ text: "bar" });

            equal(dom.find(".k-item .k-item").length, 1);
            equal(dom.find(".k-item .k-item").text(), "bar");
        });

        test("removing children to child array removes them from the treeview", function() {
            setupObservableBinding([
                { text: "foo", items: [
                    { text: "bar" }
                ] }
            ]);

            viewModel.products[0].items.splice(0, 1);

            equal(dom.find(".k-item .k-item").length, 0);
        });

        test("setting selected field selects node", function() {
            setupObservableBinding([
                { text: "foo" }
            ]);

            viewModel.products[0].set("selected", true);

            equal(dom.find(".k-state-selected").length, 1);
        });

        test("selecting a node sets the node selected flag", function() {
            setupObservableBinding([
                { text: "foo" }
            ]);

            dom.find(".k-in").trigger("click");

            ok(viewModel.products[0].get("selected"));
        });

        test("selecting a node removes selected flag from other nodes", function() {
            setupObservableBinding([
                { text: "foo", selected: true },
                { text: "bar" }
            ]);

            dom.find(".k-in:last").trigger("click");

            ok(!viewModel.products[0].get("selected"));
            ok(!("selected" in viewModel.products[0]));
        });

        test("setting expanded flag expands item", function() {
            setupObservableBinding([
                { text: "foo", items: [
                    { text: "bar" }
                ] }
            ]);

            viewModel.products[0].set("expanded", true);

            equal(dom.find(".k-group").length, 2);
            ok(dom.find(".k-group:last").is(":visible"));
        });

        test("changing spriteCssClass updates item", function() {
            setupObservableBinding([
                { text: "foo", spriteCssClass: "folder" }
            ]);

            viewModel.products[0].set("spriteCssClass", "file");

            ok(dom.find(".k-sprite").hasClass("file"));
            ok(!dom.find(".k-sprite").hasClass("folder"));
        });

        test("changing imageUrl updates item", function() {
            setupObservableBinding([
                { text: "foo", imageUrl: "folder.png" }
            ]);

            viewModel.products[0].set("imageUrl", "file.png");

            ok(dom.find(".k-image").attr("src").indexOf("file") >= 0);
            ok(!dom.find(".k-image").attr("src").indexOf("folder") >= 0);
        });

        test("append of item works", function() {
            setupObservableBinding([
                { text: "foo", expanded: true, items: [
                    { text: "bar" }
                ] }
            ]);

            treeview.append(dom.find(".k-item .k-item"));

            ok(dom.find(".k-item").length, 2);
        });

        test("declarative binding", function() {
            viewModel = kendo.observable({
                    products: kendo.observableHierarchy([
                        { text: "foo" }
                    ])
                });

            dom = $("<div data-role='treeview' data-bind='source: products' />").appendTo(QUnit.fixture);

            kendo.bind(dom, viewModel);

            viewModel.products[0].items.push({ text: "bar" });

            equal(dom.find(".k-item .k-item").length, 1);
        });

        test("enable checkboxes through data attribute", function() {
            var dom = $('<ul data-role="treeview" data-checkboxes="true"></ul>');

            kendo.bind(dom);

            ok(dom.data("kendoTreeView").options.checkboxes);
        });
    })();
    */
})();
