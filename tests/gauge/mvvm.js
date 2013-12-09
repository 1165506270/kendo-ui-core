(function(){

var dom;

module("Gauge / Radigal mvvm", {
    teardown: function() {
       kendo.destroy(dom);
    }
});

test("initializes a radial gauge when data role is gauge", function() {
    dom = $('<div data-role="radialgauge" />');

    kendo.bind(dom, {}, kendo.dataviz.ui);

    ok(dom.data("kendoRadialGauge") instanceof kendo.dataviz.ui.RadialGauge);
});

test("initializes options from data attributes", function() {
    dom = $('<div data-role="radialgauge" data-transitions="false" />');

    kendo.bind(dom, {}, kendo.dataviz.ui);

    var gauge = dom.data("kendoRadialGauge");

    equal(gauge.options.transitions, false);
});

test("initializes value from view model", function() {
    dom = $('<div data-role="radialgauge" data-bind="value:value" />');

    kendo.bind(dom, { value: 10 }, kendo.dataviz.ui);

    equal(dom.data("kendoRadialGauge").value(), 10);
});

test("changing a value updates the view model", function() {
    dom = $('<div data-role="radialgauge" data-bind="value:value" />');

    var observable = kendo.observable({ value: null });

    kendo.bind(dom, observable, kendo.dataviz.ui);

    dom.data("kendoRadialGauge").value(10);
    dom.data("kendoRadialGauge").trigger("change");

    equal(observable.value, 10);
});

test("binding gauge initialized before binding", function() {
    dom = $('<div data-bind="value:value" />');

    var observable = kendo.observable({ value: null });
    observable.value = 10;

    dom.kendoRadialGauge();

    kendo.bind(dom, observable, kendo.dataviz.ui);

    equal(dom.data("kendoRadialGauge").value(), 10);
});

test("binding gauge initialized after binding", function() {
    dom = $('<div data-bind="value:value" />');

    var observable = kendo.observable({ value: null });
    observable.value = 10;

    kendo.bind(dom, observable, kendo.dataviz.ui);

    dom.kendoRadialGauge();

    equal(dom.data("kendoRadialGauge").value(), 10);
});

test("updating model value updates the UI", function() {
    dom = $('<div data-bind="value:value" />');

    var observable = kendo.observable({ value: null });

    kendo.bind(dom, observable, kendo.dataviz.ui);

    dom.kendoRadialGauge();

    observable.set("value", 10)
    equal(dom.data("kendoRadialGauge").value(), 10);
});

test("bindings are removed if element is rebind", 1, function() {
    dom = $('<div data-role="radialgauge" data-bind="value:value" />');

    var observable = kendo.observable({ value: 10 });

    kendo.bind(dom, observable, kendo.dataviz.ui);

    var destroy = stub(dom[0].kendoBindingTarget, "destroy");

    kendo.bind(dom, observable);

    equal(destroy.calls("destroy"), 1);
});

test("binding target is destroyed", 1, function() {
    dom = $('<div data-role="radialgauge" data-bind="value:value"/>');

    var observable = kendo.observable({ value: null });

    kendo.bind(dom, observable, kendo.dataviz.ui);

    var destroy = stub(dom[0].kendoBindingTarget, "destroy");

    kendo.bind(dom, observable);

    equal(destroy.calls("destroy"), 1);
});

test("binding visible to true shows the radialgauge", function() {
    dom = $('<div data-role="radialgauge" data-bind="visible: visible"></div>');

    kendo.bind(dom, { visible: true }, kendo.dataviz.ui);

    var radialgauge = dom.data("kendoRadialGauge");

    ok(radialgauge.wrapper.css("display") != "none", "radialgauge is visible");
});

test("binding visible to false hides the radialgauge", function() {
    dom = $('<div data-role="radialgauge" data-bind="visible: visible"></div>');

    kendo.bind(dom, { visible: false }, kendo.dataviz.ui);

    var radialgauge = dom.data("kendoRadialGauge");

    ok(radialgauge.wrapper.css("display") == "none", "radialgauge is not visible");
});

test("binding invisible to true hides the radialgauge", function() {
    dom = $('<div data-role="radialgauge" data-bind="invisible: invisible"></div>');

    kendo.bind(dom, { invisible: true }, kendo.dataviz.ui);

    var radialgauge = dom.data("kendoRadialGauge");

    ok(radialgauge.wrapper.css("display") == "none", "radialgauge is invisible");
});

test("binding invisible to false shows the radialgauge", function() {
    dom = $('<div data-role="radialgauge" data-bind="invisible: invisible"></div>');

    kendo.bind(dom, { invisible: false }, kendo.dataviz.ui);

    var radialgauge = dom.data("kendoRadialGauge");

    ok(radialgauge.wrapper.css("display") != "none", "radialgauge is not invisible");
});

module("Gauge / Linear mvvm", {
    teardown: function() {
        kendo.destroy(dom);
    }
});

test("initializes a linear gauge when data role is gauge", function() {
    dom = $('<div data-role="lineargauge" />');

    kendo.bind(dom, {}, kendo.dataviz.ui);

    ok(dom.data("kendoLinearGauge") instanceof kendo.dataviz.ui.LinearGauge);
});

test("initializes options from data attributes", function() {
    dom = $('<div data-role="lineargauge" data-transitions="false" />');

    kendo.bind(dom, {}, kendo.dataviz.ui);

    var gauge = dom.data("kendoLinearGauge");

    equal(gauge.options.transitions, false);
});

test("initializes value from view model", function() {
    dom = $('<div data-role="lineargauge" data-bind="value:value" />');

    kendo.bind(dom, { value: 10 }, kendo.dataviz.ui);

    equal(dom.data("kendoLinearGauge").value(), 10);
});

test("changing a value updates the view model", function() {
    dom = $('<div data-role="lineargauge" data-bind="value:value" />');

    var observable = kendo.observable({ value: null });

    kendo.bind(dom, observable, kendo.dataviz.ui);

    dom.data("kendoLinearGauge").value(10);
    dom.data("kendoLinearGauge").trigger("change");

    equal(observable.value, 10);
});

test("binding gauge initialized before binding", function() {
    dom = $('<div data-bind="value:value" />');

    var observable = kendo.observable({ value: null });
    observable.value = 10;

    dom.kendoLinearGauge();

    kendo.bind(dom, observable, kendo.dataviz.ui);

    equal(dom.data("kendoLinearGauge").value(), 10);
});

test("binding gauge initialized after binding", function() {
    dom = $('<div data-bind="value:value" />');

    var observable = kendo.observable({ value: null });
    observable.value = 10;

    kendo.bind(dom, observable, kendo.dataviz.ui);

    dom.kendoLinearGauge();

    equal(dom.data("kendoLinearGauge").value(), 10);
});

test("updating model value updates the UI", function() {
    dom = $('<div data-bind="value:value" />');

    var observable = kendo.observable({ value: null });

    kendo.bind(dom, observable, kendo.dataviz.ui);

    dom.kendoLinearGauge();

    observable.set("value", 10)
    equal(dom.data("kendoLinearGauge").value(), 10);
});

test("bindings are removed if element is rebind", 1, function() {
    dom = $('<div data-role="lineargauge" data-bind="value:value" />');

    var observable = kendo.observable({ value: 10 });

    kendo.bind(dom, observable, kendo.dataviz.ui);

    var destroy = stub(dom[0].kendoBindingTarget, "destroy");

    kendo.bind(dom, observable);

    equal(destroy.calls("destroy"), 1);
});

test("binding target is destroyed", 1, function() {
    dom = $('<div data-role="lineargauge" data-bind="value:value"/>');

    var observable = kendo.observable({ value: null });

    kendo.bind(dom, observable, kendo.dataviz.ui);

    var destroy = stub(dom[0].kendoBindingTarget, "destroy");

    kendo.bind(dom, observable);

    equal(destroy.calls("destroy"), 1);
});

test("binding visible to true shows the lineargauge", function() {
    dom = $('<div data-role="lineargauge" data-bind="visible: visible"></div>');

    kendo.bind(dom, { visible: true }, kendo.dataviz.ui);

    var radialgauge = dom.data("kendoLinearGauge");

    ok(radialgauge.wrapper.css("display") != "none", "lineargauge is visible");
});

test("binding visible to false hides the lineargauge", function() {
    dom = $('<div data-role="lineargauge" data-bind="visible: visible"></div>');

    kendo.bind(dom, { visible: false }, kendo.dataviz.ui);

    var radialgauge = dom.data("kendoLinearGauge");

    ok(radialgauge.wrapper.css("display") == "none", "lineargauge is not visible");
});

test("binding invisible to true hides the lineargauge", function() {
    dom = $('<div data-role="lineargauge" data-bind="invisible: invisible"></div>');

    kendo.bind(dom, { invisible: true }, kendo.dataviz.ui);

    var radialgauge = dom.data("kendoLinearGauge");

    ok(radialgauge.wrapper.css("display") == "none", "lineargauge is invisible");
});

test("binding invisible to false shows the lineargauge", function() {
    dom = $('<div data-role="lineargauge" data-bind="invisible: invisible"></div>');

    kendo.bind(dom, { invisible: false }, kendo.dataviz.ui);

    var radialgauge = dom.data("kendoLinearGauge");

    ok(radialgauge.wrapper.css("display") != "none", "lineargauge is not invisible");
});

test("initializes renderAs value for the linear gauge", function() {
    dom = $('<div data-role="lineargauge" data-render-as="canvas"/>');

    kendo.bind(dom, {}, kendo.dataviz.ui);

    equal(dom.data("kendoLinearGauge").options.renderAs, "canvas");
});

test("initializes renderAs value for the radial gauge", function() {
    dom = $('<div data-role="radialgauge" data-render-as="canvas"/>');

    kendo.bind(dom, {}, kendo.dataviz.ui);

    equal(dom.data("kendoRadialGauge").options.renderAs, "canvas");
});
}());
