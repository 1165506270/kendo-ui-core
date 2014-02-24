 (function() {
        var kendo = window.kendo,
            dataviz = kendo.dataviz,
            Box = dataviz.Box2D,
            DEFAULT_CAPS_WIDTH = 4,
            ErrorBarBase = dataviz.ErrorBarBase,
            CategoricalErrorBar = dataviz.CategoricalErrorBar,
            ScatterErrorBar = dataviz.ScatterErrorBar,
            ErrorRangeCalculator = dataviz.ErrorRangeCalculator,
            ErrorRange = function(low, high){
                this.low = low;
                this.high = high;
            },
            SCATTER = "scatter", SCATTER_LINE = "scatterLine", BUBBLE = "bubble",
            BAR = "bar", COLUMN = "column", LINE = "line", VERTICAL_LINE = "verticalLine", AREA = "area",
            testData = [{value: 1},{value: 6}, {value: 3}, {value: -1}],
            testDataWidthZeros = [{value: 1},{value: 10}, {value: 0}, {value: -1}, {value: 0}],
            testSeries = {data: testDataWidthZeros, type: BAR},
            average = 2.25,
            averageWithZeros = 2,
            valueGetter = function(d) {return d.value},
            mockErrorRangeCalculator = kendo.deepExtend({
                valueGetter: valueGetter
            }, ErrorRangeCalculator.fn);


        function MethodMocker(){
            this._original = {};
        }

        MethodMocker.prototype = {
            mock: function(fn, fnName, callback, replace){
                var that = this;
                that._original[fnName] = fn[fnName];
                fn[fnName] = function(){
                    if(replace){
                        return  callback.apply(this, arguments);
                    }
                    callback.apply(this, arguments);
                    return that._original[fnName].apply(this, arguments);
                };
            },
            restore: function(fn,fnName){
                fn[fnName] = this._original[fnName];
                delete this._original[fnName];
            }
        };
        var methodMocker = new MethodMocker();
        // ------------------------------------------------------------

        module("ErrorRangeCalculator / value getter / XY chart ", {
        });

        test("correct value getter is created for array xField when using XY chart", function() {
            var value = 1,
                item = [value, 2],
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER}, "x"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER_LINE}, "x"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: BUBBLE}, "x");
            ok(valueGetterScatter(item) === value, "array xField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "array xField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "array xField for bubble chart");
        });

        test("correct value getter is created for array yField when using XY chart", function() {
            var value = 2,
                item = [1, value],
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER}, "y"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER_LINE}, "y"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: BUBBLE}, "y");
            ok(valueGetterScatter(item) === value, "array yField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "array yField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "array yField for bubble chart");
        });

        test("correct value getter is created for object default xField when using XY chart", function() {
            var value = 1,
                item = {x: value},
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER}, "x"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER_LINE}, "x"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: BUBBLE}, "x");
            ok(valueGetterScatter(item) === value, "default xField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "default xField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "default xField for bubble chart");
        });

        test("correct value getter is created for object default yField when using XY chart", function() {
            var value = 1,
                item = {y: value},
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER}, "y"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER_LINE}, "y"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: BUBBLE}, "y");
            ok(valueGetterScatter(item) === value, "default yField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "default yField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "default yField for bubble chart");
        });

        test("correct value getter is created for object custom xField when using XY chart", function() {
            var value = 1,
                item = {foo: value},
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], xField: "foo", type: SCATTER}, "x"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], xField: "foo", type: SCATTER_LINE}, "x"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], xField: "foo", type: BUBBLE}, "x");
            ok(valueGetterScatter(item) === value, "custom xField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "custom xField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "custom xField for bubble chart");
        });

        test("correct value getter is created for object custom yField when using XY chart", function() {
            var value = 1,
                item = {foo: value},
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], yField: "foo", type: SCATTER}, "y"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], yField: "foo", type: SCATTER_LINE}, "y"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], yField: "foo", type: BUBBLE}, "y");
            ok(valueGetterScatter(item) === value, "custom yField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "custom yField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "custom yField for bubble chart");
        });

        // ------------------------------------------------------------

        module("ErrorRangeCalculator / value getter / categorical chart ", {
        });

        test("correct value getter is created for plain value when using categorical chart", function() {
            var value = 1,
                valueGetterBar = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: BAR}, "value"),
                valueGetterColumn = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: COLUMN}, "value"),
                valueGetterLine = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: LINE}, "value"),
                valueGetterVerticalLine = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: VERTICAL_LINE}, "value"),
                valueGetterArea = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: AREA}, "value");

            ok(valueGetterBar(value) === value, "plain value for bar chart");
            ok(valueGetterColumn(value) === value, "plain value for column chart");
            ok(valueGetterLine(value) === value, "plain value for line chart");
            ok(valueGetterVerticalLine(value) === value, "plain value for vertical line chart");
            ok(valueGetterArea(value) === value, "plain value for area chart");
        });

        test("correct value getter is created for plain value when the first value is zero", function() {
            var value = 0,
                valueGetterBar = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: BAR}, "value"),
                valueGetterColumn = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: COLUMN}, "value"),
                valueGetterLine = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: LINE}, "value"),
                valueGetterVerticalLine = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: VERTICAL_LINE}, "value"),
                valueGetterArea = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: AREA}, "value");

            ok(valueGetterBar(value) === value, "plain value for bar chart");
            ok(valueGetterColumn(value) === value, "plain value for column chart");
            ok(valueGetterLine(value) === value, "plain value for line chart");
            ok(valueGetterVerticalLine(value) === value, "plain value for vertical line chart");
            ok(valueGetterArea(value) === value, "plain value for area chart");
        });

        test("correct value getter is created for object default value field when using categorical chart", function() {
            var value = 1,
                item = {value: value, category: "category"},
                valueGetterBar = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: BAR}, "value"),
                valueGetterColumn = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: COLUMN}, "value"),
                valueGetterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: LINE}, "value"),
                valueGetterVerticalLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: VERTICAL_LINE}, "value"),
                valueGetterArea = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: AREA}, "value");

            ok(valueGetterBar(item) === value, "default value field for bar chart");
            ok(valueGetterColumn(item) === value, "default value field for column chart");
            ok(valueGetterLine(item) === value, "default value field for line chart");
            ok(valueGetterVerticalLine(item) === value, "default value field for vertical line chart");
            ok(valueGetterArea(item) === value, "default value field for area chart");
        });

        test("correct value getter is created for object custom value field when using categorical chart", function() {
            var value = 1,
                item = {foo: value, category: "category"},
                valueGetterBar = ErrorRangeCalculator.fn.createValueGetter({data: [item], field: "foo", type: BAR}, "value"),
                valueGetterColumn = ErrorRangeCalculator.fn.createValueGetter({data: [item], field: "foo", type: COLUMN}, "value"),
                valueGetterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], field: "foo", type: LINE}, "value"),
                valueGetterVerticalLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], field: "foo", type: VERTICAL_LINE}, "value"),
                valueGetterArea = ErrorRangeCalculator.fn.createValueGetter({data: [item], field: "foo", type: AREA}, "value");

            ok(valueGetterBar(item) === value, "default value field for bar chart");
            ok(valueGetterColumn(item) === value, "default value field for column chart");
            ok(valueGetterLine(item) === value, "default value field for line chart");
            ok(valueGetterVerticalLine(item) === value, "default value field for vertical line chart");
            ok(valueGetterArea(item) === value, "default value field for area chart");
        });

        // ------------------------------------------------------------

        module("ErrorRangeCalculator / calculations", {
        });

        test("correct average value is calculated", function() {
            var calculatedAverage,
                calculatedAverageWithZeros,
                expectedAverage = average,
                expectedAverageWithZeros = averageWithZeros;
            calculatedAverage = mockErrorRangeCalculator.getAverage(testData);
            calculatedAverageWithZeros = mockErrorRangeCalculator.getAverage(testDataWidthZeros);
            equal(calculatedAverage, expectedAverage, "average value");
            equal(calculatedAverageWithZeros, expectedAverageWithZeros, "average value with zeros");
        });

        test("correct sample standard deviation is calculated", function() {
            var calculatedSampleSD,
                calculatedSampleSDWithZeros,
                expectedSampleSD = 2.986,
                expectedSampleSDWithZeros = 4.528;

            calculatedSampleSD = mockErrorRangeCalculator.getStandardDeviation(testData, average, true);
            calculatedSampleSDWithZeros = mockErrorRangeCalculator.getStandardDeviation(testDataWidthZeros, averageWithZeros, true);
            equal(calculatedSampleSD.toFixed(3), expectedSampleSD, "sample standard deviation value");
            equal(calculatedSampleSDWithZeros.toFixed(3), expectedSampleSDWithZeros, "sample standard deviation with zeros value");
        });

        test("correct population standard deviation is calculated", function() {
            var calculatedSD,
                calculatedSDWithZeros,
                expectedSD = 2.586,
                expectedSDWithZeros = 4.050;

            calculatedSD = mockErrorRangeCalculator.getStandardDeviation(testData, average, false);
            calculatedSDWithZeros = mockErrorRangeCalculator.getStandardDeviation(testDataWidthZeros, averageWithZeros, false);
            equal(calculatedSD.toFixed(3), expectedSD, "population standard deviation value");
            equal(calculatedSDWithZeros.toFixed(3), expectedSDWithZeros, "population standard deviation with zeros value");
        });

        test("correct standard error is calculated", function() {
            var calculatedSE,
                calculatedSEWithZeros,
                expectedSE = 1.493,
                expectedSEWithZeros = 2.025;

            calculatedSE = mockErrorRangeCalculator.getStandardError(testData);
            calculatedSEWithZeros = mockErrorRangeCalculator.getStandardError(testDataWidthZeros);
            equal(calculatedSE.toFixed(3), expectedSE, "standard error value");
            equal(calculatedSEWithZeros.toFixed(3), expectedSEWithZeros, "standard error with zeros value");
        });


        // ------------------------------------------------------------

        module("ErrorRangeCalculator / get error range", {
        });

        var correctErrorRanges = function(errorRangeCalculator, testData, expected){
            var length = testData.length,
                actual;

            for(var idx = 0; idx < length; idx++){
                actual = errorRangeCalculator.getErrorRange(testData[idx].value);
                if(actual.low !== expected[idx].low || actual.high !== expected[idx].high){
                    return false;
                }
            }

            return true;
        };

        test("correct error ranges with plain value", function() {
            var value = 1,
                expectedRanges = [new ErrorRange(0,2), new ErrorRange(9,11), new ErrorRange(-1,1), new ErrorRange(-2,0), new ErrorRange(-1,1)],
                errorRangeCalculator = new ErrorRangeCalculator(value, testSeries, "value");

            ok(correctErrorRanges(errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        test("correct error ranges with array value", function() {
            var value = [1,2],
                expectedRanges = [new ErrorRange(0,3), new ErrorRange(9,12), new ErrorRange(-1,2), new ErrorRange(-2,1), new ErrorRange(-1,2)],
                errorRangeCalculator = new ErrorRangeCalculator(value, testSeries, "value");

            ok(correctErrorRanges(errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        test("correct error ranges with percentage value", function() {
            var value = "percentage(5)",
                expectedRanges = [new ErrorRange(1 - 0.05, 1 + 0.05), new ErrorRange(10 - 0.5, 10 + 0.5), new ErrorRange(0,0), new ErrorRange(-1 -0.05, -1 + 0.05), new ErrorRange(0,0)],
                errorRangeCalculator = new ErrorRangeCalculator(value, testSeries, "value");

            ok(correctErrorRanges(errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        test("standard deviation is calculated only once", function() {
            var calls = 0,
                errorRangeCalculator;
                methodMocker.mock(ErrorRangeCalculator.fn, "getStandardDeviation", function(){
                    calls++;
                });

            errorRangeCalculator = new ErrorRangeCalculator("stddev", testSeries, "value");
            for(var idx = 0; idx < testSeries.data.length; idx++){
                errorRangeCalculator.getErrorRange(testSeries.data[idx].value);
            }
            equal(calls, 1);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardDeviation");
        });

        test("correct error ranges with basic standard deviation", function() {
            var expectedSD = 4.049691346263317,
                errorRange = new ErrorRange(averageWithZeros - expectedSD, averageWithZeros + expectedSD),
                expectedRanges = [errorRange, errorRange, errorRange, errorRange, errorRange],
                errorRangeCalculator = new ErrorRangeCalculator("stddev", testSeries, "value");

            ok(correctErrorRanges(errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        test("correct error ranges with multiple standard deviation", function() {
            var expectedSD = 4.049691346263317,
                errorRange = new ErrorRange(averageWithZeros - 2 * expectedSD, averageWithZeros + 2 * expectedSD),
                expectedRanges = [errorRange, errorRange, errorRange, errorRange, errorRange],
                errorRangeCalculator = new ErrorRangeCalculator("stddev(2)", testSeries, "value");

            ok(correctErrorRanges(errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        test("standard error is calculated only once", function() {
            var calls = 0,
                errorRangeCalculator;
                methodMocker.mock(ErrorRangeCalculator.fn, "getStandardError", function(){
                    calls++;
                });

            errorRangeCalculator = new ErrorRangeCalculator("stderr", testSeries, "value");
            for(var idx = 0; idx < testSeries.data.length; idx++){
                errorRangeCalculator.getErrorRange(testSeries.data[idx].value);
            }
            equal(calls, 1);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardError");
        });

        test("correct error ranges with standard error", function() {
            var expectedSE = 2.024845673131659,
                expectedRanges = [new ErrorRange(1 - expectedSE, 1 + expectedSE), new ErrorRange(10 - expectedSE, 10 + expectedSE),
                    new ErrorRange(0 - expectedSE, 0 + expectedSE), new ErrorRange(-1 - expectedSE, -1 + expectedSE), new ErrorRange(0 - expectedSE, 0 + expectedSE)],
                errorRangeCalculator = new ErrorRangeCalculator("stderr", testSeries, "value");

            ok(correctErrorRanges(errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        // ------------------------------------------------------------

        module("scatter chart error bar", {
        });


        var xAxisName = "xName",
            yAxisName = "yName",
            xErrorValue = 3,
            yErrorValue = 2,
            expectedXAxisMax = 5,
            expectedXAxisMin = -2,
            expectedYAxisMax = 4,
            expectedYAxisMin = -1,
            dataArraySeries = { data: [[1, 1], [2, 2]], xAxis: xAxisName, yAxis: yAxisName, errorBars: { xValue: xErrorValue, yValue: yErrorValue }, labels: {}, type: "scatter" },
            dataDefaultFieldsSeries = { data: [{x: 1, y: 1}, {x: 2, y: 2}], xAxis: xAxisName, yAxis: yAxisName, errorBars: { xValue: xErrorValue, yValue: yErrorValue }, labels: {}, type: "scatter" },
            dataCustomFieldsSeries = { data: [{fooX: 1, fooY: 1}, {fooX: 2, fooY: 2}], xField: "fooX", yField: "fooY", xAxis: xAxisName, yAxis: yAxisName, errorBars:{ xValue: xErrorValue, yValue: yErrorValue }, labels: {}, type: "scatter" };

        function addedScatterPointErrorBars(points, seriesData, xGetter, yGetter){
            var idx = 0,
                errorBars;

            for(;idx < points.length; idx++){
                if(!(errorBars = points[idx].errorBars) || !errorBars[0] || !errorBars[1] ||
                    errorBars[0].low != (xGetter(seriesData[idx]) - xErrorValue) || errorBars[0].high != (xGetter(seriesData[idx]) + xErrorValue) ||
                    errorBars[1].low != (yGetter(seriesData[idx]) - yErrorValue) || errorBars[1].high != (yGetter(seriesData[idx]) + yErrorValue ||
                    errorBars[0].isVertical || !errorBars[1].isVertical)){
                    return false;
                }
            }
            return true;
        }

        function addedScatterPointValues(points, expectedValues, field){
            var addedValues = true;
            for(var idx = 0;idx < points.length; idx++){
                addedValues = addedValues && points[idx][field + "Low"] === expectedValues[idx][field + "Low"] &&
                    points[idx][field + "High"] === expectedValues[idx][field + "High"];
            }
            return addedValues;
        }

        test("low and high values are added to scatter points", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataArraySeries]}),
                points = scatterChart.points,
                expectedValues = [{xLow: -2, xHigh: 4, yLow: -1, yHigh: 3},{xLow: -1, xHigh: 5, yLow: 0, yHigh: 4}];

            ok(addedScatterPointValues(points, expectedValues, "x"));
            ok(addedScatterPointValues(points, expectedValues, "y"));
        });

        test("error bars are correctly added to scatter points for array data", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataArraySeries]}),
                seriesData = dataArraySeries.data,
                points = scatterChart.points,
                xGetter = function(d) {return d[0]},
                yGetter = function(d) {return d[1]};


            ok(addedScatterPointErrorBars(points, seriesData, xGetter, yGetter));
        });

        test("scatter axis ranges are updated when using array data", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataArraySeries]}),
                xRanges = scatterChart.xAxisRanges[xAxisName],
                yRanges = scatterChart.yAxisRanges[yAxisName];

            equal(xRanges.max, expectedXAxisMax, "xAxis max range is updated");
            equal(xRanges.min, expectedXAxisMin, "xAxis min range is updated");
            equal(yRanges.max, expectedYAxisMax, "yAxis max range is updated");
            equal(yRanges.min, expectedYAxisMin, "yAxis min range is updated");
        });

        test("error bars are correctly added to scatter points for objects with default fields names", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataDefaultFieldsSeries]}),
                seriesData = dataDefaultFieldsSeries.data,
                points = scatterChart.points,
                xGetter = function(d) {return d.x},
                yGetter = function(d) {return d.y};

             ok(addedScatterPointErrorBars(points, seriesData, xGetter, yGetter));
        });

        test("scatter axis ranges are updated when using objects with default fields names", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataDefaultFieldsSeries]}),
                xRanges = scatterChart.xAxisRanges[xAxisName],
                yRanges = scatterChart.yAxisRanges[yAxisName];


            equal(xRanges.max, expectedXAxisMax, "xAxis max range is updated");
            equal(xRanges.min, expectedXAxisMin, "xAxis min range is updated");
            equal(yRanges.max, expectedYAxisMax, "yAxis max range is updated");
            equal(yRanges.min, expectedYAxisMin, "yAxis min range is updated");
        });

        test("error bars are correctly added to scatter points for objects with custom fields names", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataCustomFieldsSeries]}),
                seriesData = dataCustomFieldsSeries.data,
                points = scatterChart.points,
                xGetter = function(d) {return d.fooX},
                yGetter = function(d) {return d.fooY};

             ok(addedScatterPointErrorBars(points, seriesData, xGetter, yGetter));
        });

        test("error bars are not added to scatter date axis points", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [{ type: "scatter", data: [{date: new Date(), y: 1}, {date: new Date(), y : 2}], xField: "date", yField: "y",errorBars: {xValue: 10}}]}),
                seriesData = dataCustomFieldsSeries.data,
                points = scatterChart.points,
                addedErrorBars = false;
             for(var idx = 0; idx < points.length; idx++){
                addedErrorBars = addedErrorBars || points[idx].errorBars != undefined;
             }

             ok(!addedErrorBars);
        });

        test("scatter axis ranges are updated when using objects with custom fields names", function() {
            var scatterChart =  new dataviz.ScatterChart({}, {series: [dataCustomFieldsSeries]}),
                xRanges = scatterChart.xAxisRanges[xAxisName],
                yRanges = scatterChart.yAxisRanges[yAxisName];

            equal(xRanges.max, expectedXAxisMax, "xAxis max range is updated");
            equal(xRanges.min, expectedXAxisMin, "xAxis min range is updated");
            equal(yRanges.max, expectedYAxisMax, "yAxis max range is updated");
            equal(yRanges.min, expectedYAxisMin, "yAxis min range is updated");
        });

        test("correct error ranges with custom function when using scatter chart", function() {
            var customXRange = function(data){
                    return [xErrorValue, xErrorValue];
                },
                customYRange = function(data){
                    return [yErrorValue, yErrorValue];
                },
                scatterChart = new dataviz.ScatterChart({}, {series: [{ data: [[1, 1], [2, 2]], xAxis: xAxisName, yAxis: yAxisName, errorBars: { xValue: customXRange, yValue: customYRange }, labels: {}, type: "scatter" }]}),
                seriesData = dataArraySeries.data,
                points = scatterChart.points,
                xGetter = function(d) {return d[0]},
                yGetter = function(d) {return d[1]};

            ok(addedScatterPointErrorBars(points, seriesData, xGetter, yGetter));
        });

        // ------------------------------------------------------------

        module("categorical chart error bar", {
        });

        var errorValue = 3,
            axisName = "axisName",
            expectedMinRange = -2,
            expectedMaxRange = 6,
            categoricalPlotArea = {seriesCategoryAxis: function(){return { options: {}}}},
            categoricalArrayData = [1,2,3],
            categoricalNegativeArrayData = [-1, -2 , -3],
            categoricalMixedArrayData = [-1,-3, 1],
            errorBars = {value: errorValue};

        function createCategoricalSeries(seriesData, type){
            var idx,
                series = [],
                data = seriesData,
                length = data.length;
            for(idx = 0; idx < length; idx++){
                series.push({data: data[idx], axis: axisName, type: type, errorBars: errorBars});
            }
            return series;
        }

        function createCategoricalChart(data, type, stacked){
            var chart,
                isStacked = stacked || false;
            if(type === BAR){
                chart = new dataviz.BarChart(categoricalPlotArea, {series: createCategoricalSeries(data, BAR), invertAxes: true, isStacked: isStacked});
            }

            if(type == COLUMN){
                 chart = new dataviz.BarChart(categoricalPlotArea, {series: createCategoricalSeries(data, COLUMN), invertAxes: false, isStacked: isStacked});
            }

            if(type == LINE){
                chart = new dataviz.LineChart(categoricalPlotArea, {series: createCategoricalSeries(data, LINE), invertAxes: false, isStacked: isStacked});
            }

            if(type == VERTICAL_LINE){
                    chart = new dataviz.LineChart(categoricalPlotArea, {series: createCategoricalSeries(data, LINE), invertAxes: true, isStacked: isStacked});
            }

            if(type == AREA){
                chart = new dataviz.AreaChart(categoricalPlotArea, {series: createCategoricalSeries(data, AREA), invertAxes: false, isStacked: isStacked});
            }

            return chart;
        }

        function addedCategoricalPointErrorBar(points, seriesData, getter, isVertical) {
            var idx = 0,
                errorBars;

            for(;idx < points.length; idx++){
                if(!(errorBars = points[idx].errorBars) || !errorBars[0] ||
                    errorBars[0].low != (getter(seriesData[idx]) - errorValue) || errorBars[0].high != (getter(seriesData[idx]) + errorValue) ||
                    errorBars[0].isVertical !== isVertical){
                    return false;
                }
            }
            return true;
        }

        function addedStackedLinePointErrorBar(points, seriesData){
            var seriesIdx = 0,
                idx = 0,
                errorBars,
                length,
                currentIdx,
                plotValue;
            for(; seriesIdx < seriesData.length; seriesIdx++){
                 length = seriesData[seriesIdx].length;
                 currentIdx = idx;
                 for(;idx < length + currentIdx; idx++){
                    plotValue = points[idx].parent.plotRange(points[idx])[0];
                    if(!(errorBars = points[idx].errorBars) || !errorBars[0] ||
                        errorBars[0].low != (plotValue - errorValue) || errorBars[0].high != (plotValue + errorValue) ||
                        errorBars[0].isVertical !== true){
                        return false;
                    }
                }
            }

            return true;
        }

        function addedStackedBarPointErrorBar(points, seriesData){
            var seriesIdx = 0,
                idx = 0,
                categoryIdx,
                errorBars,
                seriesCount = seriesData.length,
                positiveTotals = [],
                negativeTotals = [],
                value,
                plotValue;

            for(; seriesIdx < seriesCount; seriesIdx++){
                 currentIdx = idx;
                 for(;idx < seriesCount + currentIdx; idx++){
                    value = points[idx].value;
                    categoryIdx = Math.floor(idx / seriesCount);
                    if(value > 0){
                       positiveTotals[categoryIdx] = (positiveTotals[categoryIdx] || 0) + value;
                       plotValue =  positiveTotals[categoryIdx];
                    }
                    else{
                       negativeTotals[categoryIdx] = (negativeTotals[categoryIdx] || 0) + value;
                       plotValue =  negativeTotals[categoryIdx];
                    }

                    var errorBar = points[idx].errorBars[0];
                    equal(errorBar.low, plotValue - errorValue, "Low value");
                    equal(errorBar.high, plotValue + errorValue, "High value");
                    ok(!errorBar.isVertical, "Should be horizontal");
                }
            }
        }

        function addedCategoricalPointValues(points, values){
            var addedValues = true;
            for(var idx = 0; idx < points.length; idx++){
                addedValues = addedValues && points[idx].low === values[idx].low &&
                    points[idx].high === values[idx].high;
            }
            return addedValues;
        }

        test("low and high value are added to bar points", function(){
            var chart = createCategoricalChart([categoricalArrayData], BAR),
                points = chart.points,
                expectedValues = [{low: -2, high: 4},{low: -1, high: 5},{low: 0, high: 6}];

            ok(addedCategoricalPointValues(points, expectedValues));
        });

        test("low and high value are added to stacked bar points", function(){
            var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], BAR, true),
                points = chart.points,
                expectedValues = [{low: -2, high: 4},{low: -2, high: 4},{low: -1, high: 5},{low: -1, high: 5},{low: 0, high: 6},{low: 0, high: 6}];

            ok(addedCategoricalPointValues(points, expectedValues));
        });

        test("low and high value are added to line points", function(){
            var chart = createCategoricalChart([categoricalArrayData], LINE),
                points = chart.points,
                expectedValues = [{low: -2, high: 4},{low: -1, high: 5},{low: 0, high: 6}];

            ok(addedCategoricalPointValues(points, expectedValues));
        });

        test("low and high value are added to stacked line points", function(){
            var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], LINE, true),
                points = chart.points,
                expectedValues = [{low: -2, high: 4},{low: -2, high: 4},{low: -1, high: 5},{low: -1, high: 5},{low: 0, high: 6},{low: 0, high: 6}];

            ok(addedCategoricalPointValues(points, expectedValues));
        });

        test("horizontal error bars are correctly added to categorical points for array data", function() {
            var chart = createCategoricalChart([categoricalArrayData], BAR),
                points = chart.points,
                getter = function(d) {return d};

            ok(addedCategoricalPointErrorBar(points, categoricalArrayData, getter, false));
        });

        test("horizontal error bars are correctly added to categorical points for objects with default fields data", function() {
            var chart = createCategoricalChart([testDataWidthZeros], BAR),
                points = chart.points,
                getter = valueGetter;

            ok(addedCategoricalPointErrorBar(points, testDataWidthZeros, getter, false));
        });

        test("horizontal error bars are correctly added to categorical points for objects with custom fields data", function() {
            var chart = createCategoricalChart([{foo: 1},{foo: 10}, {foo: 0}, {foo: -1}, {foo: 0}], BAR),
                points = chart.points,
                getter = function(d){return d.foo};

            ok(addedCategoricalPointErrorBar(points, testDataWidthZeros, getter, false));
        });

        test("vertical error bars are correctly added to categorical points for array data", function() {
            var chart = createCategoricalChart([categoricalArrayData], COLUMN),
                points = chart.points,
                getter = function(d) {return d};

            ok(addedCategoricalPointErrorBar(points, categoricalArrayData, getter, true));
        });

        test("vertical error bars are correctly added to categorical points for objects with default fields data", function() {
            var chart = createCategoricalChart([testDataWidthZeros], COLUMN),
                points = chart.points,
                getter = valueGetter;

            ok(addedCategoricalPointErrorBar(points, testDataWidthZeros, getter, true));
        });

        test("vertical error bars are correctly added to categorical points for objects with custom fields data", function() {
            var chart = createCategoricalChart([{foo: 1},{foo: 10}, {foo: 0}, {foo: -1}, {foo: 0}], COLUMN),
                points = chart.points,
                getter = function(d){return d.foo};

            ok(addedCategoricalPointErrorBar(points, testDataWidthZeros, getter, true));
        });

        test("errorBars are correctly added when using custom function and categoricalChart", function() {
            var customRange = function(data){
                    return [errorValue, errorValue];
                },
                data = [{value: 1},{value: 2},{value: 3}],
                chart = new dataviz.BarChart(categoricalPlotArea, {series: [{type: BAR, data: data, errorBars: {value: customRange}}],invertAxes: true}),
                points = chart.points,
                getter = valueGetter;

            ok(addedCategoricalPointErrorBar(points, data, getter, false));
        });

        test("value ranges are correctly updated for array data", function() {
            var chart = createCategoricalChart([categoricalArrayData], BAR),
                valueRanges = chart.valueAxisRanges.axisName;
            equal(valueRanges.min, expectedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for stacked line data", function() {
            var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], LINE, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -2,
                expectedStackedMaxRange = 9;
            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for negative positive stacked line data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalArrayData], LINE, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -6,
                expectedStackedMaxRange =  3;
            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for mixed stacked line data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalMixedArrayData], LINE, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -8,
                expectedStackedMaxRange =  2;
            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for stacked column data", function() {
          var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], COLUMN, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -2,
                expectedStackedMaxRange = 9;

            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for negative positive stacked column data", function() {
              var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalArrayData], COLUMN, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -6,
                expectedStackedMaxRange = 6;

            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for mixed stacked column data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalMixedArrayData], COLUMN, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -8,
                expectedStackedMaxRange =  4;
            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("errorBars are correctly calculated for stacked positive line data", function() {
            var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], LINE, true),
                points = chart.points;

            ok(addedStackedLinePointErrorBar(points, [categoricalArrayData,categoricalArrayData]));
        });

        test("errorBars are correctly calculated for stacked negative positive line data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalArrayData], LINE, true),
                points = chart.points;

            ok(addedStackedLinePointErrorBar(points, [categoricalNegativeArrayData,categoricalArrayData]));
        });

        test("errorBars are correctly calculated for stacked mixed line data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalMixedArrayData], LINE, true),
                points = chart.points;

            ok(addedStackedLinePointErrorBar(points, [categoricalNegativeArrayData,categoricalMixedArrayData]));
        });

        test("errorBars are correctly calculated for stacked positive bar data", function() {
            var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], BAR, true),
                points = chart.points;

            addedStackedBarPointErrorBar(points, [categoricalArrayData,categoricalArrayData]);
        });

        test("errorBars are correctly calculated for stacked negative positive bar data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalArrayData], BAR, true),
                points = chart.points;

            addedStackedBarPointErrorBar(points, [categoricalNegativeArrayData, categoricalArrayData]);
        });

        test("errorBars are correctly calculated for stacked mixed bar data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData, categoricalMixedArrayData], BAR, true),
                points = chart.points;

            addedStackedBarPointErrorBar(points, [categoricalNegativeArrayData, categoricalMixedArrayData]);
        });

        test("ErrorRangeCalculator is created only for series with errorbars", function() {
            var chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, errorBars: {value: errorValue}, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData}]}),
            points = chart.points,
            length = points.length,
            isCreatedForFirstSeries = true,
            isNotCreatedForSecondSeries = true;

            for(var idx = 0; idx < length; idx++){
                if(idx % 2 === 0){
                    isCreatedForFirstSeries = isCreatedForFirstSeries && points[idx].errorBars !== undefined;
                }
                else{
                    isNotCreatedForSecondSeries = isNotCreatedForSecondSeries && points[idx].errorBars === undefined;
                }
            }

            ok(isCreatedForFirstSeries, "created for series with errorbar");
            ok(isNotCreatedForSecondSeries, "not created for series without errorbar");
        });

        test("ErrorRangeCalculator is created only for series with errorbars reverse", function() {
            var chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData, errorBars: {value: errorValue}}]}),
            points = chart.points,
            length = points.length,
            isCreatedForFirstSeries = true,
            isNotCreatedForSecondSeries = true;

            for(var idx = 0; idx < length; idx++){
                if(idx % 2 === 1){
                    isCreatedForFirstSeries = isCreatedForFirstSeries && points[idx].errorBars !== undefined;
                }
                else{
                    isNotCreatedForSecondSeries = isNotCreatedForSecondSeries && points[idx].errorBars === undefined;
                }
            }

            ok(isCreatedForFirstSeries, "created for series with errorbar");
            ok(isNotCreatedForSecondSeries, "not created for series without errorbar");
        });

        test("standard deviation is not calculated for series without sd set", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardDeviation", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData}]});


            equal(calls, 0);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardDeviation");
        });

        test("standard deviation is calculated once for each series", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardDeviation", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData, errorBars: {value: "stddev"}}]});

            equal(calls, 1);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardDeviation");
        });

        test("standard deviation is calculated once for each series when multuple series with sd are used", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardDeviation", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData, errorBars: {value: "stddev"}},
                {type: LINE, data: categoricalArrayData, errorBars: {value: "stddev"}}]});

            equal(calls, 2);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardDeviation");
        });

        test("standard error is not calculated for series without se set", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardError", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData}]});

            equal(calls, 0);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardError");
        });

        test("standard error is calculated once for each series", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardError", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData, errorBars: {value: "stderr"}}]});

            equal(calls, 1);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardError");
        });

        test("standard error is calculated once for each series when multuple series with se are used", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardError", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData, errorBars: {value: "stderr"}},
                {type: LINE, data: categoricalArrayData, errorBars: {value: "stderr"}}]});

            equal(calls, 2);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardError");
        });

        var defaultOptions = {
                endCaps: true,
                color: "red",
                line: {
                    width: 1
                }
            },
        expectedOptions = {
            stroke: "red",
            strokeWidth: 1,
            zIndex: 1,
            align: false
        },
        equalFields = function(a, b){
            var areEqual = true;
            if($.isArray(a)){
                if(!$.isArray(b) || a.length != b.length){
                    return false;
                }
                for(var idx = 0; idx < a.length; idx++){
                    areEqual = areEqual && equalFields(a[idx], b[idx]);
                }
                return areEqual;
            }
            if(typeof a === "object"){
                for(var field in a){
                    areEqual = areEqual && equalFields(a[field], b[field]);
                }
                return areEqual;
            }

            return a === b;
        },
        getSlot =  function(a, b){
           return new Box(a, a, b, b);
        },
        valueAxis = {
            getSlot: getSlot,
            startValue: function() {
                return 0;
            }
        },
        xAxis = {
            getSlot: getSlot
        },
        yAxis = {
            getSlot: getSlot
        },
        categoricalChart = {
            seriesValueAxis: function () {
                return valueAxis;
            }
        },
        xyChart = {
            seriesAxes: function () {
                return {
                    x: xAxis,
                    y: yAxis
                };
            }
        };

        module("error bar / value axis", {});

        test("value axis is found for categorical chart", function() {
            var errorbar = new CategoricalErrorBar(1,1, true, categoricalChart, {}, {});
            ok(errorbar.getAxis() === valueAxis);
        });

        test("xAxis is found for horizontal error bar", function() {
            var errorbar = new ScatterErrorBar(1,1, false, xyChart, {}, {});
            ok(errorbar.getAxis() === xAxis);
        });

        test("yAxis is found for vertical error bar", function() {
            var errorbar = new ScatterErrorBar(1,1, true, xyChart, {}, {});
            ok(errorbar.getAxis() === yAxis);
        });

        module("error bar", {
        });

        test("the caps width is calculated from the box width when it is smaller than the default width for a vertical error bar", function(){
            var box = new Box(1,1, 8, 1),
                expectedCapsWidth = Math.floor(box.width() / 2),
                calculatedCapsWidth = ErrorBarBase.fn.getCapsWidth(box, true);
            equal(calculatedCapsWidth, expectedCapsWidth);
        });

        test("the default caps width is used when it is smaller than the box width for a vertical error bar", function(){
            var box = new Box(1,1, 23, 1),
                expectedCapsWidth = DEFAULT_CAPS_WIDTH,
                calculatedCapsWidth = ErrorBarBase.fn.getCapsWidth(box, true);
            equal(calculatedCapsWidth, expectedCapsWidth);
        });

        test("the caps width is calculated from the box height when it is smaller than the default width for a horizontal error bar", function(){
            var box = new Box(1,1, 1, 8),
                expectedCapsWidth = Math.floor(box.height() / 2),
                calculatedCapsWidth = ErrorBarBase.fn.getCapsWidth(box, false);
            equal(calculatedCapsWidth, expectedCapsWidth);
        });

        test("the default caps width is used when it is smaller than the box height for a horizontal error bar", function(){
            var box = new Box(1,1, 1, 23),
                expectedCapsWidth = DEFAULT_CAPS_WIDTH,
                calculatedCapsWidth = ErrorBarBase.fn.getCapsWidth(box, false);
            equal(calculatedCapsWidth, expectedCapsWidth);
        });

        test("lines are correctly created for a horizontal categorical error bar", function(){
            var targetBox = new Box(5,5,9, 9),
                errorBar = new CategoricalErrorBar(1,2, false, categoricalChart, {}, defaultOptions),
                view = new ViewStub(),
                expectedElements = [{x1: 1, x2: 2, y1: 7, y2: 7, options: expectedOptions}, {x1: 1, x2: 1, y1: 5, y2: 9, options: expectedOptions},
                    {x1: 2, x2: 2, y1: 5, y2: 9, options: expectedOptions}],
                elements;
            errorBar.reflow(targetBox);
            elements = errorBar.getViewElements(view);

            ok(equalFields(expectedElements, view.log.line) && elements.length == expectedElements.length);
        });

        test("lines are correctly created for a horizontal scatter error bar", function(){
            var targetBox = new Box(5,5,9, 9),
                errorBar = new ScatterErrorBar(1,2, false, xyChart, {}, defaultOptions),
                view = new ViewStub(),
                expectedElements = [{x1: 1, x2: 2, y1: 7, y2: 7, options: expectedOptions}, {x1: 1, x2: 1, y1: 5, y2: 9, options: expectedOptions},
                    {x1: 2, x2: 2, y1: 5, y2: 9, options: expectedOptions}],
                elements;
            errorBar.reflow(targetBox);
            elements = errorBar.getViewElements(view);

            ok(equalFields(expectedElements, view.log.line) && elements.length == expectedElements.length);
        });

        test("color is taken from errorbar options when specified for scatter error bar", function(){
            var targetBox = new Box(5,5,9, 9),
                errorBar = new ScatterErrorBar(1,2, false, xyChart, {}, {
                    endCaps: true,
                    color: "black"
                }),
                view = new ViewStub(),
                options = $.extend({}, expectedOptions, {stroke: "black"}),
                expectedElements = [{x1: 1, x2: 2, y1: 7, y2: 7, options: options}, {x1: 1, x2: 1, y1: 5, y2: 9, options: options},
                    {x1: 2, x2: 2, y1: 5, y2: 9, options: options}],
                elements;
            errorBar.reflow(targetBox);
            elements = errorBar.getViewElements(view);

            ok(equalFields(expectedElements, view.log.line) && elements.length == expectedElements.length);
        });

        test("color is taken from errorbar options when specified for categorical error bar", function(){
            var targetBox = new Box(5,5,9, 9),
                errorBar = new CategoricalErrorBar(1,2, true, categoricalChart, {} , {
                    endCaps: true,
                    color: "black"
                }),
                view = new ViewStub(),
                options = $.extend({}, expectedOptions, {stroke: "black"}),
                expectedElements = [{x1: 7, x2: 7, y1: 1, y2: 2, options: options}, {x1: 5, x2: 9, y1: 1, y2: 1, options: options},
                    {x1: 5, x2: 9, y1: 2, y2: 2, options: options}],
                elements;
            errorBar.reflow(targetBox);
            elements = errorBar.getViewElements(view);

            ok(equalFields(expectedElements, view.log.line) && elements.length == expectedElements.length);
        });

        test("lines are correctly created for a vertical categorical error bar", function(){
            var targetBox = new Box(5,5,9, 9),
                errorBar = new CategoricalErrorBar(1,2, true, categoricalChart, {},  defaultOptions),
                view = new ViewStub(),
                expectedElements = [{x1: 7, x2: 7, y1: 1, y2: 2, options: expectedOptions}, {x1: 5, x2: 9, y1: 1, y2: 1, options: expectedOptions},
                    {x1: 5, x2: 9, y1: 2, y2: 2, options: expectedOptions}],
                elements;
            errorBar.reflow(targetBox);
            elements = errorBar.getViewElements(view);

            ok(equalFields(expectedElements, view.log.line) && elements.length == expectedElements.length);
        });

        test("lines are correctly created for a vertical scatter error bar", function(){
            var targetBox = new Box(5,5,9, 9),
                errorBar = new ScatterErrorBar(1,2, true, xyChart, {}, defaultOptions),
                view = new ViewStub(),
                expectedElements = [{x1: 7, x2: 7, y1: 1, y2: 2, options: expectedOptions}, {x1: 5, x2: 9, y1: 1, y2: 1, options: expectedOptions},
                    {x1: 5, x2: 9, y1: 2, y2: 2, options: expectedOptions}],
                elements;
            errorBar.reflow(targetBox);
            elements = errorBar.getViewElements(view);

            ok(equalFields(expectedElements, view.log.line) && elements.length == expectedElements.length);
        });

        test("caps lines are not created for a horizontal categorical error bar when the endCaps option is false", function(){
            var targetBox = new Box(5,5,9, 9),
                errorBar = new CategoricalErrorBar(1,2, false, categoricalChart, {} , $.extend({}, defaultOptions, {endCaps: false})),
                view = new ViewStub(),
                expectedElements = [{x1: 1, x2: 2, y1: 7, y2: 7, options: expectedOptions}],
                elements;
            errorBar.reflow(targetBox);
            elements = errorBar.getViewElements(view);

            ok(equalFields(expectedElements, view.log.line) && elements.length == expectedElements.length);
        });

        test("caps lines are not created for a horizontal scatter error bar when the endCaps option is false", function(){
            var targetBox = new Box(5,5,9, 9),
                errorBar = new ScatterErrorBar(1,2, false, xyChart, {} , $.extend({}, defaultOptions, {endCaps: false})),
                view = new ViewStub(),
                expectedElements = [{x1: 1, x2: 2, y1: 7, y2: 7, options: expectedOptions}],
                elements;
            errorBar.reflow(targetBox);
            elements = errorBar.getViewElements(view);

            ok(equalFields(expectedElements, view.log.line) && elements.length == expectedElements.length);
        });

        test("caps lines are not created for a vertical categorical error bar when the endCaps option is false", function(){
            var targetBox = new Box(5,5,9, 9),
                errorBar = new CategoricalErrorBar(1,2, true, categoricalChart, {}, $.extend({}, defaultOptions, {endCaps: false})),
                view = new ViewStub(),
                expectedElements = [{x1: 7, x2: 7, y1: 1, y2: 2, options: expectedOptions}],
                elements;
            errorBar.reflow(targetBox);
            elements = errorBar.getViewElements(view);

            ok(equalFields(expectedElements, view.log.line) && elements.length == expectedElements.length);
        });

        test("caps lines are not created for a vertical scatter error bar when the endCaps option is false", function(){
            var targetBox = new Box(5,5,9, 9),
                errorBar = new ScatterErrorBar(1,2, true, xyChart, {}, $.extend({}, defaultOptions, {endCaps: false})),
                view = new ViewStub(),
                expectedElements = [{x1: 7, x2: 7, y1: 1, y2: 2, options: expectedOptions}],
                elements;
            errorBar.reflow(targetBox);
            elements = errorBar.getViewElements(view);

            ok(equalFields(expectedElements, view.log.line) && elements.length == expectedElements.length);
        });
    })();
