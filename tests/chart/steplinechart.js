(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        lineChart,
        root,
        view,
        pointCoordinates,
        TOLERANCE = 1;

    function setupLineChart(plotArea, options) {
        view = new ViewStub();

        lineChart = new dataviz.LineChart(plotArea, options);

        root = new dataviz.RootElement();
        root.append(lineChart);

        lineChart.reflow();
        lineChart.getViewElements(view);
        pointCoordinates = mapPoints(view.log.path[0].points);
    }

    function stubPlotArea(getCategorySlot, getValueSlot, options) {
        return new function() {
            this.categoryAxis = this.primaryCategoryAxis = {
                getSlot: getCategorySlot,
                options: {
                    categories: ["A", "B"]
                }
            };

            this.valueAxis = {
                getSlot: getValueSlot,
                options: {}
            };

            this.namedCategoryAxes = {};
            this.namedValueAxes = {};

            this.seriesCategoryAxis = function(series) {
                return series.categoryAxis ?
                    this.namedCategoryAxes[series.categoryAxis] : this.primaryCategoryAxis;
            };

            this.options = options;
        };
    }

    (function() {
        var positiveSeries = { data: [1, 2], style: "step", labels: {} },
            negativeSeries = { data: [-1, -2], style: "step", labels: {} },
            sparseSeries = { data: [1, 2, undefined, 2], style: "step", width: 0 },
            VALUE_AXIS_MAX = 2,
            CATEGORY_AXIS_Y = 2;

        var plotArea = stubPlotArea(
            function(categoryIndex) {
                return new Box2D(categoryIndex, CATEGORY_AXIS_Y,
                                 categoryIndex + 1, CATEGORY_AXIS_Y);
            },
            function(value, b) {
                var value = typeof value === "undefined" ? 0 : value,
                    valueY = VALUE_AXIS_MAX - value,
                    slotTop = Math.min(CATEGORY_AXIS_Y, valueY),
                    slotBottom = Math.max(CATEGORY_AXIS_Y, valueY);

                return new Box2D(0, slotTop, 0, slotBottom);
            }
        );

        // ------------------------------------------------------------
        module("Step Line Chart / Positive Values", {
            setup: function() {
                setupLineChart(plotArea, { series: [ positiveSeries ] });
            }
        });

        test("Creates points for lineChart data points", function() {
            equal(lineChart.points.length, positiveSeries.data.length);
        });

        test("Reports minimum series value for default axis", function() {
            deepEqual(lineChart.valueAxisRanges[undefined].min, positiveSeries.data[0]);
        });

        test("Reports maximum series value for default axis", function() {
            deepEqual(lineChart.valueAxisRanges[undefined].max, positiveSeries.data[1]);
        });

        test("Reports number of categories", function() {
            setupLineChart(plotArea, {series: [ positiveSeries ]});
            equal(categoriesCount(lineChart.options.series), positiveSeries.data.length);
        });

        test("points are distributed across category axis", function() {
            var pointsX = $.map(lineChart.points, function(point) {
                return point.box.x1;
            });

            deepEqual(pointsX, [0, 1]);
        });

        test("points are aligned to category axis", function() {
            var pointsY = $.map(lineChart.points, function(point) {
                return point.box.y2;
            });

            deepEqual(pointsY, [CATEGORY_AXIS_Y, CATEGORY_AXIS_Y]);
        });

        test("points have set width", function() {
            $.each(lineChart.points, function() {
                equal(this.box.width(), 1);
            });
        });

        test("points have set height according to value", function() {
            var pointHeights = $.map(lineChart.points, function(point) {
                return point.box.height();
            });

            deepEqual(pointHeights, [1, 2]);
        });

        test("getNearestPoint returns nearest series point", function() {
            var point = lineChart.points[1],
                result = lineChart.getNearestPoint(point.box.x2 + 100, point.box.y2, 0);

            ok(result === point);
        });

        test("sets point owner", function() {
            ok(lineChart.points[0].owner === lineChart);
        });

        test("sets point series", function() {
            ok(lineChart.points[0].series === positiveSeries);
        });

        test("sets point series index", function() {
            ok(lineChart.points[0].seriesIx === 0);
        });

        test("sets point category", function() {
            equal(lineChart.points[0].category, "A");
        });

        test("sets point dataItem", function() {
            equal(typeof lineChart.points[0].dataItem, "number");
        });

        test("Throws error when unable to locate value axis", function() {
            raises(function() {
                    setupLineChart(plotArea, {
                        series: [{ axis: "b", data: [1], style: "step" }]
                    });
                },
                /Unable to locate value axis with name b/);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Negative Values", {
            setup: function() {
                setupLineChart(plotArea, { series: [ negativeSeries ] });
            }
        });

        test("Reports minimum series value for default axis", function() {
            deepEqual(lineChart.valueAxisRanges[undefined].min, negativeSeries.data[1]);
        });

        test("Reports maximum series value for default axis", function() {
            deepEqual(lineChart.valueAxisRanges[undefined].max, negativeSeries.data[0]);
        });

        test("point tops are aligned to category axis", function() {
            var pointsY = $.map(lineChart.points, function(point) {
                return point.box.y1;
            });

            deepEqual(pointsY, [CATEGORY_AXIS_Y, CATEGORY_AXIS_Y]);
        });

        test("points have set height according to value", function() {
            var pointHeights = $.map(lineChart.points, function(point) {
                return point.box.height();
            });

            deepEqual(pointHeights, [1, 2]);
        });

        test("getNearestPoint returns nearest series point", function() {
            var point = lineChart.points[1],
                result = lineChart.getNearestPoint(point.box.x2 + 100, point.box.y2, 0);

            ok(result === point);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Multiple Series", {
            setup: function() {
                setupLineChart(plotArea, { series: [ negativeSeries, positiveSeries ] });
            }
        });

        test("Reports number of categories for two series", function() {
            setupLineChart(plotArea, {series: [ positiveSeries, negativeSeries ]});
            equal(categoriesCount(lineChart.options.series), positiveSeries.data.length);
        });

        test("getNearestPoint returns nearest series point", function() {
            var point = lineChart.points[1],
                result = lineChart.getNearestPoint(point.box.x2, point.box.y2 + 100, 1);

            ok(result === point);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Multiple Category Axes", {
            setup: function() {
                var chart = createChart({
                    series: [{
                        type: "line",
                        data: [1],
                        categoryAxis: "secondary",
                        style: "step"
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

        test("line is marked as above axis with respect to its category axis", function() {
            equal(series.points[0].options.aboveAxis, true);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Mismatched series", {
            setup: function() {
                setupLineChart(plotArea, {
                series: [ { data: [1, 2, 3] },
                          positiveSeries
                    ]
                });
            }
        });

        test("Reports minimum series value for default axis", function() {
            deepEqual(lineChart.valueAxisRanges[undefined].min, 1);
        });

        test("Reports maximum series value for default axis", function() {
            deepEqual(lineChart.valueAxisRanges[undefined].max, 3);
        });

        test("Reports number of categories", function() {
            equal(categoriesCount(lineChart.options.series), 3);
        });

        test("getNearestPoint returns nearest series point", function() {
            var point = lineChart.points[3],
                result = lineChart.getNearestPoint(point.box.x2 + 100, point.box.y2, 1);

            ok(result === point);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Missing values", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [ sparseSeries ]
                });
            }
        });

        test("reports minimum series value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].min, 1);
        });

        test("reports maximum series value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].max, 2);
        });

        test("ignores null values when reporting minimum series value", function() {
            setupLineChart(plotArea, {
                series: [{ data: [1, 2, null] }]
            });
            equal(lineChart.valueAxisRanges[undefined].min, 1);
        });

        test("omits missing points by default", function() {
            equal(lineChart.points[2], null);
        });

        test("omits missing points when interpolating", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "interpolate" }, sparseSeries)
                ]
            });

            equal(lineChart.points[2], null);
        });

        test("missing points are assumed to be 0", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "zero" }, sparseSeries)
                ]
            });

            equal(lineChart.points[2].value, 0);
        });

        test("getNearestPoint returns nearest series point (left)", function() {
            var point = lineChart.points[1],
                result = lineChart.getNearestPoint(point.box.x2 + 0.1, point.box.y2, 0);

            ok(result === point);
        });

        test("getNearestPoint returns nearest series point (right)", function() {
            var point = lineChart.points[3],
                result = lineChart.getNearestPoint(point.box.x1 - 0.1, point.box.y1, 0);

            ok(result === point);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Stack / Positive Values", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [ positiveSeries, positiveSeries, positiveSeries ],
                    isStacked: true }
                );
            }
        });

        test("reports stacked minumum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].min, 1);
        });

        test("reports stacked maximum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].max, 6);
        });

        test("point plot values are stacked", function() {
            deepEqual(
                $.map(lineChart.points, function(point) { return point.plotValue }),
                [1, 2, 3, 2, 4, 6]
            );
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Stack / Negative Values", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [ negativeSeries, negativeSeries, negativeSeries ],
                    isStacked: true
                });
            }
        });

        test("reports stacked minumum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].min, -6);
        });

        test("reports stacked maximum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].max, -1);
        });

        test("point plot values are stacked", function() {
            deepEqual(
                $.map(lineChart.points, function(point) { return point.plotValue }),
                [-1, -2, -3, -2, -4, -6]
            );
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Stack / Mixed Values", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [{
                        data: [2, 2],
                        labels: {}
                    }, {
                        data: [-1, -1],
                        labels: {}
                    }],
                    isStacked: true
                });
            }
        });

        test("reports stacked minumum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].min, 1);
        });

        test("reports stacked maximum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].max, 2);
        });

        test("points have set height according to stack value", function() {
            var pointHeights = $.map(lineChart.points, function(point) {
                return point.box.height();
            });

            deepEqual(pointHeights, [2, 1, 2, 1]);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Stack / Mixed Series", {
            setup: function() {
                plotArea.namedValueAxes.a = plotArea.valueAxis;
                plotArea.namedValueAxes.b = plotArea.valueAxis;

                setupLineChart(plotArea, {
                    series: [
                        // Both axes should be on same axis.
                        // This rule is intentionally broken for the tests.
                        $.extend({ axis: "a" }, positiveSeries),
                        $.extend({ axis: "b" }, negativeSeries)
                    ],
                    isStacked: true
                });
            }
        });

        test("reports stacked minumum value for default axis", function() {
            equal(lineChart.valueAxisRanges.a.min, 0);
        });

        test("reports stacked maximum value for default axis", function() {
            equal(lineChart.valueAxisRanges.a.max, 2);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Stack / Missing values", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [ sparseSeries, sparseSeries ],
                    isStacked: true
                });
            }
        });

        test("Reports minimum series value", function() {
            deepEqual(lineChart.valueAxisRanges[undefined].min, 1);
        });

        test("Reports maximum series value", function() {
            deepEqual(lineChart.valueAxisRanges[undefined].max, 4);
        });

        test("missing points are assumed to be 0 by default", function() {
            equal(lineChart.points[4].value, 0);
        });

        test("missing points are skipped", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "gap" }, sparseSeries)
                ],
                isStacked: true
            });

            equal(lineChart.points[4], null);
        });

        test("line is drawn between existing points", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "interpolate" }, sparseSeries)
                ],
                isStacked: true
            });

            deepEqual(pointCoordinates, [
                [ 0, 1 ], [ 1, 1 ], [ 1, 1 ], [ 1, 0 ],
                [ 2, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ],
                [ 3, 0 ], [ 4, 0 ]
            ]);
        });

        test("line stops before missing value", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "gap" }, sparseSeries)
                ],
                isStacked: true
            });

            deepEqual(pointCoordinates, [
                [ 0, 1 ], [ 1, 1 ], [ 1, 0 ], [ 2, 0]
            ]);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Stack / Panes");

        test("charts in different panes are not stacked", function() {
            var chart = createChart({
                series: [{
                    stack: true,
                    style: "step",
                    type: "line",
                    data: [1]
                }, {
                    type: "line",
                    style: "step",
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

            var lineCharts = chart._model._plotArea.charts;
            equal(lineCharts[0].points[0].plotValue, undefined);
            equal(lineCharts[1].points[0].plotValue, undefined);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Rendering", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [
                        $.extend({
                                width: 4,
                                color: "#cf0",
                                opacity: 0.5
                            },
                            positiveSeries
                        )
                    ]
                });
            }
        });

        test("sets line width", function() {
            equal(view.log.path[0].style.strokeWidth, 4);
        });

        test("sets line color", function() {
            equal(view.log.path[0].style.stroke, "#cf0");
        });

        test("sets line color to default if series color is fn", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({
                            _defaults: { color: "#cf0" },
                            width: 4,
                            color: function() { },
                            opacity: 0.5
                        },
                        positiveSeries
                    )
                ]
            });
            equal(view.log.path[0].style.stroke, "#cf0");
        });

        test("sets line opacity", function() {
            equal(view.log.path[0].style.strokeOpacity, 0.5);
        });

        test("line has same model id as its segment", function() {
            equal(view.log.path[0].style.data.modelId, lineChart._segments[0].modelId);
        });

        test("renders line chart group", function() {
            equal(view.log.group.length, 1);
        });

        test("sets group animation", function() {
            equal(view.log.group[0].options.animation.type, "clip");
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Rendering / Missing Values");

        test("line stops before missing value", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "gap" }, sparseSeries)
                ]
            });

            deepEqual(pointCoordinates, [
                [ 0, 1 ], [ 1, 1 ], [ 1, 0 ], [ 2, 0 ]
            ]);
        });

        test("no line is created for isolated points", function() {
            setupLineChart(plotArea, {
                series: [
                    sparseSeries
                ]
            });

            equal(view.log.path.length, 1);
        });

        test("line continues after missing value", function() {
            setupLineChart(plotArea, {
                series: [{
                    data: [ null, 1, 2 ],
                    width: 0,
                    style: "step"
                }]
            });

            deepEqual(pointCoordinates, [
                [ 1, 1 ], [ 2, 1 ], [ 2, 1 ], [ 2, 0 ], [ 3, 0 ]
            ]);
        });

        test("line is drawn between existing points", function() {
            setupLineChart(plotArea, {
                series: [
                    sparseSeries
                ]
            });

            deepEqual(pointCoordinates, [
                [ 0, 1 ], [ 1, 1 ], [ 1, 1 ],
                [ 1, 0 ], [ 2, 0 ], [ 1, 0 ],
                [ 2, 0 ], [ 3, 0 ], [ 3, 0 ], [ 4, 0 ]
            ]);
        });

        test("line goes to zero for missing point", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "zero" }, sparseSeries)
                ]
            });

            deepEqual(pointCoordinates, [
                [ 0, 1 ], [ 1, 1 ], [ 1, 0 ],
                [ 2, 0 ], [ 1, 0 ], [ 2, 0 ],
                [ 2, 2 ], [ 3, 2 ], [ 2, 2 ],
                [ 3, 2 ], [ 3, 0 ], [ 4, 0 ]
            ]);
        });

    })();

    (function() {
        var lineChart,
            MARGIN = PADDING = BORDER = 5,
            linePoint;

        var plotArea = stubPlotArea(
            function(categoryIndex) {
                return new Box2D();
            },
            function(value) {
                return new Box2D();
            },
            {
                categoryAxis: { }
            }
        );

        function createLineChart(options) {
            lineChart = new dataviz.LineChart(plotArea, {
                series: [$.extend({
                    data: [0, 1],
                    color: "#f00",
                    markers: {
                        visible: false,
                        size: 10,
                        type: "triangle",
                        border: {
                            width: BORDER
                        },
                        opacity: 0.2
                    },
                    labels: {
                        visible: false,
                        color: "labels-color",
                        background: "labels-background",
                        border: {
                            color: "labels-border",
                            width: BORDER
                        },
                        margin: MARGIN,
                        padding: PADDING
                    },
                    opacity: 0.5,
                    dashType: "dot"
                }, options)]
            });
            linePoint = lineChart.points[0];
        }

        // ------------------------------------------------------------
        module("Step Line Chart / Configuration", {
            setup: function() {
                createLineChart();
            },
            teardown: destroyChart
        });

        test("remove series if visible is set to false", function() {
            var chart = createChart({
                seriesDefaults: {
                    type: "line",
                    style: "step"
                },
                series: [{
                    data: [1],
                    visible: false
                },{
                    data: [1]
                }]
            });

            var points = chart._model._plotArea.charts[0].points;

            ok(points.length === 1);
        });

        test("applies visible to point markers", function() {
            equal(linePoint.options.markers.visible, false);
        });

        test("applies series color to point markers border", function() {
            equal(linePoint.options.markers.border.color, "#f00");
        });

        test("applies opacity to point markers", function() {
            equal(linePoint.options.markers.opacity, 0.2);
        });

        test("applies size to point markers", function() {
            equal(linePoint.options.markers.size, 10);
        });

        test("applies type to point markers", function() {
            equal(linePoint.options.markers.type, "triangle");
        });

        test("applies border color to point markers", function() {
            createLineChart({ markers: { border: { color: "marker-border" } } });
            equal(linePoint.options.markers.border.color, "marker-border");
        });

        test("applies border width to point markers.", function() {
            equal(linePoint.options.markers.border.width, BORDER);
        });

        test("applies visible to point labels", function() {
            equal(linePoint.options.labels.visible, false);
        });

        test("applies color to point labels", function() {
            equal(linePoint.options.labels.color, "labels-color");
        });

        test("applies background to point labels", function() {
            equal(linePoint.options.labels.background, "labels-background");
        });

        test("applies border color to point labels", function() {
            equal(linePoint.options.labels.border.color, "labels-border");
        });

        test("applies border width to point labels", function() {
            equal(linePoint.options.labels.border.width, BORDER);
        });

        test("applies padding to point labels", function() {
            equal(linePoint.options.labels.padding, PADDING);
        });

        test("applies margin to point labels", function() {
            equal(linePoint.options.labels.margin, MARGIN);
        });

        test("applies dashType", function() {
            equal(linePoint.options.dashType, "dot");
        });

        test("applies color function", function() {
            createLineChart({
                color: function(point) { return "#f00" }
            });

            equal(linePoint.options.markers.border.color, "#f00");
        });

        test("color fn argument contains value", 1, function() {
            createLineChart({
                data: [1],
                color: function(point) { equal(point.value, 1); }
            });
        });

        test("color fn argument contains category", 1, function() {
            createLineChart({
                data: [1],
                color: function(point) { equal(point.category, "A"); }
            });
        });

        test("color fn argument contains series", 1, function() {
            createLineChart({
                name: "series 1",
                data: [1],
                color: function(point) { equal(point.series.name, "series 1"); }
            });
        });

    })();

    (function() {
        var LinePoint = dataviz.LinePoint,
            point,
            box,
            marker,
            label,
            root,
            VALUE = 1,
            TOOLTIP_OFFSET = 5,
            CATEGORY = "A",
            SERIES_NAME = "series";

        function createPoint(options) {
            point = new LinePoint(VALUE,
                $.extend(true, {
                    labels: { font: SANS12 }
                }, LinePoint.fn.defaults, options)
            );

            point.category = CATEGORY;
            point.dataItem = { value: VALUE };
            point.series = { name: SERIES_NAME };

            point.owner = {
                formatPointValue: function(point, tooltipFormat) {
                    return kendo.dataviz.autoFormat(tooltipFormat, point.value);
                }
            }

            box = new Box2D(0, 0, 100, 100);
            point.reflow(box);

            root = new dataviz.RootElement();
            root.append(point);

            marker = point.marker;
            label = point.label;
        }

        // ------------------------------------------------------------
        module("Step Line Point", {
            setup: function() {
                createPoint();
            }
        });

        test("is discoverable", function() {
            ok(point.modelId);
        });

        test("fills target box", function() {
            sameBox(point.box, box);
        });

        test("creates marker", function() {
            ok(marker instanceof dataviz.BoxElement);
        });

        test("sets marker width", function() {
            createPoint({ markers: { size: 10 } });
            equal(marker.options.width, 10);
        });

        test("sets marker height", function() {
            createPoint({ markers: { size: 10 } });
            equal(marker.options.height, 10);
        });

        test("sets marker rotation", function() {
            createPoint({ markers: { rotation: 90 } });
            equal(marker.options.rotation, 90);
        });

        test("doesn't create marker if size is 0", function() {
            createPoint({ markers: { size: 0 } });
            ok(!marker);
        });

        test("sets marker background color", function() {
            deepEqual(marker.options.background, point.options.markers.background);
        });

        test("sets default marker border color based on background", function() {
            createPoint({ markers: { background: "#cf0" } });
            equal(marker.options.border.color, "#a3cc00");
        });

        test("does not change marker border color if set", function() {
            createPoint({ markers: { border: { color: "" } } });
            equal(marker.options.border.color, "");
        });

        test("sets marker border width", function() {
            createPoint({ markers: { border: { width: 4 } } });
            equal(marker.options.border.width, 4);
        });

        test("doesn't create marker", function() {
            createPoint({ markers: { visible: false }});
            ok(!marker);
        });

        test("sets marker shape type", function() {
            createPoint({ markers: { type: "triangle" }});
            equal(marker.options.type, "triangle");
        });

        test("marker is positioned at top", function() {
            createPoint({ vertical: true, aboveAxis: true });
            sameBox(marker.box, new Box2D(44, -6, 56, 6));
        });

        test("marker is positioned at bottom", function() {
            createPoint({ vertical: true, aboveAxis: false });
            sameBox(marker.box, new Box2D(44, 94, 56, 106));
        });

        test("marker is positioned at right", function() {
            createPoint({ vertical: false, aboveAxis: true });
            sameBox(marker.box, new Box2D(94, 44, 106, 56));
        });

        test("marker is positioned at left", function() {
            createPoint({ vertical: false, aboveAxis: false });
            sameBox(marker.box, new Box2D(-6, 44, 6, 56));
        });

        test("sets marker opacity", function() {
            createPoint({ markers: { opacity: 0.5 }});
            deepEqual(marker.options.opacity, point.options.markers.opacity);
        });

        test("sets marker id", function() {
            ok(marker.id.length > 0);
        });

        test("marker has same model id", function() {
            view = new ViewStub();

            point.getViewElements(view);
            equal(marker.modelId, point.modelId);
        });

        test("highlightOverlay returns marker outline", function() {
            createPoint({ markers: { type: "circle" }});
            view = new ViewStub();

            point.highlightOverlay(view);
            equal(view.log.circle.length, 1);
        });

        test("outline element has same model id", function() {
            createPoint({ markers: { type: "circle" }});
            view = new ViewStub();

            point.highlightOverlay(view);
            equal(view.log.circle[0].style.data.modelId, point.modelId);
        });

        test("highlightOverlay applies render options for square markers", function() {
            createPoint({ markers: { type: "square" }});
            view = new ViewStub();

            point.highlightOverlay(view, { flag: true });
            ok(view.log.path[0].style.flag);
        });

        test("highlightOverlay applies render options for circle markers", function() {
            createPoint({ markers: { type: "circle" }});
            view = new ViewStub();

            point.highlightOverlay(view, { flag: true });
            ok(view.log.circle[0].style.flag);
        });

        test("highlightOverlay applies render options for triangle markers", function() {
            createPoint({ markers: { type: "triangle" }});
            view = new ViewStub();

            point.highlightOverlay(view, { flag: true });
            ok(view.log.path[0].style.flag);
        });

        test("tooltipAnchor is at top right of marker / above axis", function() {
            createPoint({ aboveAxis: true });
            var anchor = point.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y],
                 [point.marker.box.x2 + TOOLTIP_OFFSET, point.marker.box.y1 - 10])
        });

        test("tooltipAnchor is at bottom right of marker / below axis", function() {
            createPoint({ aboveAxis: false });
            var anchor = point.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y],
                 [point.marker.box.x2 + TOOLTIP_OFFSET, point.marker.box.y2])
        });

        // ------------------------------------------------------------
        module("Step Line Point / Labels", {
            setup: function() {
                createPoint({ labels: { visible: true } });
            }
        });

        test("sets label text", function() {
            equal(label.children[0].content, VALUE);
        });

        test("applies full label format", function() {
            createPoint({ labels: { visible: true, format: "{0}%" }});
            equal(label.children[0].content, VALUE + "%");
        });

        test("applies simple label format", function() {
            createPoint({ labels: { visible: true, format: "p0" }});
            equal(label.children[0].content, VALUE * 100 + " %");
        });

        test("sets label color", function() {
            createPoint({ labels: { visible: true, color: "#cf0" }});
            deepEqual(label.options.color, "#cf0");
        });

        test("sets label background", function() {
            createPoint({ labels: { visible: true, background: "#cf0" }});
            deepEqual(label.options.background, "#cf0");
        });

        test("sets label border color", function() {
            createPoint({ labels: { visible: true, border: { color: "#cf0" } }});
            deepEqual(label.options.border.color, "#cf0");
        });

        test("sets label border width", function() {
            createPoint({ labels: { visible: true, border: { width: 4 } }});
            deepEqual(label.options.border.width, 4);
        });

        test("sets label font", function() {
            createPoint({ labels: { visible: true, font: "12px comic-sans" }});
            deepEqual(label.options.font, "12px comic-sans");
        });

        test("sets default left margin", function() {
            deepEqual(label.options.margin.left, 3);
        });

        test("sets default right margin", function() {
            deepEqual(label.options.margin.right, 3);
        });

        test("labels are not visible by default", function() {
            createPoint();
            equal(typeof label, "undefined");
        });

        test("sets label visibility", function() {
            equal(label.options.visible, true);
        });

        test("label is positioned above marker", function() {
            createPoint({ labels: { visible: true, position: "above" } });
            sameBox(label.box, new Box2D(39, -35, 60, -6), TOLERANCE);
        });

        test("label is positioned below marker", function() {
            createPoint({ labels: { visible: true, position: "below" } });
            sameBox(marker.box, new Box2D(44, -6, 56, 6), TOLERANCE);
        });

        test("label is positioned right of marker", function() {
            createPoint({ labels: { visible: true, position: "right" } });
            sameBox(marker.box, new Box2D(44, -6, 56, 6), TOLERANCE);
        });

        test("label is positioned left of marker", function() {
            createPoint({ labels: { visible: true, position: "left" } });
            sameBox(marker.box, new Box2D(44, -6, 56, 6), TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Step Line Point / Labels / Template");

        test("renders template", function() {
            createPoint({ labels: { visible: true, template: "${value}%" } });
            equal(label.children[0].content, VALUE + "%");
        });

        test("renders template even when format is set", function() {
            createPoint({ labels: { visible: true, template: "${value}%", format:"{0:C}" } });
            equal(label.children[0].content, VALUE + "%");
        });

        test("template has category", function() {
            createPoint({ labels: { visible: true, template: "${category}" } });
            equal(point.children[1].children[0].content, CATEGORY);
        });

        test("template has dataItem", function() {
            createPoint({ labels: { visible: true, template: "${dataItem.value}" } });
            equal(point.children[1].children[0].content, VALUE);
        });

        test("template has series", function() {
            createPoint({ labels: { visible: true, template: "${series.name}" } });
            equal(point.children[1].children[0].content, SERIES_NAME);
        });
    })();

    (function() {
        var data = [{
                name: "Category A",
                text: "Alpha",
                value: 0
            }],
            chart,
            label;

        // ------------------------------------------------------------
        module("Step Line Chart / Integration", {
            setup: function() {
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
                        type: "line",
                        style: "step",
                        field: "value"
                    }],
                    categoryAxis: {
                        field: "name"
                    }
                });

                label = chart._plotArea.charts[0].points[0].children[1];
            },
            teardown: function() {
                destroyChart();
            }
        });

        test("dataItem sent to label template", function() {
            equal(label.children[0].content, "Alpha");
        });

    })();

    (function() {
        var chart,
            marker,
            label,
            segment;

        function getElementFromModel(modelElement) {
            return $(getElement(modelElement.id));
        }

        function createLineChart(options) {
            chart = $("<div id='container' style='width: 600px; height: 400px;' />").appendTo(QUnit.fixture).kendoChart($.extend({
                series: [{
                    type: "line",
                    style: "step",
                    data: [1, 2]
                }],
                categoryAxis: {
                    categories: ["A"]
                }
            }, options)).data("kendoChart");

            var plotArea = chart._model.children[1],
                lineChart = plotArea.charts[0],
                point = lineChart.points[0];

            marker = point.children[0];
            label = point.children[1];
            segment = lineChart._segments[0];
        }

        function linePointClick(callback) {
            createLineChart({
                seriesClick: callback
            });

            chart._userEvents.press(0, 0, getElementFromModel(marker));
            chart._userEvents.end(0, 0);
        }

        function linePointHover(callback) {
            createLineChart({
                seriesHover: callback
            });

            getElementFromModel(marker).mouseover();
        }

        function lineClick(callback, x, y) {
            createLineChart({
                seriesClick: callback
            });

            chart._userEvents.press(x, y, getElementFromModel(segment));
            chart._userEvents.end(x, y);
        }

        function lineHover(callback, x, y) {
            createLineChart({
                seriesHover: callback
            });

            triggerEvent("mouseover", getElementFromModel(segment), x, y);
        }

        // ------------------------------------------------------------
        module("Step Line Chart / Events / seriesClick", {
            teardown: destroyChart
        });

        test("fires when clicking line points", 1, function() {
            linePointClick(function() { ok(true); });
        });

        test("fires when clicking line point labels", 1, function() {
            createLineChart({
                seriesDefaults: {
                    line: {
                        labels: {
                            visible: true
                        }
                    }
                },
                seriesClick: function(e) { ok(true); }
            });
            chart._userEvents.press(0, 0, getElementFromModel(label));
            chart._userEvents.end(0, 0);
        });

        test("event arguments contain value", 1, function() {
            linePointClick(function(e) { equal(e.value, 1); });
        });

        test("event arguments contain category", 1, function() {
            linePointClick(function(e) { equal(e.category, "A"); });
        });

        test("event arguments contain series", 1, function() {
            linePointClick(function(e) {
                deepEqual(e.series, chart.options.series[0]);
            });
        });

        test("event arguments contain dataItem", 1, function() {
            linePointClick(function(e) {
                deepEqual(e.value, e.value);
            });
        });

        test("event arguments contain jQuery element", 1, function() {
            linePointClick(function(e) {
                equal(e.element[0], getElement(marker.id));
            });
        });

        test("fires when clicking line", 1, function() {
            lineClick(function() { ok(true); });
        });

        test("fires for closest point when clicking line (1)", 1, function() {
            lineClick(function(e) { equal(e.value, 1); }, 0, 0);
        });

        test("fires for closest point when clicking line (2)", 1, function() {
            lineClick(function(e) { equal(e.value, 2); }, 1000, 0);
        });

        // ------------------------------------------------------------
        module("Step Line Chart / Events / seriesHover", {
            teardown: function() {
                destroyChart();
                $(document.body).unbind(".tracking");
            }
        });

        test("fires when hovering line points", 1, function() {
            linePointHover(function() { ok(true); });
        });

        test("fires when hovering line point labels", 1, function() {
            createLineChart({
                seriesDefaults: {
                    line: {
                        labels: {
                            visible: true
                        }
                    }
                },
                seriesHover: function(e) { ok(true); }
            });
            getElementFromModel(label).mouseover();
        });

        test("event arguments contain value", 1, function() {
            linePointHover(function(e) { equal(e.value, 1); });
        });

        test("event arguments contain category", 1, function() {
            linePointHover(function(e) { equal(e.category, "A"); });
        });

        test("event arguments contain series", 1, function() {
            linePointHover(function(e) {
                deepEqual(e.series, chart.options.series[0]);
            });
        });

        test("event arguments contain dataItem", 1, function() {
            linePointHover(function(e) {
                deepEqual(e.dataItem, e.value);
            });
        });

        test("event arguments contain jQuery element", 1, function() {
            linePointHover(function(e) {
                equal(e.element[0], getElement(marker.id));
            });
        });

        test("fires when hovering line", 1, function() {
            lineHover(function() { ok(true); });
        });

        test("fires for closest point when hovering line (1)", 1, function() {
            lineHover(function(e) { equal(e.value, 1); }, 0, 0);
        });

        test("fires for closest point when hovering line (2)", 1, function() {
            lineHover(function(e) { equal(e.value, 2); }, 1000, 0);
        });

        test("fires when moving over neighbor", 2, function() {
            lineHover(function() { ok(true); });

            var e = new jQuery.Event("mousemove"),
                element = $("#container"),
                offset = element.offset();

            e.clientX = offset.left + 500;
            e.clientY = offset.top + 100;
            $(document.body).trigger(e);
       });

    })();
})();
