(function() {
    var win,
        kendoHistory,
        _history,
        initial,
        win,
        loc,
        root,
        pushStateSupported = kendo.support.pushState;

    module("History", {
        setup: function() {
            location.hash = "";
            QUnit.stop();
            QUnit.fixture.html('<iframe src="/base/tests/router/sandbox.html"></iframe>');
            win = window.frames[0].window;

            $(win).one('load', function() {
                loc = win.location;
                root = loc.pathname;
                initial = loc.href.replace(/#.*$/, '');
                kendoHistory = win.kendo.history;
                _history = win.history;
                QUnit.start();
            });
        },

        teardown: function() {
            if (win.kendo) {
                win.kendo.support.pushState = pushStateSupported;
                kendoHistory.stop();
            }
        }
    });

    function url(expected) {
        equal(loc.href.replace(/#$/, ''), expected);
    }

    function startWithHash() {
        kendoHistory.start({root: root});
    }

    function startWithPushState() {
        kendoHistory.start({pushState: true, root: root});
    }

    test("uses hashbang by default", function() {
        startWithHash();
        kendoHistory.navigate("/new-location");
        url(initial + "#/new-location");
    });

    test("keeps track of locations", 2, function() {
        startWithHash();
        equal(kendoHistory.locations.length, 1);
        equal(kendoHistory.locations[0], "");
    });

    test("uses pushState if possible and asked to", function() {
        startWithPushState();
        kendoHistory.navigate("/new-location");
        if (!!pushStateSupported) {
            url(initial + "/new-location");
        }
        else {
            url(initial + "#/new-location");
        }
    });

    test("does not pushState if identical", function() {
        startWithPushState();
        kendoHistory.navigate("/new-location");
        var length = history.length;
        kendoHistory.navigate("/new-location");
        equal(history.length, length);
    });

    asyncTest("transforms pushState to non-push state when needed", 1, function() {
        if (!pushStateSupported) {
            start();
            ok(true);
            return;
        }

        startWithPushState();

        kendoHistory.navigate("/new-location");

        var currentLocation = loc.href;

        var check = function() {
            var newLocation = frames[0].window.location.href;
            if (newLocation != currentLocation) {
                start();
                equal(newLocation, initial + "#/new-location");
            } else {
                setTimeout(check, 100);
            }
        }

        kendoHistory.stop();
        win.kendo.support.pushState = false;
        startWithPushState();
        check();
    });

    asyncTest("transforms hash to push state on start", function() {
        expect(1);

        if (!pushStateSupported) {
            start();
            ok(true);
            return;
        }

        startWithHash();
        kendoHistory.navigate("/new-location");

        var currentLocation = loc.href;

        var check = function() {
            var newLocation = frames[0].window.location.href;
            if (newLocation != currentLocation) {
                start();
                equal(newLocation, initial + "/new-location");
            } else {
                setTimeout(check, 100);
            }
        }

        kendoHistory.stop();
        startWithPushState();
        check();
    });

    test("allows setting of root", function() {
        if (!pushStateSupported) {
            return;
        }

        kendoHistory.start({root: root + "/subdir/", pushState: true});
        kendoHistory.navigate('/new-location');
        url(initial + "/subdir/new-location");
    });

    test("strips root in current field after navigation", 2, function() {
        if (!pushStateSupported) {
            return;
        }

        kendoHistory.start({root: root + "/subdir/", pushState: true});
        kendoHistory.navigate(root + '/subdir/new-location');
        url(initial + "/subdir/new-location");
        equal(kendoHistory.current, "new-location");
    });

    test("triggers events when history changed", function() {
        expect(1);
        startWithHash();

        kendoHistory.change(function(e) {
            equal(e.url, "/new-location");
        });

        kendoHistory.navigate("/new-location");
    });

    test("Allows prevention of hash change if preventDefault called", 1, function() {
        startWithHash();

        kendoHistory.change(function(e) {
            e.preventDefault();
        });

        kendoHistory.navigate("/new-location");
        url(initial);
    });

    asyncTest("Allows prevention of back if preventDefault called", 1, function() {
        startWithHash();

        kendoHistory.navigate("/initial-location");
        kendoHistory.navigate("/new-location");

        kendoHistory.change(function(e) {
            e.preventDefault();
        });

        _history.back();

        setTimeout(function() {
            start();
            url(initial + "#/new-location");
        }, 300);
    });

/*
 * Test is very erratic, but has certain value - can be run for troubleshooting
    asyncTest("Allows prevention of navigating to previous URL (not back) if preventDefault called", 1, function() {
        startWithHash();

        kendoHistory.navigate("/initial-location");
        kendoHistory.navigate("/new-location");

        kendoHistory.change(function(e) {
            e.preventDefault();
        });

        setTimeout(function() {
            loc.href = initial + "#/initial-location";
        }, 300);

        setTimeout(function() {
            start();
            url(initial + "#/new-location");
        }, 600);
    });
*/

    asyncTest("Triggers back", 2, function() {
        startWithHash();

        kendoHistory.navigate("/initial-location");
        kendoHistory.navigate("/new-location");

        kendoHistory.bind("back", function(e) {
            equal(e.url, "/new-location");
            equal(e.to, "/initial-location");
        });

        _history.back();

        setTimeout(function() {
            start();
        }, 300);
    });

    asyncTest("Allows prevention of back if preventDefault in back event called", 1, function() {
        startWithHash();

        kendoHistory.navigate("/initial-location");
        kendoHistory.navigate("/new-location");

        kendoHistory.bind("back", function(e) {
            e.preventDefault();
        });

        _history.back();

        setTimeout(function() {
            start();
            url(initial + "#/new-location");
        }, 300);
    });

    asyncTest("Allows prevention of hash change by clicked link if preventDefault called", 1, function() {
        startWithHash();

        kendoHistory.navigate("/bar")
        kendoHistory.change(function(e) {
            e.preventDefault();
        });

        loc.href = loc.href.replace("#/bar", "#/foo");

        setTimeout(function() {
            start();
            url(initial + "#/bar");
        }, 300);
    });

    test("strips hash from passed urls", function() {
        startWithHash();
        kendoHistory.navigate('#/new-location');
        equal(kendoHistory.current, '/new-location');
    });

    test("accepts event handlers passed as options", function() {
        expect(1);

        kendoHistory.start({root: root, change: function(e) { equal(e.url, "/new-location"); }});

        kendoHistory.navigate("/new-location");
    });

    test("triggers ready with the initial location", function() {
        expect(1);

        win.location.hash = "/initial-location";
        kendoHistory.start({root: root });
        equal(kendoHistory.current, "/initial-location");
    });

    asyncTest("listens for outside url changes (hashChange)", function() {
        expect(1);
        startWithHash();

        kendoHistory.change(function(e) {
            start();
            equal(e.url, "/outside-location");
        });

        win.location.hash = "/outside-location";
    });

    test("passes parameters if any present", function() {
        expect(1);
        startWithHash();

        kendoHistory.change(function(e) {
            equal(e.url, "/new-location?foo=bar");
        });

        kendoHistory.navigate("/new-location?foo=bar");
    });

    asyncTest("supports #:back pseudo url for going back", 1, function() {
        startWithHash();
        kendoHistory.navigate("/new-location");
        kendoHistory.navigate("#:back");
        setTimeout(function() {
            start();
            equal(loc.hash, '');
        }, 300);
    });

    asyncTest("stays in sync after back is called", 2, function() {
        startWithHash();
        kendoHistory.navigate("/initial-location");
        kendoHistory.navigate("/new-location");
        kendoHistory.navigate("#:back");

        setTimeout(function() {
            start();
            equal(kendoHistory.locations.length, 2);
            equal(kendoHistory.locations[0], "");
        }, 300);
    });

    asyncTest("handles back in push state", 1, function() {
        startWithPushState();
        kendoHistory.navigate("/foo");
        kendoHistory.navigate("/bar");
        kendoHistory.navigate("/baz");
        _history.back();

        setTimeout(function() {
            _history.back();
            setTimeout(function() {
                start();
                equal(kendoHistory.locations.length, 2);
            }, 200);
        }, 200);
    });
})();
