(function() {
    var SearchBox = kendo.ui.SearchBox,
        input;

    module("kendo.ui.searchbox", {
        setup: function() {
            input = $("<input/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            input.parent().remove();
        }
    });

    function setup() {
        return new SearchBox(input);
    }

    test("element is wrapped", function() {
        var searchBox = setup();

        ok(searchBox.wrapper.is("div.k-search-wrap"));
    });

    test("renders a search button", function() {
        input.kendoSearchBox();

        ok(input.next().is("a.k-search"));
    });

    if (!kendo.support.placeholder) {
        test("renders a label", function() {
            input.kendoSearchBox();

            ok(input.prev().is("label"));
            equal(input.prev().text(), "Search");
        });

        test("label with custom text", function() {
            input.kendoSearchBox({ label: "foo" });

            equal(input.prev().text(), "foo");
        });

        test("bluring the input shows the label", function() {
            input.kendoSearchBox();

            input.trigger("focus");
            input.trigger("blur");

            ok(input.prev().is(":visible"));
        });

        test("bluring the input does not show the label if there is a value", function() {
            input.kendoSearchBox();

            input.trigger("focus");
            input.val("foo");
            input.trigger("blur");

            ok(input.prev().is(":not(:visible)"));
        });

        test("focusing the input hides the label", function() {
            input.kendoSearchBox();

            input.trigger("focus");

            ok(input.prev().is(":not(:visible)"));
        });

        test("value hides the label if not empty", function() {
            var searchBox = setup();
            searchBox.value("foo");

            ok(input.prev().is(":not(:visible)"));
        });
    } else {
        test("label is not rendered", function() {
            input.kendoSearchBox();

            ok(!input.prev().length);
        });

        test("placeholder is added", function() {
            input.kendoSearchBox();
            equal(input.attr("placeholder"), "Search");
        });

        test("placeholder with custom text", function() {
            input.kendoSearchBox({ label: "foo" });
            equal(input.attr("placeholder"), "foo");
        });
    }

    test("bluring triggers change event if value has changed", 1, function() {
        input.kendoSearchBox({
            change: function() {
                ok(true);
            }
        });

        input.trigger("focus");
        input.val("foo").trigger("change");
        input.trigger("blur");
    });

    test("value is set to the input", 1, function() {
        var searchBox = setup();

        searchBox.value("foo");
        equal(input.val(), "foo");
    });

    test("value does not trigger change event", 1, function() {
        var searchBox = setup();

        searchBox.bind("change", function() {
            ok(false);
        });

        searchBox.value("foo");
        equal(input.val(), "foo");
    });

    test("value returns the value", 2, function() {
        var searchBox = setup();

        searchBox.bind("change", function() {
            ok(true);
        });

        input.val("foo").trigger("change");

        equal(searchBox.value(), "foo");
    });

    test("clicking on the button triggers the change event", 1, function() {
        input.kendoSearchBox({
            change: function() {
                ok(true);
            }
        });

        input.val("foo");

        input.next().click();
    });

    test("clicking on the button without changing the value does not trigger the change event", 0, function() {
        input.kendoSearchBox({
            change: function() {
                ok(false);
            },
            value: "foo"
        });

        input.val("foo");

        input.next().click();
    });

    test("pressing enter triggers the change event", 1, function() {
        input.kendoSearchBox({
            change: function() {
                ok(true);
            }
        });

        input.val("foo");
        input.trigger($.Event("keydown", { keyCode: 13 }));
    });
})();
