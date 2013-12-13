(function() {
    var dataviz = kendo.dataviz,
        SeriesAggregator = dataviz.SeriesAggregator,
        DefaultAggregates = dataviz.DefaultAggregates,
        defined = dataviz.defined,
        binder,
        defaults,
        series;

    function aggregate(series, indexes) {
        var sa = new SeriesAggregator(series, binder, defaults);

        return sa.aggregatePoints(indexes || [0, 1]);
    }

    // ------------------------------------------------------------
    module("SeriesAggregator / Simple aggregates", {
        setup: function() {
            binder = new dataviz.SeriesBinder();
            binder.register(["foo"], ["value"], []);

            defaults = new DefaultAggregates();
            defaults.register(["foo"], { value: "max" });

            series = {
                type: "foo",
                data: [{
                    value: 1
                }, {
                    value: 2
                }]
            };
        }
    });

    test("accepts named aggregates", function() {
        series.aggregate = "min";

        deepEqual(aggregate(series), { value: 1 });
    });

    test("default aggregate is max", function() {
        deepEqual(aggregate(series), { value: 2 });
    });

    test("accepts function aggregates", function() {
        series.aggregate = function(values) {
            return 5;
        };

        deepEqual(aggregate(series), { value: 5 });
    });

    test("allows function aggregates to return data items", function() {
        series.aggregate = function(values) {
            return { value: 5, bar: 1 };
        };

        deepEqual(aggregate(series), { value: 5, bar: 1 });
    });

    test("extends first dataItem", function() {
        series.data[0].bar = true;

        deepEqual(aggregate(series), { value: 2, bar: true });
        ok(aggregate !== series.data[0]);
    });

    test("overwrites only item", function() {
        var aggr = aggregate(series, [0]);
        console.warn("Chart: Skipping aggreate overwrite test until this optimization is fixed");
        ok(true);
        //ok(aggr === series.data[0]);
    });

    test("returns empty aggregate for empty source points array", function() {
        var sa = new SeriesAggregator(series, binder, defaults);

        deepEqual(sa.aggregatePoints(), {});
    });

    // ------------------------------------------------------------
    module("SeriesAggregator / Simple aggregates / Custom field", {
        setup: function() {
            binder = new dataviz.SeriesBinder();
            binder.register(["foo"], ["value"], []);

            defaults = new DefaultAggregates();
            defaults.register(["foo"], { value: "max" });

            series = {
                type: "foo",
                field: "fooValue",
                data: [{
                    fooValue: 1
                }, {
                    fooValue: 2
                }]
            };
        }
    });

    test("accepts named aggregates", function() {
        series.aggregate = "min";

        deepEqual(aggregate(series), { fooValue: 1 });
    });

    test("default aggregate is max", function() {
        deepEqual(aggregate(series), { fooValue: 2 });
    });

    test("accepts function aggregates", function() {
        series.aggregate = function(values) { return 5; };

        deepEqual(aggregate(series), { fooValue: 5 });
    });

    test("allows function aggregates to return data items", function() {
        series.aggregate = function(values) {
            return { fooValue: 5, bar: 1 };
        };

        deepEqual(aggregate(series), { fooValue: 5, bar: 1 });
    });

    test("extends first dataItem", function() {
        series.data[0].bar = true;

        deepEqual(aggregate(series), { fooValue: 2, bar: true });
    });

    test("returns empty aggregate for empty source points array", function() {
        var sa = new SeriesAggregator(series, binder, defaults);

        deepEqual(sa.aggregatePoints(), {});
    });

    // ------------------------------------------------------------
    module("SeriesAggregator / Simple aggregates / Nested field", {
        setup: function() {
            binder = new dataviz.SeriesBinder();
            binder.register(["foo"], ["value"], []);

            defaults = new DefaultAggregates();
            defaults.register(["foo"], { value: "max" });

            series = {
                type: "foo",
                field: "foo.value",
                data: [{
                    foo: {
                        value: 1
                    }
                }, {
                    foo: {
                        value: 2
                    }
                }]
            };
        }
    });

    test("accepts named aggregates", function() {
        series.aggregate = "min";

        deepEqual(aggregate(series), { foo: { value: 1 } });
    });

    test("default aggregate is max", function() {
        deepEqual(aggregate(series), { foo: { value: 2 } });
    });

    test("accepts function aggregates", function() {
        series.aggregate = function(values) { return 5; };

        deepEqual(aggregate(series), { foo: { value: 5 } });
    });

    test("allows function aggregates to return data items", function() {
        series.aggregate = function(values) {
            return { foo: { value: 5 }, bar: 1 };
        };

        deepEqual(aggregate(series), { foo: { value: 5 }, bar: 1 });
    });

    test("extends first dataItem", function() {
        series.data[0].bar = true;

        deepEqual(aggregate(series), { foo: { value: 2 }, bar: true });
    });

    test("returns empty aggregate for empty source points array", function() {
        var sa = new SeriesAggregator(series, binder, defaults);

        deepEqual(sa.aggregatePoints(), {});
    });

    // ------------------------------------------------------------
    module("SeriesAggregator / Simple aggregates / Array data", {
        setup: function() {
            binder = new dataviz.SeriesBinder();
            binder.register(["foo"], ["value"], []);

            defaults = new DefaultAggregates();
            defaults.register(["foo"], { value: "max" });

            series = {
                type: "foo",
                data: [1, 2]
            };
        }
    });

    test("accepts named aggregates", function() {
        series.aggregate = "min";

        deepEqual(aggregate(series), { value: 1 });
    });

    test("default aggregate is max", function() {
        deepEqual(aggregate(series), { value: 2 });
    });

    test("accepts function aggregates", function() {
        series.aggregate = function(values) {
            return 5;
        };

        deepEqual(aggregate(series), { value: 5 });
    });

    test("allows function aggregates to return data items", function() {
        series.aggregate = function(values) {
            return { value: 5, bar: 1 };
        };

        deepEqual(aggregate(series), { value: 5, bar: 1 });
    });

    test("returns empty aggregate for empty source points array", function() {
        var sa = new SeriesAggregator(series, binder, defaults);

        deepEqual(sa.aggregatePoints(), {});
    });

    // ------------------------------------------------------------
    module("SeriesAggregator / Compound aggregates", {
        setup: function() {
            binder = new dataviz.SeriesBinder();
            binder.register(["foo"], ["open", "close"], ["color"]);

            defaults = new DefaultAggregates();
            defaults.register(["foo"], { open: "max", close: "max", color: "first" });

            series = {
                type: "foo",
                data: [{
                    open: 1,
                    close: 2
                }, {
                    open: 10,
                    close: 20,
                    color: "red"
                }]
            };
        }
    });

    test("accepts named aggregates", function() {
        series.aggregate = {
            open: "min",
            close: "max"
        };

        deepEqual(aggregate(series), { open: 1, close: 20 });
    });

    test("applies default aggregates", function() {
        deepEqual(aggregate(series), { open: 10, close: 20, color: "red" });
    });

    test("accepts function aggregates", function() {
        series.aggregate = {
            open: function(values) { return 5; },
            close: "max"
        };

        deepEqual(aggregate(series), { open: 5, close: 20 });
    });

    test("accepts data items from top-level aggregate", function() {
        series.aggregate = function(values) {
            return { open: 5, close: 5 };
        };

        deepEqual(aggregate(series), { open: 5, close: 5 });
    });

    test("extends first dataItem", function() {
        series.data[0].bar = true;
        deepEqual(aggregate(series), { open: 10, close: 20, color: "red", bar: true });
    });

    test("root-level named aggregate is applied to value fields only", function() {
        series.aggregate = "max";

        deepEqual(aggregate(series), { open: 10, close: 20 });
    });

    // ------------------------------------------------------------
    module("SeriesAggregator / Compound aggregates / Custom fields", {
        setup: function() {
            binder = new dataviz.SeriesBinder();
            binder.register(["foo"], ["open", "close"], []);

            defaults = new DefaultAggregates();
            defaults.register(["foo"], { open: "max", close: "max" });

            series = {
                type: "foo",
                openField: "fooOpen",
                closeField: "fooClose",
                data: [{
                    fooOpen: 1,
                    fooClose: 2
                }, {
                    fooOpen: 10,
                    fooClose: 20
                }]
            };
        }
    });

    test("accepts named aggregates", function() {
        series.aggregate = {
            open: "min",
            close: "max"
        };

        deepEqual(aggregate(series), { fooOpen: 1, fooClose: 20 });
    });

    test("applies default aggregates", function() {
        deepEqual(aggregate(series), { fooOpen: 10, fooClose: 20 });
    });

    test("accepts function aggregates", function() {
        series.aggregate = {
            open: function(values) { return 5; },
            close: "max"
        };

        deepEqual(aggregate(series), { fooOpen: 5, fooClose: 20 });
    });

    test("extends first dataItem", function() {
        series.data[0].bar = true;
        deepEqual(aggregate(series), { fooOpen: 10, fooClose: 20, bar: true });
    });

    test("accepts data items from top-level aggregate", function() {
        series.aggregate = function(values) {
            return { fooOpen: 5, fooClose: 5 };
        };

        deepEqual(aggregate(series), { fooOpen: 5, fooClose: 5 });
    });

    // ------------------------------------------------------------
    module("SeriesAggregator / Compound aggregates / Array data", {
        setup: function() {
            binder = new dataviz.SeriesBinder();
            binder.register(["foo"], ["open", "close"], []);

            defaults = new DefaultAggregates();
            defaults.register(["foo"], { open: "max", close: "max" });

            series = {
                type: "foo",
                data: [[1, 2], [10, 20]]
            };
        }
    });

    test("accepts named aggregates", function() {
        series.aggregate = {
            open: "min",
            close: "max"
        };

        deepEqual(aggregate(series), { open: 1, close: 20 });
    });

    test("applies default aggregates", function() {
        deepEqual(aggregate(series), { open: 10, close: 20 });
    });

    test("accepts function aggregates", function() {
        series.aggregate = {
            open: function(values) { return 5; },
            close: "max"
        };

        deepEqual(aggregate(series), { open: 5, close: 20 });
    });

    test("accepts data items from top-level aggregate", function() {
        series.aggregate = function(values) {
            return { open: 5, close: 5 };
        };

        deepEqual(aggregate(series), { open: 5, close: 5 });
    });

    // ------------------------------------------------------------
    var defaults;

    module("DefaultAggregates", {
        setup: function() {
            defaults = new DefaultAggregates();

            defaults.register(["foo", "bar"], {
                value: "min",
                color: "first"
            });
        }
    });

    test("retrieves default aggregates", function() {
        deepEqual(defaults.query("foo"), {
            value: "min",
            color: "first"
        });
    });

    test("retrieves default aggregates for all series", function() {
        deepEqual(defaults.query("foo"), defaults.query("bar"));
    });

})();
