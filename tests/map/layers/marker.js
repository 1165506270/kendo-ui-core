(function() {
    var Class = kendo.Class,

        dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        g = dataviz.geometry,
        d = dataviz.drawing,

        map = dataviz.map,
        Marker = map.Marker,
        MarkerLayer = map.layers.MarkerLayer,
        Location = map.Location;

    var LayerMock = Class.extend({
        init: function(element) {
            this.element = element;
            this.items = [];
        },

        update: $.noop
    });

    (function() {
        var marker,
            layer,
            wrapper;

        function destroyMarker() {
            marker.destroy();
        }

        // ------------------------------------------------------------
        module("Marker", {
            setup: function() {
                wrapper = $("<div></div>");
                layer = new LayerMock(wrapper);
                layer.update = function(marker) {
                    marker.showAt(new g.Point(100, 200));
                }

                marker = new Marker();
                marker.addTo(layer);
            },
            teardown: destroyMarker
        });

        test("addTo calls update on layer", function() {
            layer.update = function() { ok(true); };

            marker = new Marker();
            marker.addTo(layer);
        });

        test("addTo appends to layer items", function() {
            marker = new Marker();
            marker.addTo(layer);

            ok(layer.items.length, 1);
        });

        test("addTo calls update on map markers layer", function() {
            marker = new Marker();

            layer.update = function() { ok(true); };
            marker.addTo({ markers: layer });
        });

        test("renders default shape style", function() {
            ok(marker.element.hasClass("k-marker-pin"));
        });

        test("renders custom shape style", function() {
            marker = new Marker({ shape: "pin" });
            marker.addTo(layer);
            ok(marker.element.hasClass("k-marker-pin"));
        });

        test("renders no title by default", function() {
            marker = new Marker();
            marker.addTo(layer);
            ok(!marker.element.attr("alt"));
        });

        test("renders title", function() {
            marker = new Marker({ title: "foo" });
            marker.addTo(layer);
            equal(marker.element.attr("alt"), "foo");
        });

        test("renders no z-index by default", function() {
            marker = new Marker();
            marker.addTo(layer);
            var zIndex = marker.element.css("zIndex");
            ok(zIndex == "" || zIndex == "auto");
        });

        test("renders z-index", function() {
            marker = new Marker({ zIndex: 1 });
            marker.addTo(layer);
            equal(marker.element.css("zIndex"), "1");
        });

        test("showAt sets position", function() {
            equal(marker.element.css("left"), "100px");
            equal(marker.element.css("top"), "200px");
        });

        test("showAt sets tooltip position", function() {
            marker = new Marker({ tooltip: { content: "foo" } });
            marker.addTo(layer);
            marker.tooltip.show();

            marker.tooltip.popup._position = function() {
                ok(true);
            };

            marker.showAt(new g.Point(10, 20));
        });

        test("hide clears element", function() {
            marker.hide();

            ok(!marker.element);
            equal(wrapper.children().length, 0);
        });

        test("setLocation sets location", function() {
            marker.setLocation([50, 5]);
            ok(new Location(50, 5).equals(marker.options.location));
        });

        test("setLocation calls update on layer", function() {
            layer.update = function(m) { deepEqual(m, marker); };
            marker.setLocation([50, 5]);
        });

        test("setLocation doesn't fail with no layer", 0, function() {
            marker.layer = null;
            marker.setLocation([50, 5]);
        });

        test("hide removes element", function() {
            marker.hide();

            ok(!marker.element);
            equal(layer.element.children().length, 0);
        });

        test("hide removes tooltip", function() {
            marker = new Marker({ tooltip: { content: "foo" } });
            marker.addTo(layer);
            marker.hide();

            ok(!marker.tooltip);
        });

        test("destroy calls hide", function() {
            marker.hide = function() { ok(true); };
            marker.destroy();
        });

        test("destroy clears layer reference", function() {
            marker.destroy();
            ok(!marker.layer);
        });

        test("creates tooltip if content is set", function() {
            marker = new Marker({ tooltip: { content: "foo" } });
            marker.addTo(layer);
            ok(marker.tooltip);
        });

        test("creates tooltip if template is set", function() {
            marker = new Marker({ tooltip: { template: "foo" } });
            marker.addTo(layer);
            ok(marker.tooltip);
        });

        test("creates tooltip if contentUrl is set", function() {
            marker = new Marker({ tooltip: { contentUrl: "foo" } });
            marker.addTo(layer);
            ok(marker.tooltip);
        });

        test("tooltip is not created by default", function() {
            marker = new Marker({ tooltip: {} });
            marker.addTo(layer);
            ok(!marker.tooltip);
        });

        test("tooltip has reference to marker", function() {
            marker = new Marker({ tooltip: { content: "foo" } });
            marker.addTo(layer);
            deepEqual(marker.tooltip.marker, marker);
        });

        test("tooltip template is converted to content", function() {
            marker = new Marker({ tooltip: { template: "foo" } });
            marker.addTo(layer);

            equal(marker.tooltip.options.content({}), "foo");
        });

        test("tooltip template receives location", function() {
            marker = new Marker({
               location: new Location(20, 10),
               tooltip: { template: "#= location.toString() #" }
            });
            marker.addTo(layer);

            equal(marker.tooltip.options.content({}), marker.options.location.toString());
        });

        test("tooltip template converts array to location", function() {
            marker = new Marker({
               location: [20, 10],
               tooltip: { template: "#= location.toString() #" }
            });
            marker.addTo(layer);

            equal(marker.tooltip.options.content({}), new Location(20, 10).toString());
        });

        test("tooltip template receives marker", function() {
            marker = new Marker({
               location: new Location(20, 10),
               tooltip: { template: "#= marker.options.location.toString() #" }
            });
            marker.addTo(layer);

            equal(marker.tooltip.options.content({}), marker.options.location.toString());
        });

        // ------------------------------------------------------------
        module("Marker / create");

        test("creates marker from options", function() {
            var marker = Marker.create( {});
            ok(marker instanceof Marker);
        });

        test("sets marker options", function() {
            var marker = Marker.create({ foo: true });
            ok(marker.options.foo);
        });

        test("sets marker default options", function() {
            var marker = Marker.create({ foo: true }, { bar: true });
            ok(marker.options.foo && marker.options.bar);
        });

        test("default options are overriden by instance options", function() {
            var marker = Marker.create({ foo: true }, { foo: false });
            ok(marker.options.foo);
        });

        test("returns existing instance", function() {
            var src = new Marker();
            var marker = Marker.create(src);
            deepEqual(marker, src);
        });
    })();

    (function() {
        var map,
            layer;

        // ------------------------------------------------------------
        module("Marker Layer", {
            setup: function() {
                map = new MapMock();
                layer = new MarkerLayer(map);
            },
            teardown: function() {
                map.destroy();
            }
        });

        test("appends to scrollElement", function() {
            ok(layer.element.parent().is("#scroll-element"));
        });

        test("sets default z-index", function() {
            equal(layer.element.css("zIndex"), 1000);
        });

        test("sets custom z-index", function() {
            layer = new MarkerLayer(map, { zIndex: 100 });
            equal(layer.element.css("zIndex"), 100);
        });

        test("add creates marker", function() {
            layer.add({});
            equal(layer.items.length, 1);
        });

        test("add sets default options", function() {
            layer.options.foo = true;
            layer.add({});
            ok(layer.items[0].options.foo);
        });

        test("add creates markers from array", function() {
            layer.add([{}, {}]);
            equal(layer.items.length, 2);
        });

        test("add adds marker", function() {
            layer.add(new Marker());
            equal(layer.items.length, 1);
        });

        test("add adds markers", function() {
            layer.add([new Marker(), new Marker()]);
            equal(layer.items.length, 2);
        });

        test("add returns marker", function() {
            ok(layer.add({}) instanceof Marker);
        });

        test("add calls addTo on marker", function() {
            var marker = new Marker();
            marker.addTo = function(l) {
                deepEqual(l, layer);
            };

            layer.add(marker);
        });

        test("add attaches marker", function() {
            layer.add({ location: [50, 10] });
            deepEqual(layer.items[0].element.parent()[0], layer.element[0]);
        });

        test("add shows marker at location", function() {
            layer.add({ location: [50, 10] });
            deepEqual(layer.items[0].element.position(), {
                left: 10, top: 50
            });
        });

        test("updates location", function() {
            var marker = layer.add({ location: [50, 10] });
            marker.showAt = function(point) {
                equal(point.x, 10);
                equal(point.y, 50);
            };

            layer.update(marker);
        });

        test("remove destroys marker", function() {
            var marker = layer.add({ location: [50, 10] });
            marker.destroy = function() { ok(true); };

            layer.remove(marker);
        });

        test("remove removes marker from items", function() {
            var marker = layer.add({ location: [50, 10] });
            layer.remove(marker);

            ok(!dataviz.inArray(marker, layer.items));
        });

        test("clear destroys all markers", 2, function() {
            layer.add([{}, {}]);
            layer.items[0].destroy = layer.items[1].destroy =
                function() { ok(true); };

            layer.clear();
        });

        test("clears items", function() {
            layer.add([{}, {}]);
            layer.clear();

            equal(layer.items.length, 0);
        });

        test("reset updates all markers", 2, function() {
            layer.add([{}, {}]);
            layer.update = function() { ok(true); };
            layer.reset();
        });

        test("destroy clears markers", function() {
            layer.clear = function() { ok(true); };
            layer.destroy();
        });

        test("destroy detaches handlers", function() {
            map.unbind = function(name, handler) {
                if (name === "reset") {
                    ok(true);
                }
            };

            layer.destroy();
        });

        // ------------------------------------------------------------
        function createBoundLayer(options) {
            layer = new MarkerLayer(map, deepExtend({
                dataSource: {
                    data: [{
                        location: [10, 10],
                        text: "Foo"
                    }, {
                        location: [20, 20],
                        text: "Foo"
                    }]
                }
            }, options));

            marker = layer.items[0];
        }

        module("Marker Layer / Data Binding", {
            setup: function() {
                map = new MapMock();
                createBoundLayer();
            },
            teardown: function() {
                map.destroy();
            }
        });

        test("creates markers from data source", function() {
            equal(layer.items.length, 2);
        });

        test("binds location", function() {
            createBoundLayer({ locationField: "location" });
            equal(marker.options.location[0], 10);
            equal(marker.options.location[1], 10);
        });

        test("applies default shape", function() {
            createBoundLayer({ shape: "foo" });
            equal(marker.options.shape, "foo");
        });

        test("does not apply map.markerDefaults", function() {
            map.markerDefaults = { foo: true };
            createBoundLayer();
            ok(!marker.options.foo);
        });
    })();

    baseLayerTests("Marker Layer", MarkerLayer);
})();
