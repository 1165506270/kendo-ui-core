(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    function BarStub(box) {
        this.box = box;
    }

    BarStub.prototype = {
        reflow: function(box) {
            this.box = box;
        }
    };

    function setupBarChart(plotArea, options) {
        view = new ViewStub();

        options.gap = 1.5;
        series = new dataviz.BarChart(plotArea, options);
        series.reflow();
    }

    function stubPlotArea(getCategorySlot, getValueSlot, options) {
        return new function() {
            this.categoryAxis = this.primaryCategoryAxis = {
                getSlot: getCategorySlot,
                options: {
                    axisCrossingValue: 0,
                    categories: options.categoryAxis.categories
                }
            };

            this.valueAxis = {
                getSlot: getValueSlot,
                options: {
                    axisCrossingValue: 0
                }
            };

            this.namedCategoryAxes = { };
            this.namedValueAxes = {};

            this.seriesCategoryAxis = function(series) {
                return series.categoryAxis ?
                    this.namedCategoryAxes[series.categoryAxis] : this.primaryCategoryAxis;
            };

            this.options = options;
        };
    }

    var positiveSeries = { data: [1, 2], labels: {} },
        negativeSeries = { data: [-1, -2], labels: {} },
        VALUE_AXIS_MAX = 2,
        CATEGORY_AXIS_Y = 2,
        TOLERANCE = 0.1;

    var plotArea = stubPlotArea(
            function(categoryIndex) {
                return new Box2D(categoryIndex, CATEGORY_AXIS_Y,
                categoryIndex + 1, CATEGORY_AXIS_Y);
            },
            function(a, b) {
                var a = typeof a === "undefined" ? 0 : a,
                    b = typeof b === "undefined" ? a : b,
                    top = VALUE_AXIS_MAX - Math.max(a, b),
                    bottom = VALUE_AXIS_MAX - Math.min(a, b),
                    slotTop = Math.min(CATEGORY_AXIS_Y, top),
                    slotBottom = Math.max(CATEGORY_AXIS_Y, bottom);

                return new Box2D(0, slotTop, 0, slotBottom);
            },
            {
                categoryAxis: {
                    categories: ["A", "B"]
                }
            }
        );

    // ------------------------------------------------------------
    module("Bar Chart / Positive Values", {
        setup: function() {
            setupBarChart(plotArea, { series: [ positiveSeries ] });
        }
    });

    test("Creates bars for series data points", function() {
        equal(series.points.length, positiveSeries.data.length);
    });

    test("Reports minimum value for default axis", function() {
        deepEqual(series.valueAxisRanges[undefined].min, positiveSeries.data[0]);
    });

    test("Reports maximum value for default axis", function() {
        deepEqual(series.valueAxisRanges[undefined].max, positiveSeries.data[1]);
    });

    test("Reports correct range with string value", function() {
        setupBarChart(plotArea, { series: [{ data: ["1", "2", "3"] }] });

        deepEqual(series.valueAxisRanges[undefined].min, 1);
        deepEqual(series.valueAxisRanges[undefined].max, 3);
    });

    test("Reports number of categories", function() {
        setupBarChart(plotArea, {series: [ positiveSeries ]});
        equal(categoriesCount(series.options.series), positiveSeries.data.length);
    });

    test("bars are distributed across category axis", function() {
        var barsX = $.map(series.points, function(bar) {
            return bar.box.x1;
        });

        arrayClose(barsX, [0.3, 1.3], TOLERANCE);
    });

    test("bar bottoms are aligned to category axis", function() {
        var barsY = $.map(series.points, function(bar) {
            return bar.box.y2;
        });

        deepEqual(barsY, [CATEGORY_AXIS_Y, CATEGORY_AXIS_Y]);
    });

    test("bars have set width", function() {
        $.each(series.points, function() {
            close(this.box.width(), 0.4, TOLERANCE);
        });
    });

    test("bars have set height according to value", function() {
        var barHeights = $.map(series.points, function(bar) {
            return bar.box.height();
        });

        deepEqual(barHeights, [1, 2]);
    });

    test("sets bar owner", function() {
        ok(series.points[0].owner === series);
    });

    test("sets bar series", function() {
        ok(series.points[0].series === positiveSeries);
    });

    test("sets bar series index", function() {
        ok(series.points[0].seriesIx === 0);
    });

    test("sets bar category", function() {
        equal(series.points[0].category, "A");
    });

    test("sets bar dataItem", function() {
        equal(typeof series.points[0].dataItem, "number");
    });

    test("sets bar aboveAxis", function() {
        equal(series.points[0].options.aboveAxis, true);
    });

    test("sets bar aboveAxis for reversed value axis", function() {
        plotArea.valueAxis.options.reverse = true;

        setupBarChart(plotArea, { series: [ positiveSeries ] });
        equal(series.points[0].options.aboveAxis, false);

        plotArea.valueAxis.options.reverse = false;
    });

    test("Throws error when unable to locate value axis", function() {
        raises(function() {
                setupBarChart(plotArea, {
                    series: [{ axis: "b", data: [1] }]
                });
            },
            /Unable to locate value axis with name b/);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Negative Values", {
        setup: function() {
            setupBarChart(plotArea, { series: [ negativeSeries ] });
        }
    });

    test("Reports minimum value for default axis", function() {
        deepEqual(series.valueAxisRanges[undefined].min, negativeSeries.data[1]);
    });

    test("Reports maximum value for default axis", function() {
        deepEqual(series.valueAxisRanges[undefined].max, negativeSeries.data[0]);
    });

    test("Reports correct range with string value", function() {
        setupBarChart(plotArea, { series: [{ data: ["-1", "-2", "-3"] }] });

        deepEqual(series.valueAxisRanges[undefined].min, -3);
        deepEqual(series.valueAxisRanges[undefined].max, -1);
    });

    test("bar tops are aligned to category axis", function() {
        var barsY = $.map(series.points, function(bar) {
            return bar.box.y1;
        });

        deepEqual(barsY, [CATEGORY_AXIS_Y, CATEGORY_AXIS_Y]);
    });

    test("bars have set height according to value", function() {
        var barHeights = $.map(series.points, function(bar) {
            return bar.box.height();
        });

        deepEqual(barHeights, [1, 2]);
    });

    test("sets bar aboveAxis", function() {
        equal(series.points[0].options.aboveAxis, false);
    });

    test("sets bar aboveAxis for reversed value axis", function() {
        plotArea.valueAxis.options.reverse = true;

        setupBarChart(plotArea, { series: [ negativeSeries ] });
        equal(series.points[0].options.aboveAxis, true);

        plotArea.valueAxis.options.reverse = false;
    });

    // ------------------------------------------------------------
    module("Bar Chart / Multiple Series", {
        setup: function() {
            plotArea.namedValueAxes.secondary = plotArea.valueAxis;

            setupBarChart(plotArea, {
                series: [
                    $.extend({ }, negativeSeries ),
                    $.extend({ axis: "secondary" }, positiveSeries )
                ] });
            }
    });

    test("Reports minimum value for primary axis", function() {
        deepEqual(series.valueAxisRanges[undefined].min, negativeSeries.data[1]);
    });

    test("Reports maximum value for primary axis", function() {
        deepEqual(series.valueAxisRanges[undefined].max, negativeSeries.data[0]);
    });

    test("Reports minimum value for secondary axis", function() {
        deepEqual(series.valueAxisRanges.secondary.min, positiveSeries.data[0]);
    });

    test("Reports maximum value for secondary axis", function() {
        deepEqual(series.valueAxisRanges.secondary.max, positiveSeries.data[1]);
    });

    test("Reports number of categories for two series", function() {
        equal(categoriesCount(series.options.series), positiveSeries.data.length);
    });

    // ------------------------------------------------------------
    var chart;
    module("Bar Chart / Multiple Category Axes", {
        setup: function() {
            chart = createChart({
                series: [{
                    type: "bar",
                    data: [1],
                    categoryAxis: "secondary"
                }],
                valueAxis: {
                    axisCrossingValue: [10, 0]
                },
                categoryAxis: [{
                    categories: ["A"]
                }, {
                    name: "secondary",
                    categories: ["B"]
                }]
            });

            series = chart._model._plotArea.charts[0];
        }
    });

    test("sets category axis to first series category axis", function() {
        equal(series.categoryAxis.options.name, "secondary");
    });

    test("bar is marked as above axis with respect to its category axis", function() {
        equal(series.points[0].options.aboveAxis, true);
    });

    test("bar is rendered from its category axis", function() {
        equal(series.points[0].box.x1, series.categoryAxis.lineBox().x1);
    });

    test("axis crossing value is assumed to be 0", function() {
        delete chart.options.valueAxis.axisCrossingValue;
        chart.refresh();
        series = chart._model._plotArea.charts[0];

        equal(series.points[0].options.aboveAxis, true);
    });

    test("axisCrossingValues alias is accepted with precedence", function() {
        chart.options.valueAxis.axisCrossingValues = [10, 10]
        chart.refresh();
        series = chart._model._plotArea.charts[0];

        equal(series.points[0].options.aboveAxis, false);
    });

    test("hides the series if the visible is set to false", function() {
        chart = createChart({
            series: [{
                type: "bar",
                data: [1],
                visible: false
            },{
                type: "bar",
                data: [1]
            }]
        });

        ok(series.points.length === 1);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Mismatched series", {
        setup: function() {
            setupBarChart(plotArea, {
            series: [ { data: [1, 2, 3] },
                      positiveSeries
                ]
            });
        }
    });

    test("Reports minimum value for default axis", function() {
        deepEqual(series.valueAxisRanges[undefined].min, 1);
    });

    test("Reports maximum value for default axis", function() {
        deepEqual(series.valueAxisRanges[undefined].max, 3);
    });

    test("Reports number of categories", function() {
        equal(categoriesCount(series.options.series), 3);
    });

    test("bar bottoms are aligned to category axis", 6, function() {
        $.each(series.points, function() {
            equal(this.box.y2, CATEGORY_AXIS_Y);
        });
    });

    // ------------------------------------------------------------
    module("Bar Chart / Missing values", {
        setup: function() {
            setupBarChart(plotArea, {
                series: [{ data: [1, 2, null] }]
            });
        }
    });

    test("Missing values are represented as bars with zero height", function() {
        var barHeights = $.map(series.points, function(bar) {
            return bar.box.height();
        });

        deepEqual(barHeights, [1, 2, 0]);
    });

    test("ignores null values when reporting minimum series value", function() {
        equal(series.valueAxisRanges[undefined].min, 1);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Cluster", {
        setup: function() {
            setupBarChart(plotArea, { series: [ positiveSeries, negativeSeries ] });
        }
    });

    test("bars in first category are clustered", function() {
        equal(series.points[0].box.x2, series.points[1].box.x1);
    });

    test("bars in different panes are not clustered", function() {
        var chart = createChart({
            series: [{
                type: "column",
                data: [1]
            }, {
                type: "column",
                data: [2],
                axis: "b"
            }],
            panes: [{
                name: "top"
            }, {
                name: "bottom"
            }],
            valueAxis: [{
            }, {
                name: "b",
                pane: "bottom"
            }],
            categoryAxis: {
                categories: ["A"]
            }
        });

        var barCharts = chart._model._plotArea.charts;
        close(barCharts[0].points[0].box.x1, barCharts[1].points[0].box.x1, TOLERANCE);
    });

    // ------------------------------------------------------------
    var oldGetSlot;
    module("Bar Chart / Stack / Positive Values", {
        setup: function() {
            oldGetSlot = plotArea.valueAxis.getSlot;

            plotArea.valueAxis.getSlot = function(a, b) {
                var a = typeof a === "undefined" ? 0 : a,
                    b = typeof b === "undefined" ? a : b,
                    top = VALUE_AXIS_MAX - Math.max(a, b),
                    bottom = VALUE_AXIS_MAX - Math.min(a, b),
                    slotTop = top,
                    slotBottom = bottom;

                return new Box2D(0, slotTop, 0, slotBottom);
            };

            setupBarChart(plotArea, {
                series: [ positiveSeries, positiveSeries ],
                isStacked: true }
            );
        },
        teardown: function() {
            plotArea.valueAxis.getSlot = oldGetSlot;
        }
    });

    test("reports 0 as minumum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].min, 0);
    });

    test("reports stacked maximum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].max, 4);
    });

    test("bars in first category are stacked", function() {
        equal(series.points[1].box.y2, series.points[0].box.y1);
    });

    test("series have 75% margin", function() {
        close(series.points[0].box.x1, 0.3, TOLERANCE);
    });

    test("bars have set height according to value", function() {
        var barHeights = $.map(series.points, function(bar) {
            return bar.box.height();
        });

        deepEqual(barHeights, [1, 1, 2, 2]);
    });

    test("stack base is set to zero value slot", function() {
        equal(series.points[0].options.stackBase, 2);
    });

    test("stack base is set to zero value slot when category axis is moved to top", function() {
        CATEGORY_AXIS_Y = 0;

        setupBarChart(plotArea, {
            series: [ positiveSeries, positiveSeries ],
            isStacked: true }
        );

        equal(series.points[0].options.stackBase, 2);

        CATEGORY_AXIS_Y = 2;
    });

    // ------------------------------------------------------------
    module("Bar Chart / Stack / Negative Values", {
        setup: function() {
            setupBarChart(plotArea, {
                series: [ negativeSeries, negativeSeries ],
                isStacked: true
            });
        }
    });

    test("reports stacked minumum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].min, -4);
    });

    test("reports 0 as maximum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].max, 0);
    });

    test("bars in first category are stacked", function() {
        equal(series.points[1].box.y1, series.points[0].box.y2);
    });

    test("stack tops are aligned to category axis", function() {
        deepEqual([series.points[0].box.y1, series.points[2].box.y1],
             [CATEGORY_AXIS_Y, CATEGORY_AXIS_Y]);
    });

    test("bars have set height according to value", function() {
        var barHeights = $.map(series.points, function(bar) {
            return bar.box.height();
        });

        deepEqual(barHeights, [1, 1, 2, 2]);
    });

    test("stack tops are aligned to 0 line when category axis crossing value is changed", function() {
        CATEGORY_AXIS_Y = 4;

        setupBarChart(plotArea, {
            series: [ negativeSeries, negativeSeries ],
            isStacked: true
        });

        deepEqual([series.points[0].box.y1, series.points[2].box.y1],
             [2, 2]);

        CATEGORY_AXIS_Y = 2;
    });

    test("stack base is set to zero value slot", function() {
        equal(series.points[0].options.stackBase, 2);
    });

    test("stack base is set to zero value slot when category axis is moved to bottom", function() {
        CATEGORY_AXIS_Y = 4;

        setupBarChart(plotArea, {
            series: [ negativeSeries, negativeSeries ],
            isStacked: true }
        );

        equal(series.points[0].options.stackBase, 2);

        CATEGORY_AXIS_Y = 2;
    });

    // ------------------------------------------------------------
    var oldGetSlot;
    module("Bar Chart / Stack / Mixed Values", {
        setup: function() {
            oldGetSlot = plotArea.valueAxis.getSlot;

            plotArea.valueAxis.getSlot = function(a, b) {
                var a = typeof a === "undefined" ? 0 : a,
                    b = typeof b === "undefined" ? a : b,
                    top = VALUE_AXIS_MAX - Math.max(a, b),
                    bottom = VALUE_AXIS_MAX - Math.min(a, b),
                    slotTop = top,
                    slotBottom = bottom;

                return new Box2D(0, slotTop, 0, slotBottom);
            };

            setupBarChart(plotArea, {
                series: [{
                    data: [1, -1],
                    labels: {}
                }],
                isStacked: true
            });
        },
        teardown: function() {
            plotArea.valueAxis.getSlot = oldGetSlot;
        }
    });

    test("reports stacked minumum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].min, -1);
    });

    test("reports stacked maximum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].max, 1);
    });

    test("bars have set height according to value", function() {
        var barHeights = $.map(series.points, function(bar) {
            return bar.box.height();
        });

        deepEqual(barHeights, [1, 1]);
    });

    test("stack base is set to zero value slot", function() {
        equal(series.points[0].options.stackBase, 2);
    });

    test("stack base is set to zero value slot when category axis is moved to bottom (negative series first)", function() {
        CATEGORY_AXIS_Y = 4;

        setupBarChart(plotArea, {
            series: [ negativeSeries, positiveSeries ],
            isStacked: true }
        );

        equal(series.points[0].options.stackBase, 2);

        CATEGORY_AXIS_Y = 2;
    });

    test("stack base is set to zero value slot when category axis is moved to bottom (positive series first)", function() {
        CATEGORY_AXIS_Y = 4;

        setupBarChart(plotArea, {
            series: [ positiveSeries, negativeSeries ],
            isStacked: true }
        );

        equal(series.points[0].options.stackBase, 2);

        CATEGORY_AXIS_Y = 2;
    });

    test("stack base is set to zero value slot when category axis is moved to top (negative series first)", function() {
        CATEGORY_AXIS_Y = 0;

        setupBarChart(plotArea, {
            series: [ negativeSeries, positiveSeries ],
            isStacked: true }
        );

        equal(series.points[0].options.stackBase, 2);

        CATEGORY_AXIS_Y = 2;
    });

    test("stack base is set to zero value slot when category axis is moved to top (positive series first)", function() {
        CATEGORY_AXIS_Y = 0;

        setupBarChart(plotArea, {
            series: [ positiveSeries, negativeSeries ],
            isStacked: true }
        );

        equal(series.points[0].options.stackBase, 2);

        CATEGORY_AXIS_Y = 2;
    });

    // ------------------------------------------------------------
    module("Bar Chart / Stack / Mixed Series", {
        setup: function() {
            plotArea.namedValueAxes.a = plotArea.valueAxis;
            plotArea.namedValueAxes.b = plotArea.valueAxis;

            setupBarChart(plotArea, {
                series: [
                    // Both series should be on the same axis.
                    // This rule is intentionally broken for the tests.
                    $.extend({ axis: "a" }, positiveSeries),
                    $.extend({ axis: "b" }, negativeSeries)
                ],
                isStacked: true
            });
        }
    });

    test("reports stacked minumum value for default axis", function() {
        equal(series.valueAxisRanges.a.min, -2);
    });

    test("reports stacked maximum value for default axis", function() {
        equal(series.valueAxisRanges.a.max, 2);
    });

    test("bars have set height according to value", function() {
        var barHeights = $.map(series.points, function(bar) {
            return bar.box.height();
        });

        deepEqual(barHeights, [1, 1, 2, 2]);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Grouped Stack / Positive Values", {
        setup: function() {
            setupBarChart(plotArea, {
                series: [
                    $.extend({ stack: "a" }, positiveSeries),
                    $.extend({ stack: "a" }, positiveSeries),
                    $.extend({ stack: "b" }, positiveSeries),
                    $.extend({ stack: "b" }, positiveSeries)
                ],
                isStacked: true
            });
        }
    });

    test("reports 0 as minumum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].min, 0);
    });

    test("reports stacked maximum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].max, 4);
    });

    test("bars in first category, first group are stacked", function() {
        equal(series.points[1].box.y2, series.points[0].box.y1);
    });

    test("bars in first category, second group are stacked", function() {
        equal(series.points[3].box.y2, series.points[2].box.y1);
    });

    test("bars in first category, second group are in separate stack", function() {
        ok(series.points[2].box.y2 != series.points[1].box.y1);
    });

    test("stack base is set to zero value slot", function() {
        equal(series.points[0].options.stackBase, 2);
        equal(series.points[2].options.stackBase, 2);
    });

    test("groups with no stack are assigned to first stack", function() {
        setupBarChart(plotArea, {
            series: [
                $.extend(true, { stack: "a" }, positiveSeries),
                positiveSeries
            ],
            isStacked: true
        });

        equal(series.valueAxisRanges[undefined].max, 4);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Grouped Stack / Negative Values", {
        setup: function() {
            setupBarChart(plotArea, {
                series: [
                    $.extend({ stack: "a" }, negativeSeries),
                    $.extend({ stack: "a" }, negativeSeries),
                    $.extend({ stack: "b" }, negativeSeries),
                    $.extend({ stack: "b" }, negativeSeries)
                ],
                isStacked: true
            });
        }
    });

    test("reports stacked minumum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].min, -4);
    });

    test("reports 0 as maximum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].max, 0);
    });

    test("bars in first category, first group are stacked", function() {
        equal(series.points[1].box.y1, series.points[0].box.y2);
    });

    test("bars in first category, second group are stacked", function() {
        equal(series.points[3].box.y1, series.points[2].box.y2);
    });

    test("bars in first category, second group are in separate stack", function() {
        ok(series.points[2].box.y1 != series.points[1].box.y2);
    });

    test("stack base is set to zero value slot", function() {
        equal(series.points[0].options.stackBase, 2);
        equal(series.points[2].options.stackBase, 2);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Grouped Stack / Mixed Values", {
        setup: function() {
            setupBarChart(plotArea, {
                series: [
                    $.extend({ stack: "a" }, positiveSeries),
                    $.extend({ stack: "a" }, positiveSeries),
                    $.extend({ stack: "b" }, negativeSeries),
                    $.extend({ stack: "b" }, negativeSeries)
                ],
                isStacked: true
            });
        }
    });

    test("reports stacked minumum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].min, -4);
    });

    test("reports stacked maximum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].max, 4);
    });

    test("bars in first category, first group are stacked", function() {
        equal(series.points[1].box.y2, series.points[0].box.y1);
    });

    test("bars in first category, second group are stacked", function() {
        equal(series.points[3].box.y1, series.points[2].box.y2);
    });

    test("bars in first category, second group are in separate stack", function() {
        ok(series.points[2].box.y1 != series.points[1].box.y2);
    });

    test("bars in second category, first group are stacked", function() {
        equal(series.points[5].box.y2, series.points[4].box.y1);
    });

    test("bars in second category, second group are stacked", function() {
        equal(series.points[7].box.y1, series.points[6].box.y2);
    });

    test("stack base is set to zero value slot", function() {
        equal(series.points[0].options.stackBase, 2);
        equal(series.points[2].options.stackBase, 2);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Grouped Stack / Mixed Values / Reversed Axes", {
        setup: function() {
            plotArea.valueAxis.options.reverse = true;
            setupBarChart(plotArea, {
                series: [
                    $.extend({ stack: "a" }, positiveSeries),
                    $.extend({ stack: "a" }, positiveSeries),
                    $.extend({ stack: "b" }, negativeSeries),
                    $.extend({ stack: "b" }, negativeSeries)
                ],
                isStacked: true
            });
            plotArea.valueAxis.options.reverse = false;
        }
    });

    test("bars in first category, first group are stacked", function() {
        equal(series.points[1].box.y1, series.points[0].box.y2);
    });

    test("bars in first category, second group are stacked", function() {
        equal(series.points[3].box.y2, series.points[2].box.y1);
    });

    test("bars in second category, first group are stacked", function() {
        equal(series.points[5].box.y1, series.points[4].box.y2);
    });

    test("bars in second category, second group are stacked", function() {
        equal(series.points[7].box.y2, series.points[6].box.y1);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Stacked / Panes");

    test("bars in different panes are not stacked", function() {
        var chart = createChart({
            series: [{
                stack: true,
                type: "column",
                data: [1]
            }, {
                type: "column",
                data: [2],
                axis: "b"
            }],
            panes: [{
                name: "top"
            }, {
                name: "bottom"
            }],
            valueAxis: [{
            }, {
                name: "b",
                pane: "bottom"
            }],
            categoryAxis: {
                categories: ["A"]
            }
        });

        var barCharts = chart._model._plotArea.charts;
        notClose(barCharts[0].points[0].box.y1, barCharts[1].points[0].box.y2, TOLERANCE);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    var positiveData = [100, 150],
        negativeData = [-100, -150],
        VALUE_AXIS_MAX = 200,
        CATEGORY_AXIS_Y = 200,
        TOLERANCE = 0.1,
        MARGIN = 10,
        PADDING = 10,
        COLOR = "red",
        BACKGROUND = "blue",
        BORDER = {
            width: 4,
            color: "green",
            dashType: "dot"
        };

    function stubPlotArea(getCategorySlot, getValueSlot, options) {
        return new function() {
            this.categoryAxis = this.primaryCategoryAxis = {
                getSlot: getCategorySlot,
                options: {
                    axisCrossingValue: 0,
                    categories: options.categoryAxis.categories
                }
            };

            this.valueAxis = {
                getSlot: getValueSlot,
                options: {
                    axisCrossingValue: 0
                }
            };

            this.namedCategoryAxes = { };
            this.namedValueAxes = {};

            this.seriesCategoryAxis = function(series) {
                return series.categoryAxis ?
                    this.namedCategoryAxes[series.categoryAxis] : this.primaryCategoryAxis;
            };

            this.options = options;
        };
    }

    var plotArea = stubPlotArea(
        function(categoryIndex) {
            return new Box2D(categoryIndex, CATEGORY_AXIS_Y,
                             categoryIndex + 100, CATEGORY_AXIS_Y);
        },
        function(value) {
            var value = typeof value === "undefined" ? 0 : value,
                valueY = VALUE_AXIS_MAX - value,
                slotTop = Math.min(CATEGORY_AXIS_Y, valueY),
                slotBottom = Math.max(CATEGORY_AXIS_Y, valueY);

            return new Box2D(0, slotTop, 0, slotBottom);
        },
        {
            categoryAxis: {}
        }
    );

    function setupBarChart(plotArea, options) {
        view = new ViewStub();

        options.gap = 1.5;
        series = new dataviz.BarChart(plotArea, options);
        series.reflow();
    }

    // ------------------------------------------------------------
    module("Column Chart / Labels", {
        setup: function() {
            setupBarChart(plotArea, { series: [{
                data: [10, 0, null],
                labels: { visible: true }
            }] });
        }
    });

    test("creates labels for 0 values", 1, function() {
        equal(series.points[1].label.children[0].children[0].content, "0");
    });

    test("creates empty labels for null values", 1, function() {
        equal(series.points[2].label.children[0].children[0].content, "");
    });

    // ------------------------------------------------------------
    module("Column Chart / Labels / Positive Values", {
        setup: function() {
            setupBarChart(plotArea, { series: [{
                data: positiveData,
                labels: { position: "insideEnd", visible: true }
            }] });
        }
    });

    test("insideEnd position", function() {
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(this.box.y1, text.box.y1);
            ok(this.box.x1 > text.box.x1 && this.box.x2 < text.box.x2);
        });
    });

    test("insideBase position", function() {
        setupBarChart(plotArea, { series: [{
            data: positiveData,
            labels: {
                position: "insideBase",
                visible: true
            }
        }] });
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(this.box.y2, text.box.y2);
            ok(this.box.x1 > text.box.x1 && this.box.x2 < text.box.x2);
        });
    });

    test("outsideEnd position", function() {
        setupBarChart(plotArea, { series: [{
            data: positiveData,
            labels: {
                position: "outsideEnd",
                visible: true
            }
        }] });
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(this.box.y1 - text.box.height(), text.box.y1);
            ok(this.box.x1 > text.box.x1 && this.box.x2 < text.box.x2);
        });
    });

    test("center position", function() {
        setupBarChart(plotArea, { series: [{
            data: positiveData,
            labels: {
                position: "center",
                visible: true
            }
        }] });
        $.each(series.points, function() {
            var text = this.children[0].children[0],
                margin = (this.box.height() - text.box.height()) / 2;
            equal(this.box.y1 + margin, text.box.y1);
            ok(this.box.x1 > text.box.x1 && this.box.x2 < text.box.x2);
        });
    });

    test("creates labels with full format", 1, function() {
        setupBarChart(plotArea, { series: [{
            data: positiveData,
            labels: {
                format: "{0:C}",
                visible: true
            }
        }] });

        deepEqual($.map(series.points, function(bar) {
            return bar.children[0].children[0].children[0].content }
        ), ["$100.00", "$150.00"]);
    });

    test("creates labels with simple format", 1, function() {
        setupBarChart(plotArea, { series: [{
            data: positiveData,
            labels: {
                format: "C",
                visible: true
            }
        }] });

        deepEqual($.map(series.points, function(bar) {
            return bar.children[0].children[0].children[0].content }
        ), ["$100.00", "$150.00"]);
    });

    test("width equals bar width", function() {
        $.each(series.points, function() {
            var label = this.children[0].children[0];
            equal(label.paddingBox.width(), this.box.width(), 0.1);
        });
    });

    test("labels have zIndex", function() {
        equal(series.points[0].children[0].children[0].options.zIndex, 1);
    });

    // ------------------------------------------------------------
    module("Column Chart / Labels / Negative Values", {
        setup: function() {
            setupBarChart(plotArea, { series: [{
                data: negativeData,
                labels: { position: "insideEnd", visible: true }
                }] });
            }
    });

    test("insideEnd position", function() {
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(this.box.y2, text.box.y2);
            ok(this.box.x1 > text.box.x1 && this.box.x2 < text.box.x2);
        });
    });

    test("insideBase position", function() {
        setupBarChart(plotArea, { series: [{
            data: negativeData,
                labels: {
                position: "insideBase",
                visible: true
            }
        }] });
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(this.box.y1, text.box.y1);
            ok(this.box.x1 > text.box.x1 && this.box.x2 < text.box.x2);
        });
    });

    test("outsideEnd position", function() {
        setupBarChart(plotArea, { series: [{
            data: negativeData,
            labels: {
                position: "outsideEnd",
                visible: true
            }
        }] });
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(this.box.y2, text.box.y1);
            ok(this.box.x1 > text.box.x1 && this.box.x2 < text.box.x2);
        });
    });

    test("center position", function() {
        setupBarChart(plotArea, { series: [{
            data: negativeData,
            labels: {
                position: "center",
                visible: true
            }
        }] });
        $.each(series.points, function() {
            var text = this.children[0].children[0],
                margin = (this.box.height() - text.box.height()) / 2;
            equal(this.box.y1 + margin, text.box.y1);
            ok(this.box.x1 > text.box.x1 && this.box.x2 < text.box.x2);
        });
    });

    test("format", 1, function() {
        setupBarChart(plotArea, { series: [{
            data: positiveData,
            labels: {
                format: "{0:C}",
                visible: true
            }
        }] });

        deepEqual($.map(series.points, function(bar) {
            return bar.children[0].children[0].children[0].content }
        ), ["$100.00", "$150.00"]);
    });

    // ------------------------------------------------------------
    module("Column Chart / Labels / Rendering");

    test("color", function() {
        setupBarChart(plotArea, { series: [{
            data: [ 100 ],
            labels: {
                color: COLOR,
                visible: true
            }
        }] });
        series.getViewElements(view);
        equal(view.log.text[0].style.color, COLOR);
    });

    test("background color", function() {
        setupBarChart(plotArea, { series: [{
            data: [ 100 ],
            labels: {
                background: BACKGROUND,
                visible: true
            }
        }] });
        series.getViewElements(view);
        equal(view.log.rect[1].style.fill, BACKGROUND);
    });

    test("border", function() {
        setupBarChart(plotArea, { series: [{
            data: [ 100 ],
            labels: {
                border: BORDER,
                visible: true
            }
        }] });
        series.getViewElements(view);
        equal(view.log.rect[1].style.stroke, BORDER.color);
        equal(view.log.rect[1].style.strokeWidth, BORDER.width);
        equal(view.log.rect[1].style.dashType, BORDER.dashType);
    });

    test("padding and margin", function() {
        setupBarChart(plotArea, { series: [{
            data: [ 100 ],
            labels: {
                margin: MARGIN,
                border: { width: 0 },
                visible: true
            }
        }] });
        series.getViewElements(view);
        var barLabel = series.points[0].children[0].children[0],
            paddingBox = barLabel.paddingBox,
            box = barLabel.box;

        equal(paddingBox.x1 - MARGIN, box.x1);
        equal(paddingBox.x2 + MARGIN, box.x2);
        equal(paddingBox.y1 - MARGIN, box.y1);
        equal(paddingBox.y2 + MARGIN, box.y2);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    function stubPlotArea(getCategorySlot, getValueSlot, options) {
        return new function() {
            this.categoryAxis = this.primaryCategoryAxis = {
                getSlot: getCategorySlot,
                options: {
                    axisCrossingValue: 0,
                    categories: options.categoryAxis.categories
                }
            };

            this.valueAxis = {
                getSlot: getValueSlot,
                options: {
                    axisCrossingValue: 0
                }
            };

            this.namedCategoryAxes = { };
            this.namedValueAxes = {};

            this.seriesCategoryAxis = function(series) {
                return series.categoryAxis ?
                    this.namedCategoryAxes[series.categoryAxis] : this.primaryCategoryAxis;
            };

            this.options = options;
        };
    }

    function setupBarChart(plotArea, options) {
        view = new ViewStub();

        options.gap = 1.5;
        series = new dataviz.BarChart(plotArea, options);
        series.reflow();
    }

    var positiveData = [100, 150],
        negativeData = [-100, -150],
        VALUE_AXIS_MAX = 200,
        CATEGORY_AXIS_X = 200,
        TOLERANCE = 0.1;

    var plotArea = stubPlotArea(
        function(categoryIndex) {
            return new Box2D(CATEGORY_AXIS_X, categoryIndex,
                             CATEGORY_AXIS_X, categoryIndex + 1);
        },
        function(value) {
            var valueX = CATEGORY_AXIS_X + value,
                slotLeft = Math.min(CATEGORY_AXIS_X, valueX),
                slotRight = Math.max(CATEGORY_AXIS_X, valueX);

            return new Box2D(slotLeft, 0, slotRight, 0);
        },
        {
            categoryAxis: {}
        }
    );

    // ------------------------------------------------------------
    module("Bar Chart / Labels / Positive Values", {
        setup: function() {
            view = new ViewStub();
            setupBarChart(plotArea, { series: [{
                data: positiveData,
                labels: {
                    visible: true
                }
            }], invertAxes: true });
        }
    });

    test("insideEnd position", function() {
        setupBarChart(plotArea, { series: [{
            data: positiveData,
            labels: {
                visible: true,
                position: "insideEnd"
            }
        }], invertAxes: true });

        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(text.box.x1, this.box.x2 - text.box.width());
            ok(this.box.y1 > text.box.y1 && this.box.y2 < text.box.y2);
        });
    });

    test("insideBase position", function() {
        setupBarChart(plotArea, { series: [{
            data: positiveData,
            labels: {
                position: "insideBase",
                visible: true
            }
        }], invertAxes: true });
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(text.box.x1, this.box.x1);
            ok(this.box.y1 > text.box.y1 && this.box.y2 < text.box.y2);
        });
    });

    test("outsideEnd position", function() {
        setupBarChart(plotArea, { series: [{
            data: positiveData,
            labels: {
                position: "outsideEnd",
                visible: true
            }
        }], invertAxes: true });
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(this.box.x2, text.box.x1);
            ok(this.box.y1 > text.box.y1 && this.box.y2 < text.box.y2);
        });
    });

    test("center position", function() {
        setupBarChart(plotArea, { series: [{
            data: positiveData,
            labels: {
                position: "center",
                visible: true
            }
        }], invertAxes: true });
        $.each(series.points, function() {
            var text = this.children[0].children[0],
            margin = (this.box.width() - text.box.width()) / 2;
            equal(this.box.x1 + margin, text.box.x1);
            ok(this.box.y1 > text.box.y1 && this.box.y2 < text.box.y2);
        });
    });

    test("height equals bar height", function() {
        $.each(series.points, function() {
            var label = this.children[0].children[0];
            close(label.paddingBox.height(), this.box.height(), 0.1);
        });
    });

    // ------------------------------------------------------------
    module("Bar Chart / Labels / Negative Values", {
        setup: function() {
            view = new ViewStub();
            setupBarChart(plotArea, { series: [{
                data: negativeData,
                labels: {
                    visible: true,
                    position: "insideEnd"
                }
            }], invertAxes: true });
        }
    });

    test("insideEnd position", function() {
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(this.box.x1, text.box.x1);
            ok(this.box.y1 > text.box.y1 && this.box.y2 < text.box.y2);
        });
    });

    test("insideBase position", function() {
        setupBarChart(plotArea, { series: [{
            data: negativeData,
            labels: {
                position: "insideBase",
                visible: true
            }
        }], invertAxes: true });
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(this.box.x2 - text.box.width(), text.box.x1);
            ok(this.box.y1 > text.box.y1 && this.box.y2 < text.box.y2);
        });
    });

    test("outsideEnd position", function() {
        setupBarChart(plotArea, { series: [{
            data: negativeData,
            labels: {
                position: "outsideEnd",
                visible: true
            }
        }], invertAxes: true });
        $.each(series.points, function() {
            var text = this.children[0].children[0];
            equal(this.box.x1 - text.box.width(), text.box.x1);
            ok(this.box.y1 > text.box.y1 && this.box.y2 < text.box.y2);
        });
    });

    test("center position", function() {
        setupBarChart(plotArea, { series: [{
            data: negativeData,
            labels: {
                position: "center",
                visible: true
            }
        }], invertAxes: true });
        $.each(series.points, function() {
            var text = this.children[0].children[0],
                margin = (this.box.height() - text.box.height()) / 2;
            equal(this.box.y1 + margin, text.box.y1);
            ok(this.box.y1 > text.box.y1 && this.box.y2 < text.box.y2);
        });
    });
})();

(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    function stubPlotArea(getCategorySlot, getValueSlot, options) {
        return new function() {
            this.categoryAxis = this.primaryCategoryAxis = {
                getSlot: getCategorySlot,
                options: {
                    axisCrossingValue: 0,
                    categories: options.categoryAxis.categories
                }
            };

            this.valueAxis = {
                getSlot: getValueSlot,
                options: {
                    axisCrossingValue: 0
                }
            };

            this.namedCategoryAxes = { };
            this.namedValueAxes = {};

            this.seriesCategoryAxis = function(series) {
                return series.categoryAxis ?
                    this.namedCategoryAxes[series.categoryAxis] : this.primaryCategoryAxis;
            };

            this.options = options;
        };
    }

    var positiveSeries = { data: [1, 2], labels: {} },
        negativeSeries = { data: [-1, -2], labels: {} },
        CATEGORY_AXIS_X = 2,
        TOLERANCE = 0.1;

    var plotArea = stubPlotArea(
        function(categoryIndex) {
            return new Box2D(CATEGORY_AXIS_X, categoryIndex,
                           CATEGORY_AXIS_X, categoryIndex + 1);
        },
        function(value) {
            var valueX = CATEGORY_AXIS_X + value,
                slotLeft = Math.min(CATEGORY_AXIS_X, valueX),
                slotRight = Math.max(CATEGORY_AXIS_X, valueX);

            return new Box2D(slotLeft, 0, slotRight, 0);
        },
        {
            categoryAxis: {}
        }
    );

    function setupBarChart(plotArea, options) {
        view = new ViewStub();

        options.gap = 1.5;
        series = new dataviz.BarChart(plotArea, options);
        series.reflow();
    }

    // ------------------------------------------------------------
    module("Bar Chart / Horizontal / Positive Values", {
        setup: function() {
            setupBarChart(plotArea, { invertAxes: true, series: [ positiveSeries ] });
        }
    });

    test("bars are distributed across category axis", function() {
        var barsY = $.map(series.points, function(bar) {
            return bar.box.y1;
        });

        arrayClose(barsY, [0.3, 1.3], TOLERANCE);
    });

    test("bar sides are aligned to category axis", function() {
        var barsX = $.map(series.points, function(bar) {
            return bar.box.x1;
        });

        deepEqual(barsX, [CATEGORY_AXIS_X, CATEGORY_AXIS_X]);
    });

    test("bars have set height", function() {
        $.each(series.points, function() {
            close(this.box.height(), 0.4, TOLERANCE);
        });
    });

    test("bars have set width according to value", function() {
        var barWidths = $.map(series.points, function(bar) {
            return bar.box.width();
        });

        deepEqual(barWidths, [1, 2]);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Horizontal / Negative Values", {
        setup: function() {
            setupBarChart(plotArea, { invertAxes: true, series: [ negativeSeries ] });
        }
    });

    test("Reports minimum value for default axis", function() {
        deepEqual(series.valueAxisRanges[undefined].min, negativeSeries.data[1]);
    });

    test("Reports maximum value for default axis", function() {
        deepEqual(series.valueAxisRanges[undefined].max, negativeSeries.data[0]);
    });

    test("bar sides are aligned to category axis", function() {
        var barsX = $.map(series.points, function(bar) {
            return bar.box.x2;
        });

        deepEqual(barsX, [CATEGORY_AXIS_X, CATEGORY_AXIS_X]);
    });

    test("bars have set width according to value", function() {
        var barWidths = $.map(series.points, function(bar) {
            return bar.box.width();
        });

        deepEqual(barWidths, [1, 2]);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Horizontal / Missing values", {
        setup: function() {
            setupBarChart(plotArea, {
                invertAxes: true,
                series: [ { data: [1, 2, 3] },
                          positiveSeries
                    ]
            });
        }
    });

    test("Missing values are represented as bars with zero width", function() {
        var barWidths = $.map(series.points, function(bar) {
            return bar.box.width();
        });

        deepEqual(barWidths, [1, 1, 2, 2, 3, 0]);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Horizontal / Cluster", {
        setup: function() {
            setupBarChart(plotArea,
                { invertAxes: true,
                  series: [ positiveSeries, negativeSeries ]
                }
            );
        }
    });

    test("bars in first category are clustered", function() {
        equal(series.points[0].box.y2, series.points[1].box.y1);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Horizontal / Stack / Positive Values", {
        setup: function() {
            setupBarChart(plotArea, {
                invertAxes: true,
                series: [ positiveSeries, positiveSeries ],
                isStacked: true }
            );
        }
    });

    test("reports 0 as minumum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].min, 0);
    });

    test("reports stacked maximum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].max, 4);
    });

    test("bars in first category are stacked", function() {
        equal(series.points[1].box.x1, series.points[0].box.x2);
    });

    test("bars have set width according to value", function() {
        var barWidths = $.map(series.points, function(bar) {
            return bar.box.width();
        });

        deepEqual(barWidths, [1, 1, 2, 2]);
    });

    test("series have 75% margin", function() {
        close(series.points[0].box.y1, 0.3, TOLERANCE);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Horizontal / Stack / Negative Values", {
        setup: function() {
            setupBarChart(plotArea, {
                invertAxes: true,
                series: [ negativeSeries, negativeSeries ],
                isStacked: true }
            );
        }
    });

    test("reports stacked minumum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].min, -4);
    });

    test("reports 0 as maximum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].max, 0);
    });

    test("bars in first category are stacked", function() {
        equal(series.points[1].box.x2, series.points[0].box.x1);
    });

    test("stack sides are aligned to category axis", function() {
        deepEqual([series.points[0].box.x2, series.points[2].box.x2],
             [CATEGORY_AXIS_X, CATEGORY_AXIS_X]);
    });

    test("bars have set width according to value", function() {
        var barWidths = $.map(series.points, function(bar) {
            return bar.box.width();
        });

        deepEqual(barWidths, [1, 1, 2, 2]);
    });

    // ------------------------------------------------------------
    module("Bar Chart / Horizontal / Stack / Mixed Values", {
        setup: function() {
            setupBarChart(plotArea, {
                invertAxes: true,
                series: [ positiveSeries, negativeSeries ],
                isStacked: true }
            );
        }
    });

    test("reports stacked minumum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].min, -2);
    });

    test("reports stacked maximum value for default axis", function() {
        equal(series.valueAxisRanges[undefined].max, 2);
    });

    test("bars have set width according to value", function() {
        var barWidths = $.map(series.points, function(bar) {
            return bar.box.width();
        });

        deepEqual(barWidths, [1, 1, 2, 2]);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    function stubPlotArea(getCategorySlot, getValueSlot, options) {
        return new function() {
            this.categoryAxis = this.primaryCategoryAxis = {
                getSlot: getCategorySlot,
                options: {
                    axisCrossingValue: 0,
                    categories: options.categoryAxis.categories
                }
            };

            this.valueAxis = {
                getSlot: getValueSlot,
                options: {
                    axisCrossingValue: 0
                }
            };

            this.namedCategoryAxes = { };
            this.namedValueAxes = {};

            this.seriesCategoryAxis = function(series) {
                return series.categoryAxis ?
                    this.namedCategoryAxes[series.categoryAxis] : this.primaryCategoryAxis;
            };

            this.options = options;
        };
    }

    var barChart;

    var plotArea = stubPlotArea(
        function(categoryIndex) {
            return new Box2D();
        },
        function(value) {
            return new Box2D();
        },
        {
            categoryAxis: {
                categories: ["A"]
            }
        }
    );

    // ------------------------------------------------------------
    module("Bar Chart / Configuration", {
        setup: function() {
            barChart = new dataviz.BarChart(plotArea, {
                series: [{
                    data: [0, -1],
                    color: "#f00",
                    negativeColor: "#00f",
                    opacity: 0.5,
                    overlay: "none"
                }]
            });
        }
    });

    test("applies series fill color to bars", function() {
        equal(barChart.points[0].options.color, "#f00");
    });

    test("applies series negative fill color to negative bars", function() {
        equal(barChart.points[1].options.color, "#00f");
    });

    test("applies series opacity color to bars", function() {
        equal(barChart.points[0].options.opacity, 0.5);
    });

    test("applies series overlay to bars", function() {
        equal(barChart.points[0].options.overlay, "none");
    });

    test("applies color function", function() {
        barChart = new dataviz.BarChart(plotArea, {
            series: [{
                data: [0, 1],
                color: function(bar) { return "#f00" }
            }]
        });

        equal(barChart.points[0].options.color, "#f00");
    });

    test("color fn argument contains value", 1, function() {
        new dataviz.BarChart(plotArea, {
            series: [{
                data: [1],
                color: function(bar) { equal(bar.value, 1); }
            }]
        });
    });

    test("color fn argument contains series", 1, function() {
        new dataviz.BarChart(plotArea, {
            series: [{
                name: "series 1",
                data: [1],
                color: function(bar) { equal(bar.series.name, "series 1"); }
            }]
        });
    });

    test("color fn argument contains index", 1, function() {
        new dataviz.BarChart(plotArea, {
            series: [{
                name: "series 1",
                data: [1],
                color: function(bar) { equal(bar.index, 0); }
            }]
        });
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    function BarStub(box) {
        this.box = box;
    }

    BarStub.prototype = {
        reflow: function(box) {
            this.box = box;
        }
    };

    var cluster,
        bars,
        clusterBox = new Box2D(0, 0, 350, 350),
        barBox = new Box2D(1, 1, 1, 1),
        TOLERANCE = 0.1;

    function createCluster(options) {
        cluster = new dataviz.ClusterLayout(options);
        bars = [ new BarStub(barBox), new BarStub(barBox) ];
        [].push.apply(cluster.children, bars);
        cluster.reflow(clusterBox);
    }

    // ------------------------------------------------------------
    module("Cluster Layout / Horizontal", {
        setup: function() {
            createCluster({ gap: 0 });
        }
    });

    test("distributes width evenly", function() {
        $.each(bars, function() {
            equal(this.box.width(), clusterBox.width() / bars.length)
        });
    });

    test("positions children next to each other", function() {
        $.each(bars, function(index) {
            equal(this.box.x1, this.box.width() * index)
        });
    });

    test("leaves 75% gap on both sides", function() {
        createCluster({ gap: 1.5 });

        equal(bars[0].box.x1, 75);
        equal(bars[1].box.x2, 275);
    });

    test("positions children next to each other with spacing", function() {
        createCluster({ gap: 0, spacing: 1 });
        $.each(bars, function(index) {
            close(this.box.x1, (this.box.width() * 2) * index, TOLERANCE)
        });
    });

    // ------------------------------------------------------------
    module("Cluster Layout / Vertical", {
        setup: function() {
            createCluster({ vertical: true, gap: 0 });
        }
    });

    test("distributes height evenly", function() {
        $.each(bars, function() {
            equal(this.box.height(), clusterBox.height() / bars.length)
        });
    });

    test("positions children below each other", function() {
        $.each(bars, function(index) {
            equal(this.box.y1, this.box.height() * index)
        });
    });

    test("positions children next to each other with spacing", function() {
        createCluster({ vertical: true, gap: 0, spacing: 1 });
        $.each(bars, function(index) {
            close(this.box.y1, (this.box.height() * 2) * index, TOLERANCE)
        });
    });
})();

(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    function BarStub(box) {
        this.box = box;
    }

    BarStub.prototype = {
        reflow: function(box) {
            this.box = box;
        }
    };

    var stack,
        stackBox = new Box2D(50, 50, 100, 100);

    // ------------------------------------------------------------
    module("Stack Layout / Vertical", {
        setup: function() {
            stack = new dataviz.StackLayout();

            stack.children.push(
                new BarStub(new Box2D(0, 90, 100, 100)),
                new BarStub(new Box2D(0, 80, 100, 100)),
                new BarStub(new Box2D(0, 70, 100, 100))
            );

            stack.reflow(stackBox);
        }
    });

    test("first bar remains at its position", function() {
        equal(stack.children[0].box.y1, 90);
    });

    test("first bar height is not changed", function() {
        equal(stack.children[0].box.height(), 10);
    });

    test("second bar is placed on top of the first", function() {
        equal(stack.children[1].box.y2, stack.children[0].box.y1);
    });

    test("second bar height is not changed", function() {
        equal(stack.children[1].box.height(), 20);
    });

    test("third bar is placed on top of the second", function() {
        equal(stack.children[2].box.y2, stack.children[1].box.y1);
    });

    test("third bar height is not changed", function() {
        equal(stack.children[2].box.height(), 30);
    });

    test("reports final box after layout", function() {
        deepEqual([stack.box.x1, stack.box.y1, stack.box.x2, stack.box.y2],
             [50, 40, 100, 100]);
    });

    test("updates children width to fit box", function() {
        equal(stack.children[0].box.width(), stackBox.width());
        equal(stack.children[1].box.width(), stackBox.width());
    });

    test("updates children X position to match targetBox", function() {
        equal(stack.children[0].box.x1, stackBox.x1);
        equal(stack.children[1].box.x1, stackBox.x1);
    });

    // ------------------------------------------------------------
    module("Stack Layout / Vertical / Reversed", {
        setup: function() {
            stack = new dataviz.StackLayout({ isReversed: true });

            stack.children.push(
                new BarStub(new Box2D(0, 90, 100, 100)),
                new BarStub(new Box2D(0, 80, 100, 100)),
                new BarStub(new Box2D(0, 70, 100, 100))
            );

            stack.reflow(stackBox);
        }
    });

    test("first bar remains at its position", function() {
        equal(stack.children[0].box.y1, 90);
    });

    test("first bar height is not changed", function() {
        equal(stack.children[0].box.height(), 10);
    });

    test("second bar is placed below the first", function() {
        equal(stack.children[1].box.y1, stack.children[0].box.y2);
    });

    test("second bar height is not changed", function() {
        equal(stack.children[1].box.height(), 20);
    });

    test("third bar is placed below the second", function() {
        equal(stack.children[2].box.y1, stack.children[1].box.y2);
    });

    test("third bar height is not changed", function() {
        equal(stack.children[2].box.height(), 30);
    });

    test("reports final box after layout", function() {
        deepEqual([stack.box.x1, stack.box.y1, stack.box.x2, stack.box.y2],
             [50, 90, 100, 150]);
    });

    test("updates children width to fit box", function() {
        equal(stack.children[0].box.width(), stackBox.width());
        equal(stack.children[1].box.width(), stackBox.width());
    });

    test("updates children X position to match targetBox", function() {
        equal(stack.children[0].box.x1, stackBox.x1);
        equal(stack.children[1].box.x1, stackBox.x1);
    });

    // ------------------------------------------------------------
    module("Stack Layout / Horizontal", {
        setup: function() {
            stack = new dataviz.StackLayout({ vertical: false });
            stack.children.push(
                new BarStub(new Box2D(0, 0, 20, 10)),
                new BarStub(new Box2D(0, 0, 30, 10)),
                new BarStub(new Box2D(0, 0, 40, 10))
            );

            stack.reflow(stackBox);
        }
    });

    test("first bar remains at its position", function() {
        equal(stack.children[0].box.x1, 0);
    });

    test("first bar width is not changed", function() {
        equal(stack.children[0].box.width(), 20);
    });

    test("second bar is placed to the right of the first", function() {
        equal(stack.children[1].box.x1, stack.children[0].box.x2);
    });

    test("second bar width is not changed", function() {
        equal(stack.children[1].box.width(), 30);
    });

    test("third bar is placed to the right of the second", function() {
        equal(stack.children[2].box.x1, stack.children[1].box.x2);
    });

    test("third bar width is not changed", function() {
        equal(stack.children[2].box.width(), 40);
    });

    test("reports final box after layout", function() {
        deepEqual([stack.box.x1, stack.box.y1, stack.box.x2, stack.box.y2],
             [0, 50, 90, 100]);
    });

    test("updates children height to fit box", function() {
        equal(stack.children[0].box.height(), stackBox.height());
        equal(stack.children[1].box.height(), stackBox.height());
    });

    test("updates children Y position to match targetBox", function() {
        equal(stack.children[0].box.y1, stackBox.y1);
        equal(stack.children[1].box.y1, stackBox.y1);
    });

    // ------------------------------------------------------------
    module("Stack Layout / Horizontal / Reversed", {
        setup: function() {
            stack = new dataviz.StackLayout({ vertical: false, isReversed: true });
            stack.children.push(
                new BarStub(new Box2D(100, 0, 120, 10)),
                new BarStub(new Box2D(100, 0, 130, 10)),
                new BarStub(new Box2D(100, 0, 140, 10))
            );

            stack.reflow(stackBox);
        }
    });

    test("first bar remains at its position", function() {
        equal(stack.children[0].box.x1, 100);
    });

    test("first bar width is not changed", function() {
        equal(stack.children[0].box.width(), 20);
    });

    test("second bar is placed to the left of the first", function() {
        equal(stack.children[1].box.x2, stack.children[0].box.x1);
    });

    test("second bar width is not changed", function() {
        equal(stack.children[1].box.width(), 30);
    });

    test("third bar is placed to the left of the second", function() {
        equal(stack.children[2].box.x2, stack.children[1].box.x1);
    });

    test("third bar width is not changed", function() {
        equal(stack.children[2].box.width(), 40);
    });

    test("reports final box after layout", function() {
        deepEqual([stack.box.x1, stack.box.y1, stack.box.x2, stack.box.y2],
             [30, 50, 120, 100]);
    });

    test("updates children height to fit box", function() {
        equal(stack.children[0].box.height(), stackBox.height());
        equal(stack.children[1].box.height(), stackBox.height());
    });

    test("updates children Y position to match targetBox", function() {
        equal(stack.children[0].box.y1, stackBox.y1);
        equal(stack.children[1].box.y1, stackBox.y1);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    var Bar = dataviz.Bar,
        bar,
        label,
        box,
        rect,
        root,
        VALUE = 1,
        CATEGORY = "A",
        SERIES_NAME = "series",
        TOOLTIP_OFFSET = 5;

    function createBar(options) {
        box = new Box2D(0, 0, 100, 100);
        bar = new Bar(VALUE, options);

        bar.category = CATEGORY;
        bar.dataItem = { value: VALUE };
        bar.series = { name: SERIES_NAME };

        root = new dataviz.RootElement();
        root.append(bar);

        bar.reflow(box);
        label = bar.children[0];

        view = new ViewStub();
        bar.getViewElements(view);
        rect = view.log.rect[0];
    }

    // ------------------------------------------------------------
    module("Bar", {
        setup: function() {
            createBar();
        }
    });

    test("sets value", function() {
        equal(bar.value, VALUE);
    });

    test("fills target box", function() {
        sameBox(bar.box, box);
    });

    test("renders rectangle", function() {
        sameBox(rect, box);
    });

    test("does not render rectangle when box height is zero", function() {
        bar.reflow(new Box2D(0, 0, 100, 0));

        view = new ViewStub();
        bar.getViewElements(view);

        equal(view.log.rect.length, 0);
    });

    test("does not render rectangle when box width is zero", function() {
        bar.reflow(new Box2D(0, 0, 0, 100));

        view = new ViewStub();
        bar.getViewElements(view);

        equal(view.log.rect.length, 0);
    });

    test("sets fill color", function() {
        deepEqual(rect.style.fill, bar.options.color);
    });

    test("sets vertical", function() {
        deepEqual(rect.style.vertical, true);
    });

    test("sets aboveAxis", function() {
        deepEqual(rect.style.aboveAxis, true);
    });

    test("sets overlay rotation for vertical bars", function() {
        deepEqual(rect.style.overlay.rotation, 0);
    });

    test("sets same overlay rotation for vertical bars below axis", function() {
        createBar({ aboveAxis: false });
        deepEqual(rect.style.overlay.rotation, 0);
    });

    test("does not set overlay options when no overlay is defined", function() {
        createBar({ overlay: null });
        ok(!rect.style.overlay);
    });

    test("sets default border color based on color", function() {
        createBar({ color: "#cf0" });
        equal(rect.style.stroke, "#a3cc00");
    });

    test("does not change border color if set", function() {
        createBar({ border: { color: "" } });
        equal(view.log.rect[0].style.stroke, "");
    });

    test("sets overlay rotation for horizontal bars", function() {
        createBar({ vertical: false });
        deepEqual(rect.style.overlay.rotation, 90);
    });

    test("sets same overlay rotation for horizontal bars below axis", function() {
        createBar({ vertical: false, aboveAxis: false });
        deepEqual(rect.style.overlay.rotation, 90);
    });

    test("sets stroke color", function() {
        createBar({ border: { color: "red", width: 1 } });
        deepEqual(rect.style.stroke, bar.options.border.color);
    });

    test("sets stroke width", function() {
        createBar({ border: { color: "red", width: 1 } });
        deepEqual(rect.style.strokeWidth, bar.options.border.width);
    });

    test("sets stroke dash type", function() {
        createBar({ border: { color: "red", width: 1, dashType: "dot" } });
        equal(rect.style.dashType, bar.options.border.dashType);
    });

    test("sets stroke opacity", function() {
        createBar({ border: { color: "red", width: 1, opacity: 0.5 } });
        equal(rect.style.strokeOpacity, bar.options.border.opacity);
    });

    test("sets fill opacity", function() {
        createBar({ opacity: 0.5 });
        deepEqual(rect.style.fillOpacity, bar.options.opacity);
    });

    test("sets stroke opacity", function() {
        createBar({ opacity: 0.5 });
        deepEqual(rect.style.strokeOpacity, bar.options.opacity);
    });

    test("is discoverable", function() {
        ok(bar.options.modelId);
    });

    test("sets id on rect", function() {
        ok(rect.style.id.length > 0);
    });

    test("highlightOverlay returns rect", function() {
        view = new ViewStub();

        bar.highlightOverlay(view);
        equal(view.log.rect.length, 1);
    });

    test("outline element has same model id", function() {
        view = new ViewStub();

        bar.highlightOverlay(view);
        equal(view.log.rect[0].style.data.modelId, bar.options.modelId);
    });

    test("label has same model id", function() {
        createBar({ labels: { visible: true } });
        equal(label.options.modelId, bar.options.modelId);
    });

    test("tooltipAnchor is top right corner / vertical / above axis",
    function() {
        createBar({ vertical: true, aboveAxis: true, isStacked: false });
        var anchor = bar.tooltipAnchor(10, 10);
        deepEqual([anchor.x, anchor.y], [bar.box.x2 + TOOLTIP_OFFSET, bar.box.y1])
    });

    test("tooltipAnchor is top right corner / vertical / above axis / stacked",
    function() {
        createBar({ vertical: true, aboveAxis: true, isStacked: true });
        var anchor = bar.tooltipAnchor(10, 10);
        deepEqual([anchor.x, anchor.y], [bar.box.x2 + TOOLTIP_OFFSET, bar.box.y1])
    });

    test("tooltipAnchor is bottom right corner / vertical / below axis",
    function() {
        createBar({ vertical: true, aboveAxis: false, isStacked: false });
        var anchor = bar.tooltipAnchor(10, 10);
        deepEqual([anchor.x, anchor.y], [bar.box.x2 + TOOLTIP_OFFSET, bar.box.y2 - 10])
    });

    test("tooltipAnchor is bottom right corner / vertical / below axis / stacked",
    function() {
        createBar({ vertical: true, aboveAxis: false, isStacked: true });
        var anchor = bar.tooltipAnchor(10, 10);
        deepEqual([anchor.x, anchor.y], [bar.box.x2 + TOOLTIP_OFFSET, bar.box.y2 - 10])
    });

    test("tooltipAnchor is top right corner / horizontal / above axis",
    function() {
        createBar({ vertical: false, aboveAxis: true, isStacked: false });
        var anchor = bar.tooltipAnchor(10, 10);
        deepEqual([anchor.x, anchor.y], [bar.box.x2 + TOOLTIP_OFFSET, bar.box.y1])
    });

    test("tooltipAnchor is above top right corner / horizontal / above axis / stacked",
    function() {
        createBar({ vertical: false, aboveAxis: true, isStacked: true });
        var anchor = bar.tooltipAnchor(10, 10);
        deepEqual([anchor.x, anchor.y], [bar.box.x2 - 10, bar.box.y1 - 10 - TOOLTIP_OFFSET])
    });

    test("tooltipAnchor is top left corner / horizontal / below axis",
    function() {
        createBar({ vertical: false, aboveAxis: false, isStacked: false });
        var anchor = bar.tooltipAnchor(10, 10);
        deepEqual([anchor.x, anchor.y], [bar.box.x1 - 10 - TOOLTIP_OFFSET, bar.box.y1])
    });

    test("tooltipAnchor is above top left corner / horizontal / below axis / stacked",
    function() {
        createBar({ vertical: false, aboveAxis: false, isStacked: true });
        var anchor = bar.tooltipAnchor(10, 10);
        deepEqual([anchor.x, anchor.y], [bar.box.x1, bar.box.y1 - 10 - TOOLTIP_OFFSET])
    });

    // ------------------------------------------------------------
    module("Bar / Labels / Template");

    test("renders template", function() {
        createBar({ labels: { visible: true, template: "${value}%" } });
        equal(label.children[0].children[0].content, VALUE + "%");
    });

    test("renders template even when format is set", function() {
        createBar({ labels: { visible: true, template: "${value}%", format:"{0:C}" } });
        equal(label.children[0].children[0].content, VALUE + "%");
    });

    test("template has category", function() {
        createBar({ labels: { visible: true, template: "${category}" } });
        equal(label.children[0].children[0].content, CATEGORY);
    });

    test("template has dataItem", function() {
        createBar({ labels: { visible: true, template: "${dataItem.value}" } });
        equal(label.children[0].children[0].content, VALUE);
    });

    test("template has series", function() {
        createBar({ labels: { visible: true, template: "${series.name}" } });
        equal(label.children[0].children[0].content, SERIES_NAME);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    var data = [{
            name: "Category A",
            text: "Alpha",
            value: 10,
            color: "red"
        },{
            name: "Category B",
            text: "Alpha",
            value: 10,
            color: null
        }],
        points,
        chart,
        label;

    function createBarChart(options) {
        chart = createChart({
            dataSource: {
                data: data
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    template: "${dataItem.text}"
                }
            },
            series: [{
                name: "Value",
                type: "bar",
                field: "value",
                colorField: "color"
            }],
            categoryAxis: {
                field: "name"
            }
        });

        points = chart._plotArea.charts[0].points;
        label = points[0].children[0];
    }

    // ------------------------------------------------------------
    module("Bar Chart / Data Binding", {
        setup: function() {
            createBarChart();
        },
        teardown: function() {
            destroyChart();
        }
    });

    test("point color bound to color field", function() {
        equal(points[0].options.color, "red");
    });

    test("point color not bound to null color field", function() {
        equal(points[1].options.color, "#ff6800");
    });

    test("dataItem sent to label template", function() {
        equal(label.children[0].children[0].content, "Alpha");
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    var chart,
        bar,
        barElement,
        plotArea;

    function createBarChart(options) {
        chart = createChart($.extend({
            series: [{
                type: "bar",
                data: [1]
            }],
            categoryAxis: {
                categories: ["A"]
            }
        }, options));

        plotArea = chart._model.children[1];
        bar = plotArea.charts[0].points[0];
        barElement = $(getElement(bar.options.id));
    }

    function barClick(callback) {
        createBarChart({
            seriesClick: callback
        });

        clickChart(chart, barElement);
    }

    function barHover(callback) {
        createBarChart({
            seriesHover: callback
        });

        barElement.mouseover();
    }

    // ------------------------------------------------------------
    module("Bar Chart / Events / seriesClick", {
        teardown: function() {
            destroyChart();
        }
    });

    test("fires when clicking bars", 1, function() {
        barClick(function() { ok(true); });
    });

    test("fires on subsequent click", 2, function() {
        barClick(function() { ok(true); });
        clickChart(chart, barElement);
    });

    test("fires when clicking bar labels", 1, function() {
        createBarChart({
            seriesDefaults: {
                bar: {
                    labels: {
                        visible: true
                    }
                }
            },
            seriesClick: function() { ok(true); }
        });
        var label = plotArea.charts[0].points[0].children[0];

        clickChart(chart, getElement(label.options.id));
    });

    test("event arguments contain value", 1, function() {
        barClick(function(e) { equal(e.value, 1); });
    });

    test("event arguments contain category", 1, function() {
        barClick(function(e) { equal(e.category, "A"); });
    });

    test("event arguments contain series", 1, function() {
        barClick(function(e) {
            deepEqual(e.series, chart.options.series[0]);
        });
    });

    test("event arguments contain jQuery element", 1, function() {
        barClick(function(e) {
            equal(e.element[0], getElement(bar.options.id));
        });
    });

    // ------------------------------------------------------------
    module("Bar Chart / Events / seriesHover", {
        teardown: function() {
            destroyChart();
        }
    });

    test("fires when hovering bars", 1, function() {
        barHover(function() { ok(true); });
    });

    test("fires on tap", 1, function() {
        createBarChart({
            seriesHover: function() {
                ok(true);
            }
        });

        clickChart(chart, barElement);
    });

    test("does not fire on subsequent tap", 1, function() {
        createBarChart({
            seriesHover: function() {
                ok(true);
            }
        });

        clickChart(chart, barElement);
        clickChart(chart, barElement);
    });

    test("fires when hovering bar labels", 1, function() {
        createBarChart({
            seriesDefaults: {
                bar: {
                    labels: {
                        visible: true
                    }
                }
            },
            seriesHover: function() { ok(true); }
        });
        var label = plotArea.charts[0].points[0].children[0];
        $(getElement(label.options.id)).mouseover();
    });

    test("event arguments contain value", 1, function() {
        barHover(function(e) { equal(e.value, 1); });
    });

    test("event arguments contain category", 1, function() {
        barHover(function(e) { equal(e.category, "A"); });
    });

    test("event arguments contain series", 1, function() {
        barHover(function(e) {
            deepEqual(e.series, chart.options.series[0]);
        });
    });

    test("event arguments contain jQuery element", 1, function() {
        barHover(function(e) {
            equal(e.element[0], getElement(bar.options.id));
        });
    });

})();
