(function(f, define){
    define([ "./core", "./mixins", "../text-metrics" ], f);
})(function(){

(function ($) {

    // Imports ================================================================
    var kendo = window.kendo,
        Class = kendo.Class,
        deepExtend = kendo.deepExtend,

        dataviz = kendo.dataviz,

        g = dataviz.geometry,
        Point = g.Point,
        Rect = g.Rect,
        Size = g.Size,
        Matrix = g.Matrix,
        toMatrix = g.toMatrix,

        drawing = dataviz.drawing,
        OptionsStore = drawing.OptionsStore,

        math = Math,
        pow = math.pow,

        util = dataviz.util,
        append = util.append,
        arrayLimits = util.arrayLimits,
        defined = util.defined,
        last = util.last,
        ObserversMixin = util.ObserversMixin,

        inArray = $.inArray;

    // Drawing primitives =====================================================
    var Element = Class.extend({
        init: function(options) {
            this._initOptions(options);
        },

        _initOptions: function(options) {
            options = options || {};

            var transform = options.transform;
            if (transform) {
                options.transform = g.transform(transform);
            }

            this.options = new OptionsStore(options);
            this.options.addObserver(this);
        },

        transform: function(transform) {
            if (defined(transform)) {
                this.options.set("transform", g.transform(transform));
            } else {
                return this.options.get("transform");
            }
        },

        parentTransform: function() {
            var element = this,
                transformation,
                matrix,
                parentMatrix;

            while (element.parent) {
                element = element.parent;
                transformation = element.transform();
                if (transformation) {
                    parentMatrix = transformation.matrix().multiplyCopy(parentMatrix || Matrix.unit());
                }
            }

            if (parentMatrix) {
                return g.transform(parentMatrix);
            }
        },

        currentTransform: function(parentTransform) {
            var elementTransform = this.transform(),
                elementMatrix = toMatrix(elementTransform),
                parentMatrix,
                combinedMatrix;

            if (!defined(parentTransform)) {
                parentTransform = this.parentTransform();
            }

            parentMatrix = toMatrix(parentTransform);

            if (elementMatrix && parentMatrix) {
                combinedMatrix = parentMatrix.multiplyCopy(elementMatrix);
            } else {
                combinedMatrix = elementMatrix || parentMatrix;
            }

            if (combinedMatrix) {
                return g.transform(combinedMatrix);
            }
        },

        visible: function(visible) {
            if (defined(visible)) {
                this.options.set("visible", visible);
                return this;
            } else {
                return this.options.get("visible") !== false;
            }
        }
    });

    deepExtend(Element.fn, ObserversMixin);

    var Group = Element.extend({
        init: function(options) {
            Element.fn.init.call(this, options);
            this.children = [];
        },

        childrenChange: function(action, items, index) {
            this.trigger("childrenChange",{
                action: action,
                items: items,
                index: index
            });
        },

        traverse: function(callback) {
            var children = this.children;

            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                callback(child);

                if (child.traverse) {
                    child.traverse(callback);
                }
            }

            return this;
        },

        append: function() {
            append(this.children, arguments);
            updateElementsParent(arguments, this);

            this.childrenChange("add", arguments);

            return this;
        },

        remove: function(element) {
            var index = inArray(element, this.children);
            if (index >= 0) {
                this.children.splice(index, 1);
                element.parent = null;
                this.childrenChange("remove", [element], index);
            }

            return this;
        },

        removeAt: function(index) {
            if (0 <= index && index < this.children.length) {
                var element = this.children[index];
                this.children.splice(index, 1);
                element.parent = null;
                this.childrenChange("remove", [element], index);
            }

            return this;
        },

        clear: function() {
            var items = this.children;
            this.children = [];
            updateElementsParent(items, null);

            this.childrenChange("remove", items, 0);

            return this;
        },

        bbox: function(transformation) {
            return elementsBoundingBox(this.children, true, this.currentTransform(transformation));
        },

        rawBBox: function() {
            return elementsBoundingBox(this.children, false);
        },

        currentTransform: function(transformation) {
            return Element.fn.currentTransform.call(this, transformation) || null;
        }
    });

    var Text = Element.extend({
        init: function(content, position, options) {
            Element.fn.init.call(this, options);

            this.content(content);
            this.position(position || new g.Point());

            if (!this.options.font) {
                this.options.font = "12px sans-serif";
            }

            if (!defined(this.options.fill)) {
                this.fill("#000");
            }
        },

        content: function(value) {
            if (defined(value)) {
                this.options.set("content", value);
                return this;
            } else {
                return this.options.get("content");
            }
        },

        measure: function() {
            var metrics = util.measureText(this.content(), {
                font: this.options.get("font")
            });

            return metrics;
        },

        rect: function() {
            var size = this.measure();
            var pos = this.position().clone();
            return new g.Rect(pos, [size.width, size.height]);
        },

        bbox: function(transformation) {
            var combinedMatrix = toMatrix(this.currentTransform(transformation));
            return this.rect().bbox(combinedMatrix);
        },

        rawBBox: function() {
            return this.rect().bbox();
        }
    });
    deepExtend(Text.fn, drawing.mixins.Paintable);
    definePointAccessors(Text.fn, ["position"]);

    var Circle = Element.extend({
        init: function(geometry, options) {
            Element.fn.init.call(this, options);
            this.geometry(geometry || new g.Circle());

            if (!defined(this.options.stroke)) {
                this.stroke("#000");
            }
        },

        bbox: function(transformation) {
            var combinedMatrix = toMatrix(this.currentTransform(transformation));
            var rect = this._geometry.bbox(combinedMatrix);
            var strokeWidth = this.options.get("stroke.width");
            if (strokeWidth) {
                expandRect(rect, strokeWidth / 2);
            }

            return rect;
        },

        rawBBox: function() {
            return this._geometry.bbox();
        }
    });
    deepExtend(Circle.fn, drawing.mixins.Paintable);
    defineGeometryAccessors(Circle.fn, ["geometry"]);

    var Arc = Element.extend({
        init: function(geometry, options) {
            Element.fn.init.call(this, options);
            this.geometry(geometry || new g.Arc());

            if (!defined(this.options.stroke)) {
                this.stroke("#000");
            }
        },

        bbox: function(transformation) {
            var combinedMatrix = toMatrix(this.currentTransform(transformation));
            var rect = this.geometry().bbox(combinedMatrix);
            var strokeWidth = this.options.get("stroke.width");

            if (strokeWidth) {
                expandRect(rect, strokeWidth / 2);
            }

            return rect;
        },

        rawBBox: function() {
            return this.geometry().bbox();
        },

        toPath: function() {
            var path = new Path();
            var curvePoints = this.geometry().curvePoints();

            if (curvePoints.length > 0) {
                path.moveTo(curvePoints[0].x, curvePoints[0].y);

                for (var i = 1; i < curvePoints.length; i+=3) {
                    path.curveTo(curvePoints[i], curvePoints[i + 1], curvePoints[i + 2]);
                }
            }

            return path;
        }
    });
    deepExtend(Arc.fn, drawing.mixins.Paintable);
    defineGeometryAccessors(Arc.fn, ["geometry"]);

    var Segment = Class.extend({
        init: function(anchor, controlIn, controlOut) {
            this.anchor(anchor || new Point());
            this.controlIn(controlIn);
            this.controlOut(controlOut);
        },

        bboxTo: function(toSegment, matrix) {
            var rect;
            var segmentAnchor = this.anchor().transformCopy(matrix);
            var toSegmentAnchor = toSegment.anchor().transformCopy(matrix);

            if (this.controlOut() && toSegment.controlIn()) {
                rect = this._curveBoundingBox(
                    segmentAnchor, this.controlOut().transformCopy(matrix),
                    toSegment.controlIn().transformCopy(matrix), toSegmentAnchor
                );
            } else {
                rect = this._lineBoundingBox(segmentAnchor, toSegmentAnchor);
            }

            return rect;
        },

        _lineBoundingBox: function(p1, p2) {
            return Rect.fromPoints(p1, p2);
        },

        _curveBoundingBox: function(p1, cp1, cp2, p2) {
            var points = [p1, cp1, cp2, p2],
                extremesX = this._curveExtremesFor(points, "x"),
                extremesY = this._curveExtremesFor(points, "y"),
                xLimits = arrayLimits([extremesX.min, extremesX.max, p1.x, p2.x]),
                yLimits = arrayLimits([extremesY.min, extremesY.max, p1.y, p2.y]);

            return Rect.fromPoints(new Point(xLimits.min, yLimits.min), new Point(xLimits.max, yLimits.max));
        },

        _curveExtremesFor: function(points, field) {
            var extremes = this._curveExtremes(
                points[0][field], points[1][field],
                points[2][field], points[3][field]
            );

            return {
                min: this._calculateCurveAt(extremes.min, field, points),
                max: this._calculateCurveAt(extremes.max, field, points)
            };
        },

        _calculateCurveAt: function (t, field, points) {
            var t1 = 1- t;

            return pow(t1, 3) * points[0][field] +
                   3 * pow(t1, 2) * t * points[1][field] +
                   3 * pow(t, 2) * t1 * points[2][field] +
                   pow(t, 3) * points[3][field];
        },

        _curveExtremes: function (x1, x2, x3, x4) {
            var a = x1 - 3 * x2 + 3 * x3 - x4;
            var b = - 2 * (x1 - 2 * x2 + x3);
            var c = x1 - x2;
            var sqrt = math.sqrt(b * b - 4 * a * c);
            var t1 = 0;
            var t2 = 1;

            if (a === 0) {
                if (b !== 0) {
                    t1 = t2 = -c / b;
                }
            } else if (!isNaN(sqrt)) {
                t1 = (- b + sqrt) / (2 * a);
                t2 = (- b - sqrt) / (2 * a);
            }

            var min = math.max(math.min(t1, t2), 0);
            if (min < 0 || min > 1) {
                min = 0;
            }

            var max = math.min(math.max(t1, t2), 1);
            if (max > 1 || max < 0) {
                max = 1;
            }

            return {
                min: min,
                max: max
            };
        }
    });
    definePointAccessors(Segment.fn, ["anchor", "controlIn", "controlOut"]);
    deepExtend(Segment.fn, ObserversMixin);

    var Path = Element.extend({
        init: function(options) {
            Element.fn.init.call(this, options);
            this.segments = [];

            if (!defined(this.options.stroke)) {
                this.stroke("#000");

                if (!defined(this.options.stroke.lineJoin)) {
                    this.options.set("stroke.lineJoin", "miter");
                }
            }
        },

        moveTo: function(x, y) {
            this.segments = [];
            this.lineTo(x, y);

            return this;
        },

        lineTo: function(x, y) {
            var point = defined(y) ? new Point(x, y) : x,
                segment = new Segment(point);

            segment.addObserver(this);

            this.segments.push(segment);
            this.geometryChange();

            return this;
        },

        curveTo: function(controlOut, controlIn, point) {
            if (this.segments.length > 0) {
                var lastSegment = last(this.segments);
                var segment = new Segment(point, controlIn);
                segment.addObserver(this);

                lastSegment.controlOut(controlOut);

                this.segments.push(segment);
            }

            return this;
        },

        close: function() {
            this.options.closed = true;
            this.geometryChange();

            return this;
        },

        bbox: function(transformation) {
            var combinedMatrix = toMatrix(this.currentTransform(transformation));
            var boundingBox = this._bbox(combinedMatrix);
            var strokeWidth = this.options.get("stroke.width");
            if (strokeWidth) {
                expandRect(boundingBox, strokeWidth / 2);
            }
            return boundingBox;
        },

        rawBBox: function() {
            return this._bbox();
        },

        _bbox: function(matrix) {
            var segments = this.segments;
            var length = segments.length;
            var boundingBox;

            if (length === 1) {
                var anchor = segments[0].anchor().transformCopy(matrix);
                boundingBox = new Rect(anchor, Size.ZERO);
            } else if (length > 0) {
                for (var i = 1; i < length; i++) {
                    var segmentBox = segments[i - 1].bboxTo(segments[i], matrix);
                    if (boundingBox) {
                        boundingBox = Rect.union(boundingBox, segmentBox);
                    } else {
                        boundingBox = segmentBox;
                    }
                }
            }

            return boundingBox;
        }
    });
    deepExtend(Path.fn, drawing.mixins.Paintable);

    Path.fromRect = function(rect, options) {
        return new Path(options)
            .moveTo(rect.topLeft())
            .lineTo(rect.topRight())
            .lineTo(rect.bottomRight())
            .lineTo(rect.bottomLeft())
            .close();
    };

    var MultiPath = Element.extend({
        init: function(options) {
            Element.fn.init.call(this, options);
            this.paths = [];

            if (!defined(this.options.stroke)) {
                this.stroke("#000");
            }
        },

        moveTo: function(x, y) {
            var path = new Path();
            path.addObserver(this);

            this.paths.push(path);
            path.moveTo(x, y);

            return this;
        },

        lineTo: function(x, y) {
            if (this.paths.length > 0) {
                last(this.paths).lineTo(x, y);
            }

            return this;
        },

        curveTo: function(controlOut, controlIn, point) {
            if (this.paths.length > 0) {
                last(this.paths).curveTo(controlOut, controlIn, point);
            }

            return this;
        },

        close: function() {
            if (this.paths.length > 0) {
                last(this.paths).close();
            }

            return this;
        },

        bbox: function(transformation) {
            return elementsBoundingBox(this.paths, true, this.currentTransform(transformation));
        },

        rawBBox: function() {
            return elementsBoundingBox(this.paths, false);
        }
    });
    deepExtend(MultiPath.fn, drawing.mixins.Paintable);

    var Image = Element.extend({
        init: function(src, rect, options) {
            Element.fn.init.call(this, options);

            this.src(src);
            this.rect(rect || new g.Rect());
        },

        src: function(value) {
            if (defined(value)) {
                this.options.set("src", value);
                return this;
            } else {
                return this.options.get("src");
            }
        },

        bbox: function(transformation) {
            var combinedMatrix = toMatrix(this.currentTransform(transformation));
            return this._rect.bbox(combinedMatrix);
        },

        rawBBox: function() {
            return this._rect.bbox();
        }
    });
    defineGeometryAccessors(Image.fn, ["rect"]);

    // Helper functions ===========================================
    function elementsBoundingBox(elements, applyTransform, transformation) {
        var boundingBox;

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.visible()) {
                var elementBoundingBox = applyTransform ? element.bbox(transformation) : element.rawBBox();
                if (elementBoundingBox) {
                    if (boundingBox) {
                        boundingBox = Rect.union(boundingBox, elementBoundingBox);
                    } else {
                        boundingBox = elementBoundingBox;
                    }
                }
            }
        }

        return boundingBox;
    }

    function updateElementsParent(elements, parent) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].parent = parent;
        }
    }

    function expandRect(rect, value) {
        rect.origin.x -= value;
        rect.origin.y -= value;
        rect.size.width += value * 2;
        rect.size.height += value * 2;
    }

    function defineGeometryAccessors(fn, names) {
        for (var i = 0; i < names.length; i++) {
            fn[names[i]] = geometryAccessor(names[i]);
        }
    }

    function geometryAccessor(name) {
        var fieldName = "_" + name;
        return function(value) {
            if (defined(value)) {
                this[fieldName] = value;
                this[fieldName].addObserver(this);
                this.geometryChange();
                return this;
            } else {
                return this[fieldName];
            }
        };
    }

    function definePointAccessors(fn, names) {
        for (var i = 0; i < names.length; i++) {
            fn[names[i]] = pointAccessor(names[i]);
        }
    }

    function pointAccessor(name) {
        var fieldName = "_" + name;
        return function(value) {
            if (defined(value)) {
                this._observerField(fieldName, Point.create(value));
                this.geometryChange();
                return this;
            } else {
                return this[fieldName];
            }
        };
    }

    // Exports ================================================================
    deepExtend(drawing, {
        Arc: Arc,
        Circle: Circle,
        Element: Element,
        Group: Group,
        Image: Image,
        MultiPath: MultiPath,
        Path: Path,
        Segment: Segment,
        Text: Text
    });

})(window.kendo.jQuery);

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
