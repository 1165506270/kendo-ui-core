(function($, undefined) {

    // Removing the G flag will cause infinite loop.
    var gradientRegExp = /(?:-\w+?-)?(?:linear|webkit)-gradient\s*?\((?:linear\s*,\s*)?[\s,]*?(.+?,)([^#t\(]+?,)?\s*((?:(?:(?:rgba?|color-stop|from|to)\(.+?\)|#[\d\w]+|transparent)[\s\d\w%]*?[,\s\)]*)+)\)/ig,
        detailRegExp = /(rgba?\([^\)]+?\)|#[\d\w]+|transparent)\s*([\d\.\w%]*)|color-stop\(([\d.]*)[\s,]*(rgba?\([^\)]+?\)|#[\d\w]+)\s*\)/ig,
        stripRegExp = /^\s*|\s*$|,/g,
        splitRegExp = /\s*,\s*/,
        numberRegExp = /\d/,
        zeroTrimRegExp = /^0+|\.?0+$/g,
        directions = {
            top: {
                value: "0",
                limit: "100%"
            },
            bottom: {
                value: "100%",
                limit: "0"
            },
            left: {
                value: "0",
                limit: "100%"
            },
            right: {
                value: "100%",
                limit: "0"
            },
            center: {
                value: "50%",
                limit: "50%"
            }
        }, angles = { // hopefully temporary
            percent: { "0 50%": 0, "50% 100%": 90, "100% 50%": 180, "50% 0": 270, "0 100%": 45, "100% 100%": 135, "100% 0": 225, "0 0": 315 },
            directions: { "0": "left", "90": "bottom", "180": "right", "270": "top", "45": "bottom left", "135": "bottom right", "225": "top right", "315": "top left" }
        };

    function trimZeroes(value) {
        return value.toPrecision(2).replace(zeroTrimRegExp, "");
    }

    function normalizePosition(value, inverted) {
        var output = value.split(" ");

        if (output.length == 1) {
            if (/left|right/.test(output[0])) {
                output = output.concat("center");
            } else {
                output = [ "center" ].concat(output);
            }
        }

        for (var i = 0, len = output.length; i < len; i++) {
            if (!numberRegExp.test(output[i])) {
                if (inverted) {
                    output[i] = directions[output[i]].limit;
                } else {
                    output[i] = directions[output[i]].value;
                }
            } else {
                output[i] = output[i].replace(/^0%/, "0");
            }
        }

        return output.join(" ");
    }

    window.Gradient = kendo.Observable.extend({
        init: function(cssValue) {
            cssValue = cssValue.indexOf("gradient") != -1 ? cssValue : "linear-gradient(left,rgba(0,0,0,0),rgba(0,0,0,0))";
            this.value = this.parseGradient(cssValue);
        },

        parseGradient: function (cssValue) {
            var output = [], counter = -1, matches, details, i, lastPosition, color, position, isStandard, buf;

            while((matches = gradientRegExp.exec(cssValue)) !== null) {
                output[++counter] = {};

                buf = matches[1].replace(stripRegExp, "");
                output[counter].start = {
                    original: buf,
                    normalized: normalizePosition(buf)
                };

                output[counter].angle = angles.percent[output[counter].start.normalized];
                output[counter].stops = [];

                if (matches[2]) {
                    buf = matches[2].replace(stripRegExp, "");
                    output[counter].end = {
                        original: buf,
                        normalized: normalizePosition(buf)
                    };
                } else {
                    output[counter].end = {
                        original: false,
                        normalized: normalizePosition(buf, true)
                    };
                }

                i = 0;

                while((details = detailRegExp.exec(matches[3])) !== null) {
                    color = details[1] || details[4];
                    isStandard = typeof details[2] != "undefined";
                    position = isStandard ? details[2] || 0 : details[3] * 100 || 0;
                    lastPosition = isStandard ? details[2] : details[3] * 100;

                    output[counter].stops[i++] = {
                        color: new Color(color),
                        position: parseFloat(position)
                    };
                }

                if (output[counter].stops[i-1].position === 0 && lastPosition == "") {
                    output[counter].stops[i-1].position = 100;
                }
            }

            return output;
        },

        get: function ( prefixes, index, direction ) {
            var output = "", that = this,
                target = !isNaN(index) ? [ that.value[index]] : that.value;

            if (typeof prefixes == "undefined") {
                prefixes = [ kendo.support.transforms.css ];
            } else if (typeof prefixes == "string") {
                prefixes = prefixes.split(splitRegExp);
            }

            $.each (prefixes, function (idx, value) {
                target.forEach(function(gradient) {
                    if (value == "-webkit-") {
                        output += that._getWebKitGradient(gradient, direction);
                    } else {
                        output += that._getStandardGradient(gradient, value, direction);
                    }
                });
                output = output.substring(0, output.length-1);
            });

            return output;
        },

        setAngle: function (index, angle) {
            angle = angle % 360;

            var that = this,
                direction = angles.directions[angle];

            that.value[index].angle = angle;

            that.value[index].start.original = direction;
            that.value[index].start.normalized = normalizePosition(direction);
            that.value[index].end.original = false;
            that.value[index].end.normalized = normalizePosition(direction, true);
        },

        _getStandardGradient: function (gradient, prefix, direction) {
            var output = "", parsed, clone = $.extend([], gradient.stops);

            output += prefix + "linear-gradient(" + (direction ? direction : gradient.start.original) + "," + (gradient.end.original ? gradient.end.original + "," : "" );

            clone.sort(function(a,b) {
                return a.position - b.position; // Always return sorted stops or W3C gradients get confused.
            }).forEach(function(stop) {
                parsed = parseInt(stop.position, 10);

                output += stop.color.get() + (parsed != 0 && stop.position != "100" ? " " + stop.position + "%" : "") + ",";
            });

            return output.substring(0, output.length - 1) + "),";
        },

        _getWebKitGradient: function (gradient, direction) {
            var output = "",
                normalizedStart = direction ? normalizePosition(direction) : null,
                normalizedEnd = direction ? normalizePosition(direction, true) : null;

            output += "-webkit-gradient(linear," + (direction ? normalizedStart : gradient.start.normalized) + "," + (direction ? normalizedEnd : gradient.end.normalized) + ",";

            gradient.stops.forEach(function(stop) {
                output += "color-stop(" + (trimZeroes(stop.position / 100) || "0") + ", " + stop.color.get() + "),";
            });

            return output.substring(0, output.length - 1) + "),";
        }
    });

})(jQuery);
