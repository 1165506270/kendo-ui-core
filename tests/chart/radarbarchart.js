(function() {
    var dataviz = kendo.dataviz,
        getElement = dataviz.getElement,
        Point2D = dataviz.Point2D,
        Box2D = dataviz.Box2D,
        Ring = dataviz.Ring,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

    function SegmentStub(sector) {
        this.sector = sector.clone();
    }

    SegmentStub.prototype = {
        reflow: function(sector) {
            this.sector = sector.clone();
        }
    };


    (function() {
        var cluster,
            s1,
            s2;

        function createCluster(options) {
            var segmentSector = new Ring(new Point2D(0, 0), 0, 10, 90, 90),
            segments = [ new SegmentStub(segmentSector), new SegmentStub(segmentSector) ];

            cluster = new dataviz.RadarClusterLayout(options);
            [].push.apply(cluster.children, segments);
            cluster.reflow(new Ring(new Point2D(0, 0), 0, 100, 90, 90));

            s1 = segments[0].sector;
            s2 = segments[1].sector;
        }

        // ------------------------------------------------------------
        module("Cluster Layout", {
            setup: function() {
                createCluster({ gap: 0 });
            }
        });

        test("retains children radius", function() {
            equal(s1.r, 10);
            equal(s2.r, 10);
        });

        test("distributes width evenly", function() {
            equal(s1.angle, 45);
            equal(s2.angle, 45);
        });

        test("positions children next to each other", function() {
            equal(s1.startAngle, 90);
            equal(s2.startAngle, 135);
        });

        test("leaves 50% gap on both sides", function() {
            createCluster({ gap: 1 });

            equal(s1.startAngle, 105);
            equal(s2.startAngle + s2.angle, 165);
        });

        test("positions children next to each other with spacing", function() {
            createCluster({ gap: 0, spacing: 1 });

            equal(s1.startAngle + s1.angle, 120);
            equal(s2.startAngle, 150);
        });

    })();

    (function() {
        var stack,
            segments,
            s1,
            s2;

        function createStack(options) {
            var segmentSector = new Ring(new Point2D(0, 0), 0, 10, 90, 90);
            segments = [ new SegmentStub(segmentSector), new SegmentStub(segmentSector) ];

            stack = new dataviz.RadarStackLayout(options);
            [].push.apply(stack.children, segments);

            stack.reflow(new Ring(new Point2D(0, 0), 0, 100, 110, 70));

            s1 = segments[0].sector;
            s2 = segments[1].sector;
        }

        // ------------------------------------------------------------
        module("Stack Layout", {
            setup: function() {
                createStack();
            }
        });

        test("first sector radius is not changed", function() {
            equal(s1.r, 10);
        });

        test("first sector is fitted in sector segment", function() {
            equal(s1.startAngle, 110);
            equal(s1.angle, 70);
        });

        test("second sector radius is updated", function() {
            equal(s2.r, s2.ir + 10);
        });

        test("second sector is fitted in sector segment", function() {
            equal(s1.startAngle, 110);
            equal(s1.angle, 70);
        });

        test("second sector inner radius equals first sector radius", function() {
            equal(s2.ir, 10);
        });

        // ------------------------------------------------------------
        module("Stack Layout / Inverted", {
            setup: function() {
                createStack({ isReversed: true });
            }
        });

        test("first sector radius is updated", function() {
            equal(s1.r, s1.ir + 10);
        });

        test("first sector is fitted in sector segment", function() {
            equal(s1.startAngle, 110);
            equal(s1.angle, 70);
        });

        test("second sector radius is updated", function() {
            equal(s2.r, 10);
        });

        test("second sector is fitted in sector segment", function() {
            equal(s1.startAngle, 110);
            equal(s1.angle, 70);
        });

        test("first sector inner radius equals first sector radius", function() {
            equal(s1.ir, 10);
        });

    })();
})();
