(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        chartBox = new Box2D(100, 100, 1000, 1000),
        view,
        TOLERANCE = 1,
        MARGIN = 10,
        GAP = 4,
        chartSeries;

    function moduleSetup() {
        view = new ViewStub();
    }

    function moduleTeardown() {
        destroyMeasureBox();
    }

    (function() {
        var plotArea,
            categoryAxis,
            namedCategoryAxes,
            secondaryCategoryAxis,
            namedValueAxes,
            valueAxis,
            secondaryValueAxis,
            barSeriesData = [{
                name: "Value A",
                type: "bar",
                data: [100, 200, 300],
                gap: GAP
            }, {
                name: "Value B",
                type: "bar",
                data: [10, 20, 30]
            }],
            columnSeriesData = [{
                name: "Value A",
                type: "column",
                data: [100, 200, 300],
                gap: GAP
            }, {
                name: "Value B",
                type: "column",
                data: [10, 20, 30]
            }],
            lineSeriesData = [{
                name: "Value A",
                type: "line",
                data: [100, 200, 300]
            }, {
                name: "Value B",
                type: "line",
                data: [10, 20, 30]
            },
            verticalLineSeriesData = [{
                name: "Value A",
                type: "verticalLine",
                data: [100, 200, 300]
            }, {
                name: "Value B",
                type: "verticalLine",
                data: [10, 20, 30]
            }]],
            areaSeriesData = [{
                name: "Value A",
                type: "area",
                data: [100, 200, 300]
            }, {
                name: "Value B",
                type: "area",
                data: [10, 20, 30]
            },
            verticalAreaSeriesData = [{
                name: "Value A",
                type: "verticalArea",
                data: [100, 200, 300]
            }, {
                name: "Value B",
                type: "verticalArea",
                data: [10, 20, 30]
            }]];

        function createPlotArea(series, options) {
            plotArea = new dataviz.CategoricalPlotArea(series,
                $.extend({
                categoryAxis: {
                    categories: ["A", "B", "C"]
                }
            }, options));

            categoryAxis = plotArea.categoryAxis;
            valueAxis = plotArea.valueAxis;
            namedCategoryAxes = plotArea.namedCategoryAxes;
            secondaryCategoryAxis = namedCategoryAxes.secondary;
            namedValueAxes = plotArea.namedValueAxes;
            secondaryValueAxis = namedValueAxes.secondary;

            chartSeries = plotArea.charts[0];
        }

        function assertAxisRange(axis, min, max, series, options) {
            var fn = dataviz.CategoricalPlotArea.fn;
            stubMethod(fn, "createValueAxes",
                function(panes) {
                    fn._stubbed["createValueAxes"].call(this, panes);
                    deepEqual(this[axis].options.min, min);
                    deepEqual(this[axis].options.max, max);
                },
                function() {
                    plotArea = createPlotArea(series, options);
                }
            );
        }

        // ------------------------------------------------------------
        module("Categorical PlotArea / Axes", {
            setup: function() {
                moduleSetup();

                createPlotArea(columnSeriesData);
            },
            teardown: moduleTeardown
        });

        test("appends primary value axis to pane content", function() {
            ok($.inArray(valueAxis, plotArea.panes[0].content.children) >= 0);
        });

        test("appends category axis to pane content", function() {
            ok($.inArray(categoryAxis, plotArea.panes[0].content.children) >= 0);
        });

        test("aligns axes at default crossing values", function() {
            var axisX = categoryAxis,
                axisY = valueAxis;

            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValue),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValue);
            deepEqual([crossingSlotY.x1, crossingSlotY.y1], [crossingSlotX.x1, crossingSlotX.y1]);
        });

        test("aligns reversed axes at default crossing values", function() {
            createPlotArea(columnSeriesData, {
                categoryAxis: { reverse: true },
                valueAxis: { reverse: true }
            });

            var axisX = categoryAxis,
                axisY = valueAxis;

            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValue),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValue);
            deepEqual([crossingSlotY.x2, crossingSlotY.y2], [crossingSlotX.x2, crossingSlotX.y2]);
        });

        test("aligns axises at non-default crossing values", function() {
            var axisX = categoryAxis,
                axisY = valueAxis;

            axisY.options.axisCrossingValue = 10;
            axisX.options.axisCrossingValue = 1;
            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValue),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValue);
            deepEqual([crossingSlotY.x1, crossingSlotY.y1], [crossingSlotX.x1, crossingSlotX.y1], TOLERANCE);
        });

        test("reads crossing values from axisCrossingValues alias", function() {
            var axisX = categoryAxis,
                axisY = valueAxis;

            axisY.options.axisCrossingValues = 10;
            axisX.options.axisCrossingValues = 1;
            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValues),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValues);
            deepEqual([crossingSlotY.x1, crossingSlotY.y1], [crossingSlotX.x1, crossingSlotX.y1], TOLERANCE);
        });

        test("aligns reversed axes at non-default crossing values", function() {
            createPlotArea(columnSeriesData, {
                categoryAxis: { reverse: true, axisCrossingValue: 3 },
                valueAxis: { reverse: true }
            });

            var axisX = categoryAxis,
                axisY = valueAxis;

            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValue),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValue);
            deepEqual([crossingSlotY.x2, crossingSlotY.y2], [crossingSlotX.x2, crossingSlotX.y2]);
        });

        test("axis limit is [0, 1.2] when no series are configured", 2, function() {
            assertAxisRange("valueAxis", 0, 1.2, []);
        });

        test("NaN values are ignored when tracking axis range", 2, function() {
            stubMethod(dataviz.CategoricalPlotArea.fn, "createValueAxes",
                function() {
                    equal(this.valueAxisRangeTracker.query().min, 100);
                    equal(this.valueAxisRangeTracker.query().max, 300);
                },
                function() {
                    createPlotArea([{
                        type: "bar",
                        data: [100, NaN, 300]
                    }]);
                }
            );
        });

        test("adds categories to match actual data", function() {
            var plotArea = new dataviz.CategoricalPlotArea(columnSeriesData, {
                categoryAxis: {
                    categories: ["A", "B"]
                }
            });

            equal(plotArea.categoryAxis.options.categories.length, 3);
        });

        test("accepts extra categories", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "column",
                    data: [100]
                }], {
                categoryAxis: {
                    categories: ["A", "B"]
                }
            });

            equal(plotArea.categoryAxis.options.categories.length, 2);
        });

        test("categoryAxis justified is not altered with line series", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "line",
                    data: [100]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    justified: true
                }
            });

            equal(plotArea.categoryAxis.options.justified, true);
        });

        test("categoryAxis justified is set to false with bar series", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "bar",
                    data: [100]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    justified: true
                }
            });

            equal(plotArea.categoryAxis.options.justified, false);
        });

        test("categoryAxis justified is set to false with column series", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "column",
                    data: [100]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    justified: true
                }
            });

            equal(plotArea.categoryAxis.options.justified, false);
        });

        test("categoryAxis justified is set to false with OHLC series", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "ohlc",
                    data: [[]]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    justified: true
                }
            });

            equal(plotArea.categoryAxis.options.justified, false);
        });

        test("categoryAxis justified is set to false with candlestick series", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "candlestick",
                    data: [[]]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    justified: true
                }
            });

            equal(plotArea.categoryAxis.options.justified, false);
        });

        test("categoryAxis justified is not altered with bar series on secondary axis", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "line",
                    data: [100]
                }, {
                    type: "bar",
                    data: [200],
                    categoryAxis: "secondary"
                }], {
                categoryAxis: [{
                    categories: ["A", "B"],
                    justified: true
                }, {
                    name: "secondary",
                    categories: ["a", "b"]
                }]
            });

            equal(plotArea.categoryAxis.options.justified, true);
        })

        test("categoryAxis justified is not altered with bar series on primary axis", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "line",
                    data: [100]
                }, {
                    type: "bar",
                    data: [200]
                }], {
                categoryAxis: [{
                    categories: ["A", "B"]
                }, {
                    categories: ["a", "b"],
                    justified: true
                }]
            });

            equal(plotArea.axes[1].options.justified, true);
        });

        test("categoryAxis should have justified true if the type of the series is area", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "area",
                    data: [100]
                }], { });

            equal(plotArea.axes[0].options.justified, true);
        });

        test("categoryAxis should have justified true if the type of the series is verticalArea", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "verticalArea",
                    data: [100]
                }], { });

            equal(plotArea.axes[0].options.justified, true);
        });

        test("categoryAxis should have justified false if the one of the all series is not from type area", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "area",
                    data: [100]
                },{
                    type: "bar",
                    data: [100]
                }], { });

            equal(plotArea.axes[0].options.justified, false);
        });

        test("categoryAxis roundToBaseUnit is not altered with line series", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "line",
                    data: [100]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    roundToBaseUnit: false
                }
            });

            equal(plotArea.categoryAxis.options.roundToBaseUnit, false);
        });

        test("categoryAxis roundToBaseUnit is set to true with bar series", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "bar",
                    data: [100]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    roundToBaseUnit: false
                }
            });

            equal(plotArea.categoryAxis.options.roundToBaseUnit, true);
        });

        test("categoryAxis roundToBaseUnit is set to true with column series", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "column",
                    data: [100]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    roundToBaseUnit: false
                }
            });

            equal(plotArea.categoryAxis.options.roundToBaseUnit, true);
        });

        test("categoryAxis roundToBaseUnit is set to true with OHLC series", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "ohlc",
                    data: [100]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    roundToBaseUnit: false
                }
            });

            equal(plotArea.categoryAxis.options.roundToBaseUnit, true);
        });

        test("categoryAxis roundToBaseUnit is set to true with candlestick series", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "candlestick",
                    data: [100]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    roundToBaseUnit: false
                }
            });

            equal(plotArea.categoryAxis.options.roundToBaseUnit, true);
        });

        test("categoryAxis roundToBaseUnit is not altered with bar series on other axis", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "line",
                    data: [100]
                }, {
                    type: "bar",
                    data: [200],
                    categoryAxis: "secondary"
                }], {
                categoryAxis: [{
                    categories: ["A", "B"],
                    roundToBaseUnit: false
                }, {
                    name: "secondary",
                    categories: ["a", "b"]
                }]
            });

            equal(plotArea.categoryAxis.options.roundToBaseUnit, false);
        });

        test("categoryAxis justified is not altered with bar series on primary axis", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "line",
                    data: [100]
                }, {
                    type: "bar",
                    data: [200]
                }], {
                categoryAxis: [{
                    categories: ["A", "B"]
                }, {
                    categories: ["a", "b"],
                    roundToBaseUnit: false
                }]
            });

            equal(plotArea.axes[1].options.roundToBaseUnit, false);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Multiple Value Axes", {
            setup: function() {
                moduleSetup();

                createPlotArea(columnSeriesData, {
                    valueAxis: [{}, {
                        name: "secondary"
                    }]
                });
            },
            teardown: moduleTeardown
        });

        test("secondary axis added to pane content", function() {
            ok($.inArray(secondaryValueAxis, plotArea.panes[0].content.children) >= 0);
        });

        test("crosses category axis at default value", function() {
            plotArea.reflow(chartBox);

            var slotX = categoryAxis.getSlot(categoryAxis.options.axisCrossingValue),
                slotY = valueAxis.getSlot(valueAxis.options.axisCrossingValue);

            equal(slotX.y1, slotY.y1);
        });

        test("Throws error when value axis name is duplicate", function() {
            raises(function() {
                plotArea = new dataviz.CategoricalPlotArea([{
                        type: "column",
                        data: [100]
                    }], {
                    valueAxis: [{
                        name: "b"
                    }, {
                        name: "b"
                    }]
                });
            },
            /Value axis with name b is already defined/);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Multiple Value Axes / Stacked Left", {
            setup: function() {
                moduleSetup();

                createPlotArea(columnSeriesData, {
                    valueAxis: [{}, {
                        name: "secondary"
                    }]
                });
            },
            teardown: moduleTeardown
        });

        test("overlapping axes are stacked to the left", function() {
            var margin = secondaryValueAxis.options.margin;

            plotArea.reflow(chartBox);

            deepEqual([secondaryValueAxis.box.x2, secondaryValueAxis.box.y1],
                 [valueAxis.box.x1 - margin, valueAxis.box.y1]
            );
        });

        test("axis can be superimposed using options._overlap", function() {
            valueAxis.options._overlap = true;
            secondaryValueAxis._overlap = true;

            plotArea.reflow(chartBox);

            deepEqual([secondaryValueAxis.box.x2, secondaryValueAxis.box.y1],
                 [valueAxis.box.x2, valueAxis.box.y1]
            );
        });

        test("stacked axes on left are aligned", function() {
            plotArea.reflow(chartBox);

            deepEqual([secondaryValueAxis.lineBox().y1, secondaryValueAxis.lineBox().y2],
                 [valueAxis.lineBox().y1, valueAxis.lineBox().y2]
            );
        });

        test("stacked axes on the left are not mirrored", function() {
            plotArea.reflow(chartBox);

            ok(!valueAxis.options.labels.mirror);
            ok(!secondaryValueAxis.options.labels.mirror);
        });

        test("user set mirror option is not changed", function() {
            valueAxis.options.labels.mirror = true;

            plotArea.reflow(chartBox);

            ok(valueAxis.options.labels.mirror);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Multiple Value Axes / Stacked Right", {
            setup: function() {
                moduleSetup();

                createPlotArea(columnSeriesData, {
                    categoryAxis: {
                        axisCrossingValue: 100
                    },
                    valueAxis: [{}, {
                        name: "secondary"
                    }]
                });
            },
            teardown: moduleTeardown
        });

        test("overlapping axes are shifted to the right", function() {
            var margin = secondaryValueAxis.options.margin;

            plotArea.reflow(chartBox);

            deepEqual([secondaryValueAxis.box.x1, secondaryValueAxis.box.y1],
                 [valueAxis.box.x2 + margin, valueAxis.box.y1]
            );
        });

        test("stacked axes on right are aligned", function() {
            plotArea.reflow(chartBox);

            deepEqual([secondaryValueAxis.lineBox().y1, secondaryValueAxis.lineBox().y2],
                 [valueAxis.lineBox().y1, valueAxis.lineBox().y2]
            );
        });

        test("plot area bounding box wraps axis", function() {
            plotArea.reflow(chartBox);

            var axisBox = secondaryValueAxis.box;
            ok(axisBox.x1 >= plotArea.box.x1 && axisBox.y1 >= plotArea.box.x1);
        });

        test("stacked axes on the right are mirrored", function() {
            plotArea.reflow(chartBox);

            ok(valueAxis.options.labels.mirror);
            ok(secondaryValueAxis.options.labels.mirror);
        });

        test("mirroring inverts the mirror option", function() {
            valueAxis.options.labels.mirror = true;

            plotArea.reflow(chartBox);

            ok(!valueAxis.options.labels.mirror);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Inverted / Multiple Value Axes / Stacked Top", {
            setup: function() {
                moduleSetup();

                createPlotArea(barSeriesData, {
                    categoryAxis: {
                        axisCrossingValue: 0
                    },
                    valueAxis: [{}, {
                        name: "secondary"
                    }]
                });
            },
            teardown: moduleTeardown
        });

        test("overlapping axes are shifted to the top", function() {
            var margin = secondaryValueAxis.options.margin;

            plotArea.reflow(chartBox);

            equal(secondaryValueAxis.box.y2, valueAxis.box.y1 - margin);
        });

        test("stacked axes on top are aligned", function() {
            plotArea.reflow(chartBox);

            deepEqual([secondaryValueAxis.lineBox().x1, secondaryValueAxis.lineBox().x2],
                 [valueAxis.lineBox().x1, valueAxis.lineBox().x2]
            );
        });

        test("stacked axes on the top are mirrored", function() {
            plotArea.reflow(chartBox);

            ok(valueAxis.options.labels.mirror);
            ok(secondaryValueAxis.options.labels.mirror);
        });

        test("mirroring inverts the mirror option", function() {
            valueAxis.options.labels.mirror = true;

            plotArea.reflow(chartBox);

            ok(!valueAxis.options.labels.mirror);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Inverted / Multiple Value Axes / Stacked Bottom", {
            setup: function() {
                moduleSetup();

                createPlotArea(barSeriesData, {
                    valueAxis: [{}, {
                        name: "secondary"
                    }]
                });
            },
            teardown: moduleTeardown
        });

        test("overlapping axes are shifted to the bottom", function() {
            var margin = secondaryValueAxis.options.margin;

            plotArea.reflow(chartBox);

            deepEqual(secondaryValueAxis.box.y1, valueAxis.box.y2 + margin);
        });

        test("stacked axes on bottom are aligned", function() {
            plotArea.reflow(chartBox);

            deepEqual([secondaryValueAxis.lineBox().x1, secondaryValueAxis.lineBox().x2],
                 [valueAxis.lineBox().x1, valueAxis.lineBox().x2]
            );
        });

        test("stacked axes on the bottom are not mirrored", function() {
            plotArea.reflow(chartBox);

            ok(!valueAxis.options.labels.mirror);
            ok(!secondaryValueAxis.options.labels.mirror);
        });

        test("user set mirror option is not changed", function() {
            valueAxis.options.labels.mirror = true;

            plotArea.reflow(chartBox);

            ok(valueAxis.options.labels.mirror);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Multiple Category Axes", {
            setup: function() {
            },
            teardown: moduleTeardown
        });

        test("axes are accessible by name", function() {
            createPlotArea(columnSeriesData, {
                categoryAxis: [{
                        name: "a"
                    }, {
                        name: "b"
                    }]
            });

            ok(plotArea.namedCategoryAxes["a"]);
            ok(plotArea.namedCategoryAxes["b"]);
        });

        test("axis can be superimposed using options._overlap", function() {
            createPlotArea(columnSeriesData, {
                categoryAxis: [{
                        name: "a",
                        _overlap: true
                    }, {
                        name: "b",
                        _overlap: true
                    }]
            });

            plotArea.reflow(chartBox);

            deepEqual(plotArea.namedCategoryAxes["a"].box.y1,
                 plotArea.namedCategoryAxes["b"].box.y1);
        });

        test("first axis is set as primary category axis", function() {
            createPlotArea(columnSeriesData, {
                categoryAxis: [{
                        name: "a"
                    }, {
                        name: "b"
                    }]
            });

            ok(plotArea.categoryAxis === plotArea.namedCategoryAxes["a"]);
        });

        test("secondary category axis is added to pane content", function() {
                moduleSetup();

                createPlotArea(columnSeriesData, {
                    categoryAxis: [{}, {
                        name: "secondary"
                    }]
                });

            ok($.inArray(secondaryCategoryAxis, plotArea.panes[0].content.children) >= 0);
        });

        test("adds categories to match actual data", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                type: "column",
                data: [1, 2, 3],
                categoryAxis: "b"
            }], {
                categoryAxis: [{
                    }, {
                    name: "b",
                    categories: ["A", "B"]
                }]
            });

            equal(plotArea.namedCategoryAxes.b.options.categories.length, 3);
        });

        test("accepts extra categories", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    type: "column",
                    data: [100],
                    categoryAxis: "b"
                }], {
                categoryAxis: [{
                    }, {
                    name: "b",
                    categories: ["A", "B"]
                }]
            });

            equal(plotArea.namedCategoryAxes.b.options.categories.length, 2);
        });

        test("Throws error when unable to locate category axis", function() {
            raises(function() {
                createPlotArea([{
                    data: [100, 200, 300],
                    categoryAxis: "b"
                }])},
                /Unable to locate category axis with name b/);
        });

        test("Throws error when category axis name is duplicate", function() {
            raises(function() {
                plotArea = new dataviz.CategoricalPlotArea([{
                        type: "column",
                        data: [100]
                    }], {
                    categoryAxis: [{
                        name: "b"
                    }, {
                        name: "b"
                    }]
                });
            },
            /Category axis with name b is already defined/);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Column series", {
            setup: function() {
                moduleSetup();

                createPlotArea(columnSeriesData);
            },
            teardown: moduleTeardown
        });

        test("value axis is vertical", function() {
            ok(valueAxis.options.vertical);
        });

        test("category axis is horizontal", function() {
            ok(!categoryAxis.options.vertical);
        });

        test("value axis crosses at first category", function() {
            equal(valueAxis.options.axisCrossingValue, 0);
        });

        test("category axis crossing value can be changed", function() {
            plotArea = new dataviz.CategoricalPlotArea(columnSeriesData, {
                categoryAxis: {
                    categories: ["A", "B", "C"],
                    axisCrossingValue: 2
                }
            });
            equal(plotArea.categoryAxis.options.axisCrossingValue, 2);
        });

        test("creates bar chart", function() {
            ok(chartSeries instanceof dataviz.BarChart);
        });

        test("groups bar series into bar chart", function() {
            equal(chartSeries.options.series.length, 2);
        });

        test("bar chart added to pane content", function() {
            ok($.inArray(chartSeries, plotArea.panes[0].content.children) >= 0);
        });

        test("sets axis min/max to series limits", 2, function() {
            stubMethod(dataviz.CategoricalPlotArea.fn, "createValueAxes",
                function() {
                    equal(this.valueAxisRangeTracker.query().min, 10);
                    equal(this.valueAxisRangeTracker.query().max, 300);
                },
                function() {
                    createPlotArea(columnSeriesData);
                }
            );
        });

        test("sets named default axis min/max to series limits (expl. axis)", 2, function() {
            assertAxisRange("valueAxis", 0, 120,
                [{ type: "column", data: [100], axis: "A" }],
                { valueAxis: { name: "A" } }
            );
        });

        test("sets named primary axis min/max to series limits (impl. axis)", function() {
            assertAxisRange("valueAxis", 0, 120,
                [{ type: "column", data: [100] }],
                { valueAxis: { name: "A" } }
            );
        });

        test("sets named default axis min/max to series limits (expl. axis, 0 < value < 1)", 2, function() {
            assertAxisRange("valueAxis", 0, .12,
                [{ type: "column", data: [.1], axis: "A" }],
                { valueAxis: { name: "A" } }
            );
        });

        test("sets named primary axis min/max to series limits (impl. axis, 0 < value < 1)", 2, function() {
            assertAxisRange("valueAxis", 0, .12,
                [{ type: "column", data: [.1] }],
                { valueAxis: { name: "A" } }
            );
        });

        test("sets named primary axis min/max to series limits (implicit axis)", 2, function() {
            assertAxisRange("valueAxis", 0, 350,
                columnSeriesData,
                { valueAxis: { name: "A" } }
            );
        });

        test("NaN values are ignored when tracking axis range", 2, function() {
            stubMethod(dataviz.CategoricalPlotArea.fn, "createValueAxes",
                function() {
                    equal(this.valueAxisRangeTracker.query().min, 100);
                    equal(this.valueAxisRangeTracker.query().max, 300);
                },
                function() {
                    createPlotArea([{
                        type: "column",
                        data: [100, NaN, 300]
                    }]);
                }
            );
        });

        test("applies gap from first series", function() {
            equal(chartSeries.options.gap, GAP);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Line series", {
            setup: function() {
                moduleSetup();

                createPlotArea(lineSeriesData);
            },
            teardown: moduleTeardown
        });

        test("value axis is vertical", function() {
            ok(valueAxis.options.vertical);
        });

        test("category axis is horizontal", function() {
            ok(!categoryAxis.options.vertical);
        });

        test("creates line chart", function() {
            ok(chartSeries instanceof dataviz.LineChart);
        });

        test("line chart added to pane content", function() {
            ok($.inArray(chartSeries, plotArea.panes[0].content.children) >= 0);
        });

        test("sets isStacked when first series is stacked", function() {
            createPlotArea([{ type: "line", data: [], stack: true }, { type: "line", data: [] }]);
            ok(chartSeries.options.isStacked);
        });

        test("does not set isStacked when first and only series is stacked", function() {
            createPlotArea([{ type: "line", data: [], stack: true }]);
            ok(!chartSeries.options.isStacked);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Vertical line series", {
            setup: function() {
                moduleSetup();

                createPlotArea(verticalLineSeriesData);
            },
            teardown: moduleTeardown
        });

        test("value axis is horizontal", function() {
            ok(!valueAxis.options.vertical);
        });

        test("category axis is vertical", function() {
            ok(categoryAxis.options.vertical);
        });

        test("creates line chart", function() {
            ok(chartSeries instanceof dataviz.LineChart);
        });

        test("sets isStacked when first series is stacked", function() {
            createPlotArea([{ type: "verticalLine", data: [], stack: true }, { type: "verticalLine", data: [] }]);
            ok(chartSeries.options.isStacked);
        });

        test("does not set isStacked when first and only series is stacked", function() {
            createPlotArea([{ type: "verticalLine", data: [], stack: true }]);
            ok(!chartSeries.options.isStacked);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Area series", {
            setup: function() {
                moduleSetup();

                createPlotArea(areaSeriesData);
            },
            teardown: moduleTeardown
        });

        test("value axis is vertical", function() {
            ok(valueAxis.options.vertical);
        });

        test("category axis is horizontal", function() {
            ok(!categoryAxis.options.vertical);
        });

        test("creates area chart", function() {
            ok(chartSeries instanceof dataviz.AreaChart);
        })

        test("area chart added to pane content", function() {
            ok($.inArray(chartSeries, plotArea.panes[0].content.children) >= 0);
        });;

        test("sets isStacked when first series is stacked", function() {
            createPlotArea([{ type: "area", data: [], stack: true }, { type: "area", data: [] }]);
            ok(chartSeries.options.isStacked);
        });

        test("does not set isStacked when first and only series is stacked", function() {
            createPlotArea([{ type: "area", data: [], stack: true }]);
            ok(!chartSeries.options.isStacked);
        });

        test("NaN values are ignored when tracking axis range", 2, function() {
            stubMethod(dataviz.CategoricalPlotArea.fn, "createValueAxes",
                function() {
                    equal(this.valueAxisRangeTracker.query().min, 100);
                    equal(this.valueAxisRangeTracker.query().max, 300);
                },
                function() {
                    createPlotArea([{
                        type: "area",
                        data: [100, NaN, 300]
                    }]);
                }
            );
        });
        // ------------------------------------------------------------
        module("Categorical PlotArea / Verical area series", {
            setup: function() {
                moduleSetup();

                createPlotArea(verticalAreaSeriesData);
            },
            teardown: moduleTeardown
        });

        test("value axis is horizontal", function() {
            ok(!valueAxis.options.vertical);
        });

        test("category axis is vertical", function() {
            ok(categoryAxis.options.vertical);
        });

        test("creates area chart", function() {
            ok(chartSeries instanceof dataviz.AreaChart);
        });

        test("sets isStacked when first series is stacked", function() {
            createPlotArea([{ type: "verticalArea", data: [], stack: true }, { type: "verticalArea", data: [] }]);
            ok(chartSeries.options.isStacked);
        });

        test("does not set isStacked when first and only series is stacked", function() {
            createPlotArea([{ type: "verticalArea", data: [], stack: true }]);
            ok(!chartSeries.options.isStacked);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Bar series", {
            setup: function() {
                moduleSetup();

                createPlotArea(barSeriesData);
            },
            teardown: moduleTeardown
        });

        test("value axis is horizontal", function() {
            ok(!valueAxis.options.vertical);
        });

        test("category axis is vertical", function() {
            ok(categoryAxis.options.vertical);
        });

        test("value axis crosses at last category", function() {
            ok(plotArea.categoryAxis.options.axisCrossingValue >= 3);
        });

        test("value axis crosses at last category when no categories are defined", function() {
            plotArea = new dataviz.CategoricalPlotArea(barSeriesData);
            ok(plotArea.categoryAxis.options.axisCrossingValue >= 3);
        });

        test("value axis crossing can be changed", function() {
            plotArea = new dataviz.CategoricalPlotArea(barSeriesData, {
                categoryAxis: {
                    categories: ["A", "B", "C"],
                    axisCrossingValue: 2
                }
            });
            equal(plotArea.categoryAxis.options.axisCrossingValue, 2);
        });

        test("applies gap from first series", function() {
            equal(chartSeries.options.gap, GAP);
        });

        test("aligns axes at default crossing values", function() {
            var axisX = valueAxis,
                axisY = categoryAxis;

            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValue),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValue);
            deepEqual([crossingSlotY.x1, crossingSlotY.y1], [crossingSlotX.x1, crossingSlotX.y1]);
        });

        test("aligns reversed axes at default crossing values", function() {
            createPlotArea(barSeriesData, {
                categoryAxis: { reverse: true },
                valueAxis: { reverse: true }
            });

            var axisX = valueAxis,
                axisY = categoryAxis;

            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValue),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValue);

            deepEqual([crossingSlotY.x2, crossingSlotY.y2], [crossingSlotX.x2, crossingSlotX.y2]);
        });

        test("aligns reversed axes at non-default crossing values", function() {
            createPlotArea(barSeriesData, {
                categoryAxis: { reverse: true, axisCrossingValue: 0 },
                valueAxis: { reverse: true }
            });

            var axisX = valueAxis,
                axisY = categoryAxis;

            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValue),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValue);

            deepEqual([crossingSlotY.x2, crossingSlotY.y2], [crossingSlotX.x2, crossingSlotX.y2]);
        });

        test("sets isStacked when first series is stacked", function() {
            createPlotArea([{ type: "bar", data: [], stack: true }, { type: "bar", data: [] }]);
            ok(chartSeries.options.isStacked);
        });

        test("does not set isStacked when first and only series is stacked", function() {
            createPlotArea([{ type: "bar", data: [], stack: true }]);
            ok(!chartSeries.options.isStacked);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / OHLC series", {
            setup: function() {
                moduleSetup();

                createPlotArea([{
                    type: "ohlc",
                    data: [[]]
                }]);
            },
            teardown: moduleTeardown
        });

        test("OHLC chart added to pane content", function() {
            ok($.inArray(chartSeries, plotArea.panes[0].content.children) >= 0);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Candlestick series", {
            setup: function() {
                moduleSetup();

                createPlotArea([{
                    type: "candlestick",
                    data: [[]]
                }]);
            },
            teardown: moduleTeardown
        });

        test("Candlestick chart added to pane content", function() {
            ok($.inArray(chartSeries, plotArea.panes[0].content.children) >= 0);
        });

        test("sets named primary axis min/max to series limits (impl./expl. axis)", function() {
            var fn = dataviz.CategoricalPlotArea.fn;
            stubMethod(fn, "createValueAxes",
                function(panes) {
                    fn._stubbed["createValueAxes"].call(this, panes);
                    equal(this.valueAxis.options.min, 0);
                    equal(this.valueAxis.options.max, 120);
                },
                function() {
                    createPlotArea([{
                        type: "candlestick",
                        data: [[0, 10, 0, 0]],
                        axis: "A"
                    }, {
                        type: "candlestick",
                        data: [[0, 100, 0, 0]]
                    }], {
                        valueAxis: { name: "A" }
                    });
                }
            );
        });

        test("sets named primary axis min/max to series limits (implicit axis)", function() {
            var fn = dataviz.CategoricalPlotArea.fn;
            stubMethod(fn, "createValueAxes",
                function(panes) {
                    fn._stubbed["createValueAxes"].call(this, panes);
                    equal(this.valueAxis.options.min, 0);
                    equal(this.valueAxis.options.max, 12);
                },
                function() {
                    createPlotArea([{
                        type: "candlestick",
                        data: [[0, 10, 0, 0]]
                    }], {
                        valueAxis: { name: "A" }
                    });
                }
            );
        });

        // ------------------------------------------------------------
        var dateCategoryAxis = {
            type: "date",
            categories: ["2012/02/01 00:00", "2012/02/02 00:00", "2012/02/04 00:00"]
        };

        module("Categorical PlotArea / Date series", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("Accepts capitalized type", function() {
            createPlotArea([{
                    type: "bar",
                    data: [100, 200, 300]
                }], {
                categoryAxis: {
                    type: "Date",
                    categories: ["2012/02/01 00:00", "2012/02/02 00:00", "2012/02/04 00:00"]
                }
            });

            deepEqual(plotArea.categoryAxis.options.categories[0].constructor, Date);
        });

        test("Automatically detects date category axis", function() {
            createPlotArea([{
                    type: "bar",
                    data: [100, 200, 300]
                }], {
                categoryAxis: {
                    categories: [
                        new Date(2012, 02, 01),
                        new Date(2012, 02, 02),
                        new Date(2012, 02, 04)
                    ]
                }
            });

            deepEqual(plotArea.categoryAxis.options.type, "date");
            deepEqual(plotArea.series[0].data, [{ value: 100 }, { value: 200 }, {}, { value: 300 }]);
        });

        test("User can override automatic category axis type", function() {
            createPlotArea([{
                    type: "bar",
                    data: [100, 200, 300]
                }], {
                categoryAxis: {
                    type: "category",
                    categories: [
                        new Date(2012, 02, 01),
                        new Date(2012, 02, 02),
                        new Date(2012, 02, 04)
                    ]
                }
            });

            deepEqual(plotArea.categoryAxis.options.type, "category");
            deepEqual(plotArea.series[0].data, [100, 200, 300]);
        });

        test("Does not alter data points when no grouping is done", function() {
            createPlotArea([{
                type: "bar",
                data: [100, 200, 300]
            }], {
                categoryAxis: dateCategoryAxis
            });

            deepEqual(plotArea.series[0].data, [{ value: 100 }, { value: 200 }, {}, { value: 300 }]);
        });

        test("Does not alter original series data", function() {
            var series = [{
                type: "bar",
                data: [100, 200, 300]
            }];

            createPlotArea(series, {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(series[0].data, [100, 200, 300]);
        });

        test("Does not alter original series data items", function() {
            var series = [{
                type: "bar",
                data: [100, 200, 300],
                dataItems: ["a", "b", "c"]
            }];

            createPlotArea(series, {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(series[0].dataItems, ["a", "b", "c"]);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Date series / Aggregates", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("Aggregates series data using max by default", function() {
            createPlotArea([{
                type: "bar",
                data: [100, 200, 300]
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 300 }]);
        });

        test("Aggregates are calculated for single values", 1, function() {
            createPlotArea([{
                type: "bar",
                data: [100],
                aggregate: function() { ok(true); }
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });
        });

        test("Aggregates bound series data", function() {
            createPlotArea([{
                type: "bar",
                data: [{ value: 100 }, { value: 200 }, { value: 300 }]
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 300 }]);
        });

        test("Aggregation preserves value field name", function() {
            createPlotArea([{
                type: "bar",
                field: "v",
                data: [{ v: 100 }, { v: 200 }, { v: 300 }]
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ v: 300 }]);
        });

        test("Aggregation preserves compound value field names", function() {
            createPlotArea([{
                type: "candlestick",
                data: [{ o: 100, h: 100, l: 100, c: 100 }, { o: 200, h: 200, l: 200, c: 200 }],
                openField: "o",
                highField: "h",
                lowField: "l",
                closeField: "c",
                aggregate: {
                    open: "max",
                    high: "max",
                    low: "max",
                    close: "max"
                }
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ o: 200, h: 200, l: 200, c: 200 }]);
        });

        test("Does not change series fields", function() {
            createPlotArea([{
                type: "line",
                data: [{}, {}],
                field: "v"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            equal(plotArea.series[0].field, "v");
        });

        test("Binds to data items returned from aggregate (simple aggregate)", function() {
            createPlotArea([{
                type: "line",
                data: [{ v: 100 }, { v: 200 }],
                field: "v",
                aggregate: function() {
                    return { v: 300 };
                }
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ v: 300 }]);
        });

        test("Binds to data items returned from aggregate (compound aggregate)", function() {
            createPlotArea([{
                type: "candlestick",
                data: [{ o: 100, h: 100, l: 100, c: 100 }, { o: 200, h: 200, l: 200, c: 200 }],
                openField: "o",
                highField: "h",
                lowField: "l",
                closeField: "c",
                aggregate: function() {
                    return { o: 300, h: 300, l: 300, c: 300 };
                }
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ o: 300, h: 300, l: 300, c: 300 }]);
        });

        test("Aggregates series data with predefined function", function() {
            createPlotArea([{
                type: "bar",
                data: [100, 200, 300],
                aggregate: "min"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 100 }]);
        });

        test("Aggregates series data with user function", 1, function() {
            createPlotArea([{
                type: "bar",
                data: [100, 200, 300],
                aggregate: function(values, series) {
                    deepEqual(values, series.data);
                    return 0;
                }
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });
        });

        test("User aggregate function receives dataItems", 1, function() {
            createPlotArea([{
                type: "bar",
                data: [100, 200, 300],
                aggregate: function(values, series, dataItems) {
                    deepEqual(dataItems, series.data);
                    return 0;
                }
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });
        });

        test("User aggregate function receives group", 1, function() {
            createPlotArea([{
                type: "bar",
                data: [100, 200, 300],
                aggregate: function(values, series, dataItems, group) {
                    deepEqual(group, new Date("2012/02/01"));
                    return 0;
                }
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });
        });

        test("Does not drop note text", 1, function() {
            createPlotArea([{
                type: "bar",
                field: "v",
                noteTextField: "n",
                aggregate: {
                    value: "max",
                    noteText: "first"
                },
                data: [{ v: 1, n: "foo" }, { v: 2 }]
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ v: 2, n: "foo" }]);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Date series / Aggregates / max", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("max ignores NaN values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, NaN, 300],
                aggregate: "max"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 300 }]);
        });

        test("max ignores null values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, null, 300],
                aggregate: "max"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 300 }]);
        });

        test("max ignores undefined values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, undefined, 300],
                aggregate: "max"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 300 }]);
        });

        test("max returns Infinity", function() {
            createPlotArea([{
                type: "bar",
                data: [100, Infinity, 300],
                aggregate: "max"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: Infinity }]);
        });

        test("max handles -Infinity", function() {
            createPlotArea([{
                type: "bar",
                data: [100, -Infinity, 300],
                aggregate: "max"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 300 }]);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Date series / Aggregates / min", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("min ignores NaN values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, NaN, 300],
                aggregate: "min"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 100 }]);
        });

        test("min ignores null values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, null, 300],
                aggregate: "min"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 100 }]);
        });

        test("min ignores undefined values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, undefined, 300],
                aggregate: "min"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 100 }]);
        });

        test("min handles Infinity", function() {
            createPlotArea([{
                type: "bar",
                data: [100, Infinity, 300],
                aggregate: "min"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 100 }]);
        });

        test("min returns -Infinity", function() {
            createPlotArea([{
                type: "bar",
                data: [100, -Infinity, 300],
                aggregate: "min"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: -Infinity }]);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Date series / Aggregates / sum", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("sum ignores NaN values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, NaN, 300],
                aggregate: "sum"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 400 }]);
        });

        test("sum ignores null values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, null, 300],
                aggregate: "sum"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 400 }]);
        });

        test("sum ignores undefined values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, undefined, 300],
                aggregate: "sum"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 400 }]);
        });

        test("sum adds to Infinity", function() {
            createPlotArea([{
                type: "bar",
                data: [100, Infinity, 300],
                aggregate: "sum"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: Infinity }]);
        });

        test("sum adds to -Infinity", function() {
            createPlotArea([{
                type: "bar",
                data: [100, -Infinity, 300],
                aggregate: "sum"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: -Infinity }]);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Date series / Aggregates / count", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("count ignores null values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, null, 300],
                aggregate: "count"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 2 }]);
        });

        test("count ignores undefined values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, undefined, 300],
                aggregate: "count"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 2 }]);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Date series / Aggregates / avg", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("avg ignores NaN values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, NaN, 300],
                aggregate: "avg"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 200 }]);
        });

        test("avg ignores null values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, null, 300],
                aggregate: "avg"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 200 }]);
        });

        test("avg ignores undefined values", function() {
            createPlotArea([{
                type: "bar",
                data: [100, undefined, 300],
                aggregate: "avg"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 200 }]);
        });

        test("avg returns Infinity", function() {
            createPlotArea([{
                type: "bar",
                data: [100, Infinity, 300],
                aggregate: "avg"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: Infinity }]);
        });

        test("avg returns -Infinity", function() {
            createPlotArea([{
                type: "bar",
                data: [100, -Infinity, 300],
                aggregate: "avg"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: -Infinity }]);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Date series / Aggregates / first", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("first ignores null values", function() {
            createPlotArea([{
                type: "bar",
                data: [null, 300],
                aggregate: "first"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 300 }]);
        });

        test("first ignores undefined values", function() {
            createPlotArea([{
                type: "bar",
                data: [undefined, 300],
                aggregate: "first"
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });

            deepEqual(plotArea.series[0].data, [{ value: 300 }]);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Date series / Multiple Category Axes", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("Aggregates series on secondary axis", function() {
            createPlotArea([{
                type: "bar",
                data: [100, 200, 300],
                categoryAxis: "b"
            }], {
                categoryAxis: [
                    { },
                    kendo.deepExtend({
                        name: "b", baseUnit: "months"
                    }, dateCategoryAxis)
                ]
            });

            deepEqual(plotArea.series[0].data, [{ value: 300 }]);
        });

        test("Throws error when unable to locate category axis", function() {
            raises(function() {
                createPlotArea([{
                    type: "bar",
                    data: [100, 200, 300],
                    categoryAxis: "b"
                }], {
                    categoryAxis:
                        kendo.deepExtend({
                            baseUnit: "months"
                        }, dateCategoryAxis)
                })},
                /Unable to locate category axis with name b/);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Date series / OHLC Aggregates", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("Series data using aggregate", function() {
            createPlotArea([{
                type: "candlestick",
                aggregate: {
                    "open": "max",
                    "high": "max",
                    "low": "min",
                    "close": "max"
                },
                data: [[1,4,0,2], [2,5,1,3], [3,6,2,4]]
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            }),
            point = plotArea.series[0].data[0];

            deepEqual(point, { open: 3, high: 6, low: 0, close: 4 });
        });

        test("Series data with predefined function", function() {
            createPlotArea([{
                type: "candlestick",
                aggregate: {
                    "open": "min",
                    "high": "min",
                    "low": "min",
                    "close": "min"
                },
                data: [[1,4,0,2], [2,5,1,3], [3,6,2,4]]
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            }),
            point = plotArea.series[0].data[0];

            deepEqual(point, { open: 1, high: 4, low: 0, close: 2 });
        });

        test("Series data with user function", 1, function() {
            var data = [[1,4,0,2], [2,5,1,3], [3,6,2,4]];
            createPlotArea([{
                type: "candlestick",
                aggregate: {
                    "open": function(values, series) {
                        deepEqual(data, series.data);
                        return 0;
                    }
                },
                data: data
            }], {
                categoryAxis: kendo.deepExtend({
                    baseUnit: "months"
                }, dateCategoryAxis)
            });
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Date series / Category Field", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("Aggregates using category field instead of position", function() {
            createPlotArea([{
                type: "column",
                categoryField: "date",
                data: [{
                    value: 1,
                    date: new Date("2013/06/01")
                }, {
                    value: 2,
                    date: new Date("2013/06/02")
                }, {
                    value: 3,
                    date: new Date("2013/07/01")
                }]
            }], {
                categoryAxis: {
                    categories: [
                        new Date("2013/06/01"), new Date("2013/06/02"),
                        new Date("2013/07/01")
                    ],
                    baseUnit: "months"
                }
            });

            point = plotArea.series[0].data[0];

            equal(point.value, 2);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Aggregates / Category Field", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("Aggregates points with same category", function() {
            createPlotArea([{
                type: "column",
                categoryField: "category",
                data: [{
                    value: 1,
                    category: "A"
                }, {
                    value: 2,
                    category: "A"
                }, {
                    value: 3,
                    category: "B"
                }]
            }], {
                categoryAxis: {
                    categories: [ "A", "B" ]
                }
            });

            var data = plotArea.series[0].data;

            equal(data[0].value, 2);
            equal(data.length, 2);
        });

    })();

    (function() {
        var plotArea,
            barSeriesData = [{
                name: "Value A",
                type: "bar",
                data: [100]
            }];

        function createPlotArea(categoryAxis, valueAxis, options) {
            plotArea = new dataviz.CategoricalPlotArea(barSeriesData, kendo.deepExtend({
                categoryAxis: categoryAxis,
                valueAxis: valueAxis
            }, options));

            stubMethod(dataviz.NumericAxis.fn, "getViewElements", function() { return []; },
                function() {
                    stubMethod(dataviz.CategoryAxis.fn, "getViewElements", function() { return []; },
                        function() {
                            plotArea.reflow(chartBox);
                            plotArea.getViewElements(view);
                        }
            )});
        }

        // ------------------------------------------------------------
        module("Categorical PlotArea / Major Gridlines", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("renders gridlines", function() {
            createPlotArea({
                categories: ["A"],
                majorGridLines: {
                    visible: true
                }
            });

            equal(view.log.line.length, 7);
        });

        test("renders gridlines over hidden value axis", function() {
            createPlotArea({
                categories: ["A"],
                majorGridLines: {
                    visible: true
                }
            }, {
                line: {
                    visible: false
                }
            });

            equal(view.log.line.length, 8);
        });

        test("should not render gridlines for numeric axis", function() {
            var categoryAxis = {
                    categories: ["A"],
                    majorGridLines: {
                        visible: true
                    }
                },
                valueAxis = {
                    majorGridLines: {
                        visible: false
                    }
                };

            createPlotArea(categoryAxis, valueAxis);

            equal(view.log.line.length, 1);
        });

        test("should not render gridlines for category axis", function() {
            var categoryAxis = {
                    categories: ["A"]
                };

            createPlotArea(categoryAxis);

            equal(view.log.line.length, 6);
        });

        test("should not render gridlines", function() {
            var categoryAxis = {
                    categories: ["A"],
                    majorGridLines: {
                        visible: false
                    }
                },
                valueAxis = {
                    majorGridLines: {
                        visible: false
                    }
                };

            createPlotArea(categoryAxis, valueAxis);

            equal(view.log.line.length, 0);
        });

        test("gridlines extend to secondary axis end", function() {
            var categoryAxis = {
                    categories: ["A"],
                    majorGridLines: {
                        visible: true
                    }
                },
                valueAxis = {
                    min: 0,
                    max: 10,
                    majorUnit: 3,
                    majorGridLines: {
                        visible: false
                    }
                };

            createPlotArea(categoryAxis, valueAxis);
            equal(view.log.line[0].x2, plotArea.valueAxis.lineBox().x2);
        });

        test("should not render gridlines for secondary value axis", function() {
            createPlotArea({
                categories: ["A"]
            }, [{}, {}]);

            equal(view.log.line.length, 6);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Major Gridlines / Panes", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("renders gridlines when value axis is in different pane", function() {
            createPlotArea({
                    categories: ["A"],
                    majorGridLines: {
                        visible: true
                    }
                }, {
                    pane: "bottom"
                }, {
                    panes: [{
                        name: "top"
                    }, {
                        name: "bottom"
                    }]
            });

            equal(view.log.line.length, 8);
        });

        test("renders grid lines in each pane", function() {
            createPlotArea({
                    categories: ["A"],
                    majorGridLines: {
                        visible: true
                    }
                }, [{
                    pane: "top"
                },{
                    pane: "bottom"
                }], {
                    panes: [{
                        name: "top"
                    }, {
                        name: "bottom"
                    }]
            });

            equal(view.log.line.length, 13);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Minor Gridlines", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("renders gridlines", function() {
            var categoryAxis = {
                    categories: ["A"],
                    majorGridLines: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                valueAxis = {
                    majorGridLines: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                };

            createPlotArea(categoryAxis, valueAxis);

            equal(view.log.line.length, 32);
        });

        test("should not render gridlines for numeric axis", function() {
            var categoryAxis = {
                    categories: ["A"],
                    majorGridLines: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                valueAxis = {
                    majorGridLines: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: false
                    }
                };

            createPlotArea(categoryAxis, valueAxis);

            equal(view.log.line.length, 2);
        });

        test("should not render gridlines for category axis", function() {
            var categoryAxis = {
                    categories: ["A"]
                },
                valueAxis = {
                    majorGridLines: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                };

            createPlotArea(categoryAxis, valueAxis);

            equal(view.log.line.length, 30);
        });

        test("should not render gridlines", function() {
            var categoryAxis = {
                    categories: ["A"]
                },
                valueAxis = {
                    majorGridLines: {
                        visible: false
                    }
                };

            createPlotArea(categoryAxis, valueAxis);

            equal(view.log.line.length, 0);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Major and Minor GridLines", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("should not render minor and major gridline to a same point", function() {
            var categoryAxis = {
                    categories: ["A"],
                    majorGridLines: {
                        visible: true
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                valueAxis = {
                    majorGridLines: {
                        visible: true
                    },
                    minorGridLines: {
                        visible: true
                    }
                };

            createPlotArea(categoryAxis, valueAxis);

            equal(view.log.line.length, 32);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Configuration", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("applies margin", function() {
            var plotArea = new dataviz.CategoricalPlotArea([{
                    data: [100]
                }], {
                categoryAxis: {
                    categories: ["A", "B"],
                    labels: { font: SANS12 }
                },
                valueAxis: {
                    labels: { font: SANS12 }
                },
                plotArea: {
                    margin: MARGIN,
                    background: "red"
                }
            });

            plotArea.reflow(chartBox);

            sameBox(plotArea.box, new Box2D(110, 110, 990, 990), TOLERANCE);
        });

        test("should render plot area with borders", function() {
            var categoryAxis = {
                    categories: ["A"]
                },
                valueAxis = { };

            createPlotArea(categoryAxis, valueAxis, {
                plotArea: {
                    border: {
                        color: "red",
                        width: 2,
                        dashType: "dot"
                    }
                }
            });

            var rect = view.log.rect[2];
            equal(rect.style.dashType, "dot");
            equal(rect.style.stroke, "red");
            equal(rect.style.strokeWidth, 2);
            deepEqual([rect.x1, rect.y1, rect.x2, rect.y2], [116, 100, 989.5, 976], TOLERANCE);
        });

        test("should render plot area background", function() {
            var categoryAxis = {
                    categories: ["A"]
                },
                valueAxis = { };

            createPlotArea(categoryAxis, valueAxis, {
                plotArea: {
                    background: "color"
                }
            });

            var rect = view.log.rect[1];
            equal(rect.style.fill, "color");
            deepEqual([rect.x1, rect.y1, rect.x2, rect.y2], [116, 100, 989.5, 976], TOLERANCE);
        });

        test("should set plot area background opacity", function() {
            var categoryAxis = {
                    categories: ["A"]
                },
                valueAxis = { };

            createPlotArea(categoryAxis, valueAxis, {
                plotArea: {
                    background: "color",
                    opacity: 0.5
                }
            });

            equal(view.log.rect[1].style.fillOpacity, 0.5);
        });

    })();

    (function() {
        var plotArea;

        function createPlotArea(options, series) {
            plotArea = new dataviz.CategoricalPlotArea(series || [{
                name: "Value A",
                type: "column",
                data: [100]
            }], kendo.deepExtend({
                categoryAxis: {
                    categories: ["A"]
                },
                valueAxis: { }
            }, options));

            plotArea.reflow(chartBox);
        }

        // ------------------------------------------------------------
        module("Categorical PlotArea / Panes / Vertical", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("default pane is created", function() {
            createPlotArea();

            equal(plotArea.panes.length, 1);
        });

        test("default pane height is same as plot area height", function() {
            createPlotArea();

            equal(plotArea.panes[0].box.height(), plotArea.box.height());
        });

        test("default pane width is same as plot area width", function() {
            createPlotArea();

            equal(plotArea.panes[0].box.width(), plotArea.box.width());
        });

        test("panes are created", function() {
            createPlotArea({
                panes: [{ name: "a" }, { name: "b" }]
            });

            equal(plotArea.panes.length, 2);
        });

        test("one chart is created per pane", function() {
            plotArea = new dataviz.CategoricalPlotArea([{
                name: "Value A",
                type: "column",
                data: [100]
            }, {
                name: "Value B",
                type: "column",
                data: [200]
            }], { });

            equal(plotArea.charts.length, 1);
        });

        test("two panes occupy 50% height each by default", function() {
            createPlotArea({
                panes: [{ name: "a" }, { name: "b" }]
            });

            var halfHeight = plotArea.box.height() / 2;
            equal(plotArea.panes[0].box.height(), halfHeight);
            equal(plotArea.panes[1].box.height(), halfHeight);
        });

        test("second pane is positioned below the first", function() {
            createPlotArea({
                panes: [{ name: "a" }, { name: "b" }]
            });

            equal(plotArea.panes[0].box.y1, 100);
            equal(plotArea.panes[1].box.y1, 550);
        });

        test("pane occupies set height in pixels", function() {
            createPlotArea({
                panes: [{ name: "a", height: 200 }, { name: "b" }]
            });

            equal(plotArea.panes[0].box.height(), 200);
        });

        test("pane occupies remaining height (in pixels)", function() {
            createPlotArea({
                panes: [{ name: "a", height: 200 }, { name: "b" }]
            });

            equal(plotArea.panes[1].box.height(), 700);
        });

        test("first pane occupies set height in percents", function() {
            createPlotArea({
                panes: [{ name: "a", height: "30%" }, { name: "b" }]
            });

            equal(plotArea.panes[0].box.height(), 270);
        });

        test("second pane occupies remaining height (in percents)", function() {
            createPlotArea({
                panes: [{ name: "a", height: "30%" }, { name: "b" }]
            });

            equal(plotArea.panes[1].box.height(), 630);
        });

        test("second pane occupies set height in percents", function() {
            createPlotArea({
                panes: [{ name: "a" }, { name: "b", height: "30%" }]
            });

            equal(plotArea.panes[1].box.height(), 270);
        });

        test("first pane occupies remaining height (in percents)", function() {
            createPlotArea({
                panes: [{ name: "a" }, { name: "b", height: "30%" }]
            });

            equal(plotArea.panes[0].box.height(), 630);
        });

        test("top margin is included in pane height", function() {
            createPlotArea({
                panes: [{
                    name: "a", height: 200, margin: { top: 10 }
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.panes[0].box.height(), 200);
            equal(plotArea.panes[1].box.height(), 700);
        });

        test("top margin is applied", function() {
            createPlotArea({
                panes: [{
                    name: "a", height: 200, margin: { top: 10 }
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.panes[0].paddingBox.y1, 110);
        });

        test("bottom margin is included in pane height", function() {
            createPlotArea({
                panes: [{
                    name: "a", height: 200, margin: { bottom: 10 }
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.panes[0].box.height(), 200);
            equal(plotArea.panes[1].box.height(), 700);
        });

        test("bottom margin is applied", function() {
            createPlotArea({
                panes: [{
                    name: "a", height: 200, margin: { bottom: 10 }
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.panes[0].paddingBox.y2, 290);
        });

        test("left margin is included in pane width", function() {
            createPlotArea({
                panes: [{
                    name: "a", margin: { left: 10 }
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.panes[0].box.width(), plotArea.panes[1].box.width());
        });

        test("left margin is applied to pane", function() {
            createPlotArea({
                panes: [{
                    name: "a", margin: { left: 10 }
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.panes[0].paddingBox.x1, 110);
        });

        test("left margin offsets value axis", function() {
            createPlotArea({
                panes: [{
                    name: "a", margin: { left: 10 }
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.valueAxis.box.x1, 110);
        });

        test("right margin is included in pane width", function() {
            createPlotArea({
                panes: [{
                    name: "a", margin: { right: 10 }
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.panes[0].box.width(), plotArea.panes[1].box.width());
        });

        test("right margin is applied to pane", function() {
            createPlotArea({
                panes: [{
                    name: "a", margin: { right: 10 }
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.panes[0].paddingBox.x2, 990);
        });

        test("right margin offsets value axis", function() {
            createPlotArea({
                panes: [{
                    name: "a", margin: { right: 10 }
                }, {
                    name: "b"
                }],
                categoryAxis: {
                    axisCrossingValue: 1
                }
            });

            equal(plotArea.valueAxis.box.x2, 990);
        });

        test("value axis is rendered in the first pane by default", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.valueAxis.box.y1, 100);
        });

        test("category axis is rendered in the first pane by default", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }]
            });

            equal(plotArea.categoryAxis.box.y1, 526);
        });

        test("value axis is moved to the associated pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: {
                    pane: "b"
                }
            });

            equal(plotArea.valueAxis.box.y1, 550);
        });

        test("value axis height matches the associated pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: {
                    pane: "b"
                }
            });

            var axisBox = plotArea.valueAxis.box;
            var paneBox = plotArea.panes[1].box;

            equal(axisBox.y1, paneBox.y1);
            equal(axisBox.y2, paneBox.y2);
        });

        test("category axis remains in the first pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: {
                    pane: "b"
                }
            });

            equal(plotArea.categoryAxis.box.y1, 526);
        });

        test("category axis fits in the first pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: {
                    pane: "b"
                }
            });

            equal(plotArea.categoryAxis.box.y2, plotArea.panes[0].box.y2);
        });

        test("category axis fits in the second pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                categoryAxis: {
                    pane: "b"
                }
            });

            equal(plotArea.categoryAxis.box.y2, plotArea.panes[1].box.y2);
        });

        test("right aligned value axis fits in the associated pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: {
                    pane: "b"
                },
                categoryAxis: {
                    axisCrossingValue: 1
                }
            });

            equal(plotArea.valueAxis.box.x2,
                   plotArea.panes[1].box.x2);
        });

        test("right aligned value axis height matches the associated pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: {
                    pane: "b"
                },
                categoryAxis: {
                    axisCrossingValue: 1
                }
            });

            var axisBox = plotArea.valueAxis.box;
            var paneBox = plotArea.panes[1].box;

            equal(axisBox.y1, paneBox.y1);
            equal(axisBox.y2, paneBox.y2);
        });

        test("secondary value axis is positioned in the designated pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: [{
                }, {
                    name: "secondary",
                    pane: "b"
                }]
            });

            equal(plotArea.namedValueAxes["secondary"].box.y1, 550);
        });

        test("secondary value axis is aligned to category axis", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: [{
                }, {
                    name: "secondary",
                    pane: "b",
                    labels: {
                        template: "long text"
                    }
                }]
            });

            equal(plotArea.namedValueAxes["secondary"].lineBox().x1,
                   plotArea.categoryAxis.lineBox().x1);
        });

        test("secondary value axis is aligned to category axis end", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: [{
                }, {
                    name: "secondary",
                    pane: "b"
                }],
                categoryAxis: {
                    axisCrossingValue: [0, 1]
                }
            });

            equal(plotArea.namedValueAxes["secondary"].lineBox().x1,
                   plotArea.categoryAxis.lineBox().x2);
        });

        test("right aligned secondary value axis fits in the associated pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: [{
                }, {
                    name: "secondary",
                    pane: "b"
                }],
                categoryAxis: {
                    axisCrossingValue: [0, 1]
                }
            });

            equal(plotArea.namedValueAxes["secondary"].box.x2 -
                   plotArea.panes[1].box.x2, 0);
        });

        test("left anchor axis is assigned per pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: [{
                }, {
                    name: "secondary",
                    pane: "b"
                }]
            });

            equal(plotArea.namedValueAxes["secondary"].box.x2,
                   plotArea.valueAxis.box.x2);
        });

        test("right anchor axis is assigned per pane", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }],
                valueAxis: [{
                }, {
                    name: "secondary",
                    pane: "b"
                }],
                categoryAxis: {
                    axisCrossingValue: [1, 1]
                }
            });

            equal(plotArea.namedValueAxes["secondary"].box.x1,
                   plotArea.valueAxis.box.x1);
        });

        test("chart pane determined by series axis", function() {
            plotArea = new dataviz.CategoricalPlotArea([{
                type: "column",
                data: [1],
                name: "series",
                axis: "b"
            }], {
                panes: [{
                    name: "top"
                }, {
                    name: "bottom"
                }],
                valueAxis: [{
                }, {
                    name: "b",
                    pane: "bottom"
                }]
            });

            equal(plotArea.panes[1].charts[0].options.series[0].name, "series");
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Panes / Title", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("title is not visible by default", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }]
            });

            var textBox = plotArea.panes[0].title;
            equal(textBox, null);
        });

        test("title is aligned in pane center", function() {
            createPlotArea({
                panes: [{
                    name: "a",
                    title: {
                        text: "Title",
                        align: "center"
                    }
                }]
            });

            var textBox = plotArea.panes[0].title.children[0];
            equal(textBox.box.x1, 528.5, TOLERANCE);
        });

        test("title is aligned left by default", function() {
            createPlotArea({
                panes: [{
                    name: "a",
                    title: {
                        text: "Title"
                    }
                }]
            });

            var textBox = plotArea.panes[0].title.children[0];
            equal(textBox.box.x1, 100);
        });

        test("title is aligned right", function() {
            createPlotArea({
                panes: [{
                    name: "a",
                    title: {
                        text: "Title",
                        align: "right"
                    }
                }]
            });

            var textBox = plotArea.panes[0].title.children[0];
            equal(textBox.box.x1, 957, TOLERANCE);
        });

        test("title text can be set directly", function() {
            createPlotArea({
                panes: [{
                    name: "a",
                    title: "Title"
                }]
            });

            var textBox = plotArea.panes[0].title.children[0];
            equal(textBox.children[0].content, "Title");
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Panes / redraw", {
            setup: function() {
                moduleSetup();

                createPlotArea({
                    categoryAxis: {
                        name: "cAxis"
                    },
                    valueAxis: {
                        name: "vAxis"
                    },
                    panes: [{
                        name: "a"
                    }, {
                        name: "b"
                    }]
                    }, [{
                        type: "column",
                        data: [1000],
                        axis: "vAxis"
                    }]
                );
            },
            teardown: moduleTeardown
        });

        test("Removes pane axes from plotArea.axes collection", function() {
            plotArea.axes[1].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.axes[1].dirty);
        });

        test("Removes pane axes from namedCategoryAxes collection", function() {
            plotArea.namedCategoryAxes["cAxis"].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.namedCategoryAxes["cAxis"].dirty);
        });

        test("Removes pane axes from namedValueAxes collection", function() {
            plotArea.namedValueAxes["vAxis"].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.namedValueAxes["vAxis"].dirty);
        });

        test("Removes pane axes from pane.axes collection", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }]
            });

            plotArea.panes[0].axes[0].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.panes[0].axes[0].dirty);
        });

        test("Resets range tracker for pane value axes", function() {
            plotArea.series[0].data[0] = 10;
            plotArea.redraw(plotArea.panes[0]);

            equal(plotArea.valueAxisRangeTracker.query("vAxis").max, 10);
        });

        test("Resets range tracker for pane value axes (empty series)", function() {
            plotArea.series[0].data[0] = undefined;
            plotArea.redraw(plotArea.panes[0]);

            deepEqual(plotArea.valueAxisRangeTracker.query("vAxis"), undefined);
        });

        test("Updates plotArea.categoryAxis alias", function() {
            plotArea.panes[0].axes[0].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.categoryAxis.dirty);
        });

        test("Updates plotArea.valueAxis alias", function() {
            plotArea.panes[0].axes[1].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.valueAxis.dirty);
        });

        test("Updates plotArea.axisX alias", function() {
            plotArea.panes[0].axes[0].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.axisX.dirty);
        });

        test("Does not update plotArea.axisX alias if axis is not primary", function() {
            plotArea.axisX.dirty = true;
            plotArea.redraw(plotArea.panes[1]);

            ok(plotArea.axisX.dirty);
        });

        test("Updates plotArea.axisY alias", function() {
            plotArea.panes[0].axes[1].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.axisY.dirty);
        });

        test("Does not update plotArea.axisY alias if axis is not primary", function() {
            plotArea.axisY.dirty = true;
            plotArea.redraw(plotArea.panes[1]);

            ok(plotArea.axisY.dirty);
        });

        test("clears pane", function() {
            plotArea.panes[0].content.children[0].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.panes[0].content.children[0].dirty);
        });

        test("reflows pane", function() {
            var x = plotArea.axes[0].box.x1;

            plotArea.series[0].data[0] = 10;
            plotArea.redraw(plotArea.panes[0]);

            notEqual(plotArea.axes[0].box.x1, x);
        });

        test("replaces pane in DOM", function() {
            var chart = createChart({
                series: [{
                    type: "column",
                    data: [1000]
                }]
            });

            plotArea = chart._model.children[1];
            var paneId = plotArea.panes[0].id;
            var element = getElement(paneId);

            plotArea.series[0].data[0] = 10;
            plotArea.redraw(plotArea.panes[0]);

            notEqual(getElement(paneId), element);

            destroyChart();
        });

        test("partial reflows account for axes in other panes", function() {
            createPlotArea({
                categoryAxis: [{
                    name: "cAxis"
                }, {
                    name: "cAxisB",
                    pane: "b",
                    categories: [
                        "Looooooooooooooooooooooooooooooooooooooooooooooooooooooong"
                    ]
                }],
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }]
                }, [{
                    type: "column",
                    data: [1000]
                }]
            );

            var box = plotArea.namedCategoryAxes.cAxisB.box;
            plotArea.redraw(plotArea.panes[1]);

            sameBox(plotArea.namedCategoryAxes.cAxisB.box, box);
        });

        // ------------------------------------------------------------
        module("Categorical PlotArea / Panes / redraw / batch", {
            setup: function() {
                moduleSetup();

                createPlotArea({
                    categoryAxis: {
                        name: "cAxis"
                    },
                    valueAxis: {
                        name: "vAxis"
                    },
                    panes: [{
                        name: "a"
                    }, {
                        name: "b"
                    }]
                    }, [{
                        type: "column",
                        data: [1000],
                        axis: "vAxis"
                    }]
                );
            },
            teardown: moduleTeardown
        });

        test("redraws multiple panes", function() {
            createPlotArea({
                categoryAxis: {
                    name: "cAxis"
                },
                valueAxis: [{
                    name: "vAxis"
                }, {
                    name: "vAxisB",
                    pane: "b"
                }, {
                    name: "vAxisC",
                    pane: "c"
                }],
                panes: [{
                    name: "a"
                }, {
                    name: "b"
                }, {
                    name: "c"
                }]
                }, [{
                    type: "column",
                    data: [1000],
                    axis: "vAxis"
                }]
            );

            plotArea.namedValueAxes.vAxisC.dirty = true;
            plotArea.redraw([plotArea.panes[0], plotArea.panes[1]]);

            ok(plotArea.namedValueAxes.vAxisC.dirty);
        });

    })();

    (function() {
        var chart,
            bar,
            barElement,
            plotArea,
            plotAreaElement;

        var TOLERANCE = 5;

        function createBarChart(options) {
            chart = createChart($.extend({
                series: [{
                    type: "bar",
                    data: [1, 2]
                }],
                categoryAxis: {
                    categories: ["A", "B"]
                },
                chartArea: {
                    width: 1664,
                    height: 400
                }
            }, options));

            $("#container").css({
                position: "absolute", top: "200px", left: "8px"
            });

            plotArea = chart._model.children[1];
            bar = plotArea.charts[0].points[0];
            barElement = getElement(bar.id);
            plotAreaElement = getElement(plotArea.id);
        }

        // ------------------------------------------------------------
        module("Categorical Plot Area / Events / plotAreaClick", {
            teardown: destroyChart
        });

        test("point click bubbles to plot area", 1, function() {
            createBarChart({
                plotAreaClick: function() { ok(true); }
            });

            clickChart(chart, barElement, 300, 300);
        });

        test("fires when clicking plot area directly", 1, function() {
            createBarChart({
                plotAreaClick: function() { ok(true); }
            });

            clickChart(chart, plotAreaElement, 300, 300);
        });

        test("does not fire when clicking outside of axis range", 0, function() {
            createBarChart({
                plotAreaClick: function() { ok(false); }
            });

            clickChart(chart, plotAreaElement, 300, 580);
        });

        test("does not fire when clicking on axes", 0, function() {
            createBarChart({
                plotAreaClick: function() { ok(false); }
            });

            clickChart(chart, plotAreaElement, 3000, 0);
        });

        test("event arguments contain value", 1, function() {
            createBarChart({
                plotAreaClick: function(e) { close(e.value, 0.4, TOLERANCE); }
            });

            clickChart(chart, plotAreaElement, 300, 400);
        });

        test("event arguments contain multiple values", 2, function() {
            createBarChart({
                valueAxis: [{}, { name: "b", min: 100, max: 1000 }],
                plotAreaClick: function(e) { arrayClose(e.value, [1, 250], TOLERANCE); }
            });

            clickChart(chart, plotAreaElement, 300, 300);
        });

        test("event arguments contain category", 1, function() {
            createBarChart({
                plotAreaClick: function(e) { equal(e.category, "A"); }
            });

            clickChart(chart, plotAreaElement, 300, 300);
        });

        test("event arguments contain empty category", 1, function() {
            createBarChart({
                categoryAxis: {
                    categories: ["A"]
                },
                plotAreaClick: function(e) { equal(e.category, ""); }
            });

            clickChart(chart, plotAreaElement, 300, 400);
        });

        test("event arguments contain all categories", 1, function() {
            createBarChart({
                categoryAxis: [{
                    categories: ["A", "B"]
                }, {
                    categories: ["a", "b"]
                }],
                plotAreaClick: function(e) { deepEqual(e.category, ["A", "a"]); }
            });

            clickChart(chart, plotAreaElement, 300, 300);
        });

        test("event arguments contain categories when second axis is moved", 1, function() {
            createBarChart({
                categoryAxis: [{
                    categories: ["A", "B"]
                }, {
                    categories: ["a", "b"]
                }],
                valueAxis: {
                    axisCrossingValue: [0, 100]
                },
                plotAreaClick: function(e) { deepEqual(e.category, ["A", "a"]); }
            });

            clickChart(chart, plotAreaElement, 300, 300);
        });

        test("event arguments contain date category", 1, function() {
            var date = new Date("2012/09/15");
            createBarChart({
                categoryAxis: {
                    categories: [date]
                },
                plotAreaClick: function(e) { equal(e.category.toString(), date.toString()); }
            });

            clickChart(chart, plotAreaElement, 300, 300);
        });

        // ------------------------------------------------------------
        function createChartWithPanes(plotAreaClick) {
            chart = createChart({
                panes: [{
                    name: "top"
                }, {
                    name: "bottom"
                }],
                categoryAxis: [{
                    name: "catA",
                    pane: "top",
                    categories: ["A", "B"]
                }, {
                    name: "catB",
                    pane: "bottom",
                    categories: ["C"]
                }],
                valueAxis: [{
                    name: "valA",
                    pane: "top"
                }, {
                    name: "valB",
                    pane: "bottom"
                }],
                series: [{
                    axis: "valA",
                    categoryAxis: "catA",
                    data: [1, 2]
                }, {
                    axis: "valB",
                    categoryAxis: "catB",
                    data: [10]
                }],
                plotAreaClick: plotAreaClick,
                chartArea: {
                    width: 1664,
                    height: 400
                }
            });

            $("#container").css({
                position: "absolute", top: "200px", left: "8px"
            });

            plotArea = chart._model.children[1];
            plotAreaElement = getElement(plotArea.id);
        }

        module("Categorical Plot Area / Events / plotAreaClick / Panes", {
            teardown: destroyChart
        });

        test("categories are scoped to pane", 1, function() {
            createChartWithPanes(
                function(e) {
                    deepEqual(e.category, "C");
                }
            );

            clickChart(chart, plotAreaElement, 300, 450);
        });

        test("values are scoped to pane", 1, function() {
            createChartWithPanes(
                function(e) {
                    close(e.value, 9, TOLERANCE);
                }
            );

            clickChart(chart, plotAreaElement, 300, 450);
        });

        test("uses primary category axis if the pane lacks one", 1, function() {
            chart = createChart({
                panes: [{
                    name: "top"
                }, {
                    name: "bottom"
                }],
                categoryAxis: {
                    pane: "bottom",
                    categories: ["A", "B"]
                },
                valueAxis: {
                    pane: "top"
                },
                series: [{
                    data: [1, 2]
                }],
                plotAreaClick: function(e) {
                    equal(e.category, "A")
                },
                chartArea: {
                    width: 1664,
                    height: 400
                }
            });

            $("#container").css({
                position: "absolute", top: "200px", left: "8px"
            });

            plotArea = chart._model.children[1];

            clickChart(chart, plotAreaElement, 300, 300);
        });

    })();

    (function() {
        var plotArea,
            categoryAxis,
            namedXAxes,
            namedYAxes,
            axisX,
            secondaryXAxis,
            axisY,
            secondaryYAxis,
            scatterSeriesData = [{
                name: "Value A",
                type: "scatter",
                data: [[100, 100], [200, 200], [300, 300]]
            }, {
                name: "Value B",
                type: "scatter",
                data: [[10, 10], [20, 20], [30, 30]]
            }];

        function createPlotArea(series, options) {
            plotArea = new dataviz.XYPlotArea(series, options);

            axisX = plotArea.axisX;
            axisY = plotArea.axisY;
            namedXAxes = plotArea.namedXAxes;
            namedYAxes = plotArea.namedYAxes;
            secondaryXAxis = namedXAxes.secondary;
            secondaryYAxis = namedYAxes.secondary;

            chartSeries = plotArea.charts[0];
        }

        function assertAxisRange(axis, min, max, series, options) {
            var fn = dataviz.XYPlotArea.fn;
            stubMethod(fn, "createAxes",
                function(panes) {
                    fn._stubbed["createAxes"].call(this, panes);
                    deepEqual(this[axis].options.min, min);
                    deepEqual(this[axis].options.max, max);
                },
                function() {
                    plotArea = createPlotArea(series, options);
                }
            );
        }

        // ------------------------------------------------------------
        module("XY PlotArea / Axes", {
            setup: function() {
                moduleSetup();

                createPlotArea(scatterSeriesData);
            },
            teardown: moduleTeardown
        });

        test("appends primary X axis to pane content", function() {
            ok($.inArray(axisX, plotArea.panes[0].content.children) >= 0);
        });

        test("appends primary Y axis to pane content", function() {
            ok($.inArray(axisY, plotArea.panes[0].content.children) >= 0);
        });

        test("aligns axes at default crossing values", function() {
            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValue),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValue);
            deepEqual([crossingSlotY.x1, crossingSlotY.y1], [crossingSlotX.x1, crossingSlotX.y1]);
        });

        test("aligns axises at non-default crossing values", function() {
            axisY.options.axisCrossingValue = 10;
            axisX.options.axisCrossingValue = 1;

            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValue),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValue);
            deepEqual([crossingSlotY.x1, crossingSlotY.y1], [crossingSlotX.x1, crossingSlotX.y1], TOLERANCE);
        });

        test("X axis limit is [0, 1.2] when no series are configured", 2, function() {
            assertAxisRange("axisX", 0, 1.2, []);
        });

        test("Y axis limit is [0, 1.2] when no series are configured", 2, function() {
            assertAxisRange("axisY", 0, 1.2, []);
        });

        test("sets named primary X axis range (impl. series axis)", 2, function() {
            assertAxisRange("axisX", 0, 120,
                [{ type: "scatter", data: [[100, 0]] }],
                { xAxis: { name: "A" } }
            );
        });

        test("sets named primary X axis range (expl. series axis)", 2, function() {
            assertAxisRange("axisX", 0, 120,
                [{ type: "scatter", data: [[100, 0]], xAxis: "A" }],
                { xAxis: { name: "A" } }
            );
        });

        test("sets named primary X axis range (impl. series axis, 0 < value < 1)", 2, function() {
            assertAxisRange("axisX", 0, .12,
                [{ type: "scatter", data: [[.10, 0]] }],
                { xAxis: { name: "A" } }
            );
        });

        test("sets named primary X axis range (expl. series axis, 0 < value < 1)", 2, function() {
            assertAxisRange("axisX", 0, .12,
                [{ type: "scatter", data: [[.10, 0]], xAxis: "A" }],
                { xAxis: { name: "A" } }
            );
        });

        test("sets named primary X axis range (implicit series axis)", 2, function() {
            assertAxisRange("axisX", 0, 350, scatterSeriesData, { xAxis: { name: "A" } });
        });

        test("sets primary X axis range (date values as strings)", 2, function() {
            assertAxisRange("axisX", new Date("2012/01/31 00:00:00"), new Date("2012/02/03 00:00:00"),
                [{
                    type: "scatter",
                    data: [["2012/02/01 00:00:00", 0]]
                }, {
                    type: "scatter",
                    data: [["2012/02/02 00:00:00", 0]]
                }], {
                    xAxis: { type: "date" }
                }
            );
        });

        test("sets named primary Y axis range (impl. series axis)", 2, function() {
            assertAxisRange("axisY", 0, 120,
                [{ type: "scatter", data: [[0, 100]] }],
                { yAxis: { name: "A" } }
            );
        });

        test("sets named primary Y axis range (expl. series axis)", 2, function() {
            assertAxisRange("axisY", 0, 120,
                [{ type: "scatter", data: [[0, 100]], yAxis: "A" }],
                { yAxis: { name: "A" } }
            );
        });

        test("sets named primary Y axis range (impl. series axis, 0 < value < 1)", 2, function() {
            assertAxisRange("axisY", 0, .12,
                [{ type: "scatter", data: [[0, .1]] }],
                { yAxis: { name: "A" } }
            );
        });

        test("sets named primary Y axis range (expl. series axis, 0 < value < 1)", 2, function() {
            assertAxisRange("axisY", 0, .12,
                [{ type: "scatter", data: [[0, .1]], yAxis: "A" }],
                { yAxis: { name: "A" } }
            );
        });

        test("sets named primary Y axis range (implicit series axis)", function() {
            assertAxisRange("axisY", 0, 350, scatterSeriesData, { yAxis: { name: "A" } });
        });

        test("creates Numeric axes by default", function() {
            ok(plotArea.axisX instanceof dataviz.NumericAxis);
            ok(plotArea.axisY instanceof dataviz.NumericAxis);
        });

        test("creates Date value axes", function() {
            createPlotArea(scatterSeriesData, {
                xAxis: {
                    type: "date"
                },
                yAxis: {
                    type: "date"
                }
            });

            ok(plotArea.axisX instanceof dataviz.DateValueAxis);
            ok(plotArea.axisY instanceof dataviz.DateValueAxis);
        });

        test("creates Date value axes with capitalized type", function() {
            createPlotArea(scatterSeriesData, {
                xAxis: {
                    type: "Date"
                },
                yAxis: {
                    type: "Date"
                }
            });

            ok(plotArea.axisX instanceof dataviz.DateValueAxis);
            ok(plotArea.axisY instanceof dataviz.DateValueAxis);
        });

        test("Automatically detects date X axis", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                data: [[new Date(2012, 02, 01), 100]]
            }]);

            deepEqual(plotArea.axisX.options.type, "date");
        });

        test("Automatically detects date X axis for bound series", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                xField: "x",
                yField: "y",
                data: [{ x: new Date(2012, 02, 01), y: 100 }]
            }]);

            deepEqual(plotArea.axisX.options.type, "date");
        });

        test("Automatically detects named date X axis for bound series", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                xField: "x",
                yField: "y",
                data: [{ x: new Date(2012, 02, 01), y: 100 }]
            }], {
                xAxis: {
                    name: "axis"
                }
            });

            deepEqual(plotArea.axisX.options.type, "date");
        });

        test("Automatically detects date X axis from min setting", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                data: []
            }], {
                xAxis: {
                    min: new Date(2012, 02, 01)
                }
            });

            deepEqual(plotArea.axisX.options.type, "date");
        });

        test("Automatically detects date X axis from max setting", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                data: []
            }], {
                xAxis: {
                    max: new Date(2012, 02, 01)
                }
            });

            deepEqual(plotArea.axisX.options.type, "date");
        });

        test("Automatic detection of X axis can be overriden", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                data: [[new Date(2012, 02, 01), 100]]
            }], {
                xAxis: {
                    type: "numeric"
                }
            });

            ok(plotArea.axisX instanceof kendo.dataviz.NumericAxis);
        });

        test("Automatic detection of X axis can be overriden (capitalized)", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                data: [[new Date(2012, 02, 01), 100]]
            }], {
                xAxis: {
                    type: "Numeric"
                }
            });

            ok(plotArea.axisX instanceof kendo.dataviz.NumericAxis);
        });

        test("Automatically detects date Y axis", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                data: [[100, new Date(2012, 02, 01)]]
            }]);

            deepEqual(plotArea.axisY.options.type, "date");
        });

        test("Automatically detects date Y axis for bound series", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                xField: "x",
                yField: "y",
                data: [{ x: 100, y: new Date(2012, 02, 01) }]
            }]);

            deepEqual(plotArea.axisY.options.type, "date");
        });

        test("Automatically detects named date Y axis for bound series", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                xField: "x",
                yField: "y",
                data: [{ x: 100, y: new Date(2012, 02, 01) }]
            }], {
                yAxis: {
                    name: "axis"
                }
            });

            deepEqual(plotArea.axisY.options.type, "date");
        });

        test("Automatically detects date Y axis from min setting", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                data: []
            }], {
                yAxis: {
                    min: new Date(2012, 02, 01)
                }
            });

            deepEqual(plotArea.axisY.options.type, "date");
        });

        test("Automatically detects date Y axis from max setting", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                data: []
            }], {
                yAxis: {
                    max: new Date(2012, 02, 01)
                }
            });

            deepEqual(plotArea.axisY.options.type, "date");
        });

        test("Automatic detection of Y axis can be overriden", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                data: [[100, new Date(2012, 02, 01)]]
            }], {
                yAxis: {
                    type: "numeric"
                }
            });

            ok(plotArea.axisY instanceof kendo.dataviz.NumericAxis);
        });

        test("Automatic detection of Y axis can be overriden (capitalized)", function() {
            createPlotArea([{
                name: "Value A",
                type: "scatter",
                data: [[100, new Date(2012, 02, 01)]]
            }], {
                yAxis: {
                    type: "Numeric"
                }
            });

            ok(plotArea.axisY instanceof kendo.dataviz.NumericAxis);
        });

        // ------------------------------------------------------------
        module("XY PlotArea / Multiple Axes", {
            setup: function() {
                moduleSetup();

                createPlotArea(scatterSeriesData, {
                    xAxis: [{}, {
                        name: "secondary"
                    }],
                    yAxis: [{}, {
                        name: "secondary"
                    }]
                });
            },
            teardown: moduleTeardown
        });

        test("assigns axisX alias to first named X axis", function() {
            createPlotArea(scatterSeriesData, {
                xAxis: [{ name: "a" }, { name: "b" }]
            });

            equal(plotArea.axisX.options.name, "a");
        });

        test("assigns axisY alias to first named Y axis", function() {
            createPlotArea(scatterSeriesData, {
                yAxis: [{ name: "a" }, { name: "b" }]
            });

            equal(plotArea.axisY.options.name, "a");
        });

        test("secondary X axis added to pane content", function() {
            ok($.inArray(secondaryXAxis, plotArea.panes[0].content.children) >= 0);
        });

        test("secondary Y axis added to pane content", function() {
            ok($.inArray(secondaryYAxis, plotArea.panes[0].content.children) >= 0);
        });

        test("aligns primary axes at default crossing values", function() {
            plotArea.reflow(chartBox);

            var crossingSlotY = axisY.getSlot(axisY.options.axisCrossingValue),
                crossingSlotX = axisX.getSlot(axisX.options.axisCrossingValue);
            deepEqual([crossingSlotY.x1, crossingSlotY.y1], [crossingSlotX.x1, crossingSlotX.y1]);
        });

        test("secondary X axis on the right is contained in plot area", function() {
            createPlotArea(scatterSeriesData, {
                xAxis: [{ min: -350 }, { name: "secondary" }],
                yAxis: { axisCrossingValue: [0, 100], min: -350 }
            });

            plotArea.reflow(chartBox);

            equal(secondaryXAxis.lineBox().x2, axisX.lineBox().x2);
        });

        test("secondary X axis on the left is contained in plot area", function() {
            createPlotArea(scatterSeriesData, {
                xAxis: [{ min: -350 }, { name: "secondary", min: -1, max: 0 }],
                yAxis: { axisCrossingValue: [0, 100], min: -350 }
            });

            plotArea.reflow(chartBox);

            equal(secondaryXAxis.lineBox().x1, axisX.lineBox().x1);
        });

        test("secondary Y axis on top is contained in plot area", function() {
            createPlotArea(scatterSeriesData, {
                xAxis: { axisCrossingValue: [0, 100], min: -350 },
                yAxis: [{ min: -350 }, { name: "secondary" }]
            });

            plotArea.reflow(chartBox);

            equal(secondaryYAxis.lineBox().y1, axisY.lineBox().y1, TOLERANCE);
        });

        test("secondary Y axis on bottom is contained in plot area", function() {
            createPlotArea(scatterSeriesData, {
                xAxis: { axisCrossingValue: [0, 100], min: -350 },
                yAxis: [{ min: -350 }, { name: "secondary", min: -1, max: 0 }]
            });

            plotArea.reflow(chartBox);

            equal(secondaryYAxis.lineBox().y2, axisY.lineBox().y2);
        });

        test("Throws error when X axis name is duplicate", function() {
            raises(function() {
                plotArea = createPlotArea(scatterSeriesData, {
                    xAxis: [{
                        name: "b"
                    }, {
                        name: "b"
                    }]
                });
            },
            /X axis with name b is already defined/);
        });

        test("Throws error when Y axis name is duplicate", function() {
            raises(function() {
                plotArea = createPlotArea(scatterSeriesData, {
                    yAxis: [{
                        name: "b"
                    }, {
                        name: "b"
                    }]
                });
            },
            /Y axis with name b is already defined/);
        });

        // ------------------------------------------------------------
        module("XY PlotArea / Multiple Axes / Stacked Top", {
            setup: function() {
                moduleSetup();

                createPlotArea(scatterSeriesData, {
                    xAxis: [{}, { name: "secondary" }],
                    yAxis: { axisCrossingValue: 10000 }
                });
            },
            teardown: moduleTeardown
        });

        test("overlapping X axes are shifted to the top", function() {
            var margin = secondaryXAxis.options.margin;

            plotArea.reflow(chartBox);

            equal(secondaryXAxis.box.y2, axisX.box.y1 - margin);
        });

        test("X axis can be superimposed using options._overlap", function() {
            axisX.options._overlap = true;
            secondaryXAxis.options._overlap = true;

            plotArea.reflow(chartBox);

            deepEqual(secondaryXAxis.box.y1, axisX.box.y1);
        });

        test("stacked X axes on top are aligned", function() {
            plotArea.reflow(chartBox);

            deepEqual([secondaryXAxis.lineBox().x1, secondaryXAxis.lineBox().x2],
                 [axisX.lineBox().x1, axisX.lineBox().x2]
            );
        });

        test("stacked X axes on the top are mirrored", function() {
            plotArea.reflow(chartBox);

            ok(axisX.options.labels.mirror);
            ok(secondaryXAxis.options.labels.mirror);
        });

        test("mirroring inverts the mirror option", function() {
            axisX.options.labels.mirror = true;

            plotArea.reflow(chartBox);

            ok(!axisX.options.labels.mirror);
        });

        // ------------------------------------------------------------
        module("XY PlotArea / Multiple Axes / Stacked Right", {
            setup: function() {
                moduleSetup();

                createPlotArea(scatterSeriesData, {
                    xAxis: { axisCrossingValue: 10000 },
                    yAxis: [{}, { name: "secondary" }]
                });
            },
            teardown: moduleTeardown
        });

        test("overlapping Y axes are shifted to the right", function() {
            var margin = secondaryYAxis.options.margin;

            plotArea.reflow(chartBox);

            deepEqual([secondaryYAxis.box.x1, secondaryYAxis.box.y1],
                 [axisY.box.x2 + margin, axisY.box.y1]
            );
        });

        test("Y axis can be superimposed using options._overlap", function() {
            axisY.options._overlap = true;
            secondaryYAxis.options._overlap = true;

            plotArea.reflow(chartBox);

            deepEqual(secondaryYAxis.box.x2, axisY.box.x2);
        });

        test("stacked Y axes on right are aligned", function() {
            plotArea.reflow(chartBox);

            deepEqual([secondaryYAxis.lineBox().y1, secondaryYAxis.lineBox().y2],
                 [axisY.lineBox().y1, axisY.lineBox().y2]
            );
        });

        test("stacked Y axes on the right are mirrored", function() {
            plotArea.reflow(chartBox);

            ok(axisY.options.labels.mirror);
            ok(secondaryYAxis.options.labels.mirror);
        });

        test("mirroring inverts the mirror option", function() {
            axisY.options.labels.mirror = true;

            plotArea.reflow(chartBox);

            ok(!axisY.options.labels.mirror);
        });

        // ------------------------------------------------------------
        module("XY PlotArea / Multiple Axes / Stacked Bottom", {
            setup: function() {
                moduleSetup();

                createPlotArea(scatterSeriesData, {
                    xAxis: [{}, { name: "secondary" }]
                });
            },
            teardown: moduleTeardown
        });

        test("overlapping X axes are shifted to the bottom", function() {
            var margin = secondaryXAxis.options.margin;

            plotArea.reflow(chartBox);

            deepEqual(secondaryXAxis.box.y1, axisX.box.y2 + margin);
        });

        test("stacked X axes on bottom are aligned", function() {
            plotArea.reflow(chartBox);

            deepEqual([secondaryXAxis.lineBox().x1, secondaryXAxis.lineBox().x2],
                 [axisX.lineBox().x1, axisX.lineBox().x2]
            );
        });

        test("stacked X axes on the bottom are not mirrored", function() {
            plotArea.reflow(chartBox);

            ok(!axisX.options.labels.mirror);
            ok(!secondaryXAxis.options.labels.mirror);
        });

        test("user set mirror option is not changed", function() {
            axisX.options.labels.mirror = true;

            plotArea.reflow(chartBox);

            ok(axisX.options.labels.mirror);
        });

        // ------------------------------------------------------------
        module("XY PlotArea / Multiple Axes / Stacked Left", {
            setup: function() {
                moduleSetup();

                createPlotArea(scatterSeriesData, {
                    yAxis: [{}, { name: "secondary" }]
                });
            },
            teardown: moduleTeardown
        });

        test("overlapping Y axes are stacked to the left", function() {
            var margin = secondaryYAxis.options.margin;

            plotArea.reflow(chartBox);

            deepEqual([secondaryYAxis.box.x2, secondaryYAxis.box.y1],
                 [axisY.box.x1 - margin, axisY.box.y1]
            );
        });

        test("stacked Y axes on left are aligned", function() {
            plotArea.reflow(chartBox);

            deepEqual([secondaryYAxis.lineBox().y1, secondaryYAxis.lineBox().y2],
                 [axisY.lineBox().y1, axisY.lineBox().y2]
            );
        });

        test("stacked Y axes on the left are not mirrored", function() {
            plotArea.reflow(chartBox);

            ok(!axisY.options.labels.mirror);
            ok(!secondaryYAxis.options.labels.mirror);
        });

        test("user set mirror option is not changed", function() {
            axisY.options.labels.mirror = true;

            plotArea.reflow(chartBox);

            ok(axisY.options.labels.mirror);
        });

        // ------------------------------------------------------------
        module("XY PlotArea / Scatter series", {
            setup: function() {
                moduleSetup();

                createPlotArea(scatterSeriesData);
            },
            teardown: moduleTeardown
        });

        test("Scatter chart added to pane content", function() {
            ok($.inArray(chartSeries, plotArea.panes[0].content.children) >= 0);
        });

        // ------------------------------------------------------------
        module("XY PlotArea / Bubble series", {
            setup: function() {
                moduleSetup();

                createPlotArea([{
                              type: "bubble",
                              data: []
                }]);
            },
            teardown: moduleTeardown
        });

        test("Bubble chart added to pane content", function() {
            ok($.inArray(chartSeries, plotArea.panes[0].content.children) >= 0);
        });

        // ------------------------------------------------------------
        module("XY PlotArea / Scatter line series", {
            setup: function() {
                moduleSetup();

                createPlotArea([{ type: "scatterLine", data: [] }]);
            },
            teardown: moduleTeardown
        });

        test("Scatter line chart added to pane content", function() {
            ok($.inArray(chartSeries, plotArea.panes[0].content.children) >= 0);
        });

        // ------------------------------------------------------------
        module("XY PlotArea / Panes / Redraw", {
            setup: function() {
                moduleSetup();

                createPlotArea([{
                        type: "scatter",
                        xAxis: "xAxis",
                        yAxis: "yAxis",
                        data: [[1000, 1000]]
                    }], {
                        xAxis: {
                            name: "xAxis"
                        },
                        yAxis: {
                            name: "yAxis"
                        },
                        panes: [{
                            name: "a"
                        }, {
                            name: "b"
                        }]
                    }
                );

                plotArea.reflow(chartBox);
            },
            teardown: moduleTeardown
        });

        test("Removes pane axes from plotArea.axes collection", function() {
            plotArea.axes[1].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.axes[1].dirty);
        });

        test("Removes pane axes from namedXAxes collection", function() {
            plotArea.namedXAxes["xAxis"].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.namedXAxes["xAxis"].dirty);
        });

        test("Removes pane axes from namedYAxes collection", function() {
            plotArea.namedYAxes["yAxis"].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.namedYAxes["yAxis"].dirty);
        });

        test("Removes pane axes from pane.axes collection", function() {
            createPlotArea({
                panes: [{
                    name: "a"
                }]
            });
            plotArea.reflow(chartBox);

            plotArea.panes[0].axes[0].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.panes[0].axes[0].dirty);
        });

        test("Resets range tracker for pane x axes", function() {
            plotArea.series[0].data[0][0] = 10;
            plotArea.redraw(plotArea.panes[0]);

            equal(plotArea.xAxisRangeTracker.query("xAxis").max, 10);
        });

        test("Resets range tracker for pane x axes (empty series)", function() {
            plotArea.series[0].data[0][0] = undefined;
            plotArea.redraw(plotArea.panes[0]);

            deepEqual(plotArea.xAxisRangeTracker.query("xAxis"), undefined);
        });

        test("Resets range tracker for pane y axes", function() {
            plotArea.series[0].data[0][1] = 10;
            plotArea.redraw(plotArea.panes[0]);

            equal(plotArea.yAxisRangeTracker.query("yAxis").max, 10);
        });

        test("Resets range tracker for pane y axes (empty series)", function() {
            plotArea.series[0].data[0][1] = undefined;
            plotArea.redraw(plotArea.panes[0]);

            deepEqual(plotArea.yAxisRangeTracker.query("yAxis"), undefined);
        });

        test("Updates plotArea.axisX alias", function() {
            plotArea.panes[0].axes[0].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.axisX.dirty);
        });

        test("Does not update plotArea.axisX alias if axis is not primary", function() {
            plotArea.axisX.dirty = true;
            plotArea.redraw(plotArea.panes[1]);

            ok(plotArea.axisX.dirty);
        });

        test("Updates plotArea.axisY alias", function() {
            plotArea.panes[0].axes[1].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.axisY.dirty);
        });

        test("Does not update plotArea.axisY alias if axis is not primary", function() {
            plotArea.axisY.dirty = true;
            plotArea.redraw(plotArea.panes[1]);

            ok(plotArea.axisY.dirty);
        });

        test("clears pane", function() {
            plotArea.panes[0].content.children[0].dirty = true;
            plotArea.redraw(plotArea.panes[0]);

            ok(!plotArea.panes[0].content.children[0].dirty);
        });

        test("reflows pane", function() {
            var x = plotArea.axes[0].box.x1;

            plotArea.series[0].data[0] = 10;
            plotArea.redraw(plotArea.panes[0]);

            notEqual(plotArea.axes[0].box.x1, x);
        });

    })();

    (function() {
        var chart,
            point,
            pointElement,
            plotArea,
            plotAreaElement,
            TOLERANCE = 1;

        function createScatterChart(options) {
            chart = createChart($.extend({
                series: [{
                    name: "Value A",
                    type: "scatter",
                    data: [[100, 100]]
                }],
                chartArea: {
                    width: 1664,
                    height: 400
                }
            }, options));

            $("#container").css({
                position: "absolute", top: "200px", left: "8px"
            });

            plotArea = chart._model.children[1];
            plotAreaElement = getElement(plotArea.id);
            point = plotArea.charts[0].points[0];
            pointElement = $(getElement(point.id));
        }

        // ------------------------------------------------------------
        module("XY Plot Area / Events / plotAreaClick", {
            teardown: destroyChart
        });

        test("point click bubbles to plot area", 1, function() {
            createScatterChart({
                plotAreaClick: function() { ok(true); }
            });

            clickChart(chart, plotAreaElement, 300, 300);
        });

        test("fires when clicking plot area directly", 1, function() {
            createScatterChart({
                plotAreaClick: function() { ok(true); }
            });

            clickChart(chart, plotAreaElement, 300, 300);
        });

        test("does not fire when clicking outside of axis range", 0, function() {
            createScatterChart({
                plotAreaClick: function() { ok(false); }
            });

            clickChart(chart, plotAreaElement, 3000, 0);
        });

        test("event arguments contain x axis value", 1, function() {
            createScatterChart({
                plotAreaClick: function(e) { close(e.x, 12, TOLERANCE); }
            });

            clickChart(chart, plotAreaElement, 200, 500);
        });

        test("event arguments contain multiple x axis values", 2, function() {
            createScatterChart({
                xAxis: [{}, { name: "b", min: 100, max: 1000 }],
                plotAreaClick: function(e) { arrayClose(e.x, [12, 193], TOLERANCE); }
            });

            clickChart(chart, plotAreaElement, 200, 500);
        });

        test("event arguments contain y axis value", 1, function() {
            createScatterChart({
                plotAreaClick: function(e) { close(e.y, 24, TOLERANCE); }
            });

            clickChart(chart, plotAreaElement, 200, 500);
        });

        test("event arguments contain multiple y axis values", 2, function() {
            createScatterChart({
                yAxis: [{}, { name: "b", min: 100, max: 1000 }],
                plotAreaClick: function(e) { arrayClose(e.y, [24, 278], TOLERANCE); }
            });

            clickChart(chart, plotAreaElement, 200, 500);
        });

    })();


    (function() {
        var plotArea;

        function createPlotArea() {
            plotArea = new dataviz.CategoricalPlotArea([{
                name: "Value A",
                type: "bar",
                data: [1, null],
                gap: GAP
            }, {
                name: "Value B",
                type: "bar",
                data: [2, 3]
            }], {});
        }

        // ------------------------------------------------------------
        module("PlotArea / pointsByCategoryIndex", {
            setup: createPlotArea,
            teardown: moduleTeardown
        });

        test("return points", function() {
            equal(plotArea.pointsByCategoryIndex(0).length, 2);
        });

        test("return all points with some value", function() {
            equal(plotArea.pointsByCategoryIndex(1).length, 1);
        });
    })();

    (function() {
        var factory;

        function FooPlotArea() { }
        function BarPlotArea() { }

        // ------------------------------------------------------------
        module("Plot Area Factory", {
            setup: function() {
                factory = new dataviz.PlotAreaFactory();
            }
        });

        test("plot area type is created for matching series", function() {
            factory.register(FooPlotArea, ["foo"]);
            factory.register(BarPlotArea, ["bar"]);

            ok(factory.create([{ type: "bar" }]) instanceof BarPlotArea);
        });

        test("matching series are passed to plot area", function() {
            function PlotArea(series) {
                equal(series[0].type, "bar")
            };

            factory.register(PlotArea, ["bar"]);
            factory.create([{ type: "bar" }]);
        });

        test("non-matching series are not passed to plot area", function() {
            function PlotArea(series) {
                equal(series.length, 1)
            };

            factory.register(PlotArea, ["bar"]);

            factory.create([{ type: "bar" }, { type: "foo" }]);
        });

        test("options are passed to plot area", function() {
            var PlotArea = function(series, options) {
                ok(options.foo, true)
            };

            factory.register(PlotArea, ["bar"]);
            factory.create([{ type: "bar" }], { foo: true });
        });

        test("first registered plot area is default", function() {
            factory.register(FooPlotArea, ["foo"]);
            factory.register(BarPlotArea, ["bar"]);

            ok(factory.create([{ type: "baz" }]) instanceof FooPlotArea);
        });

    })();
})();
