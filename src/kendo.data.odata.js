(function($, undefined) {
    var kendo = window.kendo,
        extend = $.extend,
        odataFilters = {
            eq: "eq",
            neq: "ne",
            gt: "gt",
            gte: "ge",
            lt: "lt",
            lte: "le",
            contains : "substringof",
            endswith: "endswith",
            startswith: "startswith"
        },
        mappers = {
            pageSize: $.noop,
            page: $.noop,
            filter: function(params, filter) {
                if (filter) {
                    params.$filter = toOdataFilter(filter);
                }
            },
            sort: function(params, orderby) {
                params.$orderby = $.map(orderby, function(value) {
                    var order = value.field.replace(/\./g, "/");

                    if (value.dir === "desc") {
                        order += " desc";
                    }

                    return order;
                }).join(",");
            },
            skip: function(params, skip) {
                if (skip) {
                    params.$skip = skip;
                }
            },
            take: function(params, take) {
                if (take) {
                    params.$top = take;
                }
            }
        },
        defaultDataType = {
            read: {
                dataType: "jsonp"
            }
        };

    function toOdataFilter(filter) {
        var result = [],
            logic = filter.logic || "and",
            idx,
            length,
            field,
            type,
            format,
            operator,
            value,
            filters = filter.filters;

        for (idx = 0, length = filters.length; idx < length; idx++) {
            filter = filters[idx];
            field = filter.field;
            value = filter.value;
            operator = filter.operator;

            if (filter.filters) {
                filter = toOdataFilter(filter);
            } else {
                field = field.replace(/\./g, "/"),

                filter = odataFilters[operator];

                if (filter && value !== undefined) {
                    type = $.type(value);
                    if (type === "string") {
                        format = "'{1}'";
                        value = value.replace(/'/g, "''");
                    } else if (type === "date") {
                        format = "datetime'{1:yyyy-MM-ddTHH:mm:ss}'";
                    } else {
                        format = "{1}";
                    }

                    if (filter.length > 3) {
                        if (filter !== "substringof") {
                            format = "{0}({2}," + format + ")";
                        } else {
                            format = "{0}(" + format + ",{2})";
                        }
                    } else {
                        format = "{2} {0} " + format;
                    }

                    filter = kendo.format(format, filter, value, field);
                }
            }

            result.push(filter);
        }

        filter = result.join(" " + logic + " ");

        if (result.length > 1) {
            filter = "(" + filter + ")";
        }

        return filter;
    }

    extend(true, kendo.data, {
        schemas: {
            odata: {
                type: "json",
                data: "d.results",
                total: "d.__count"
            }
        },
        transports: {
            odata: {
                read: {
                    cache: true, // to prevent jQuery from adding cache buster
                    dataType: "jsonp",
                    jsonp: "$callback"
                },
                update: {
                    cache: true,
                    dataType: "json",
                    contentType: "application/json", // to inform the server the the request body is JSON encoded
                    type: "PUT" // can be PUT or MERGE
                },
                create: {
                    cache: true,
                    dataType: "json",
                    contentType: "application/json",
                    type: "POST" // must be POST to create new entity
                },
                destroy: {
                    cache: true,
                    dataType: "json",
                    type: "DELETE"
                },
                parameterMap: function(options, type) {
                    type = type || "read";

                    var params = {
                            $format: "json",
                            $inlinecount: "allpages"
                        },
                        option,
                        dataType = (this.options || defaultDataType)[type].dataType;

                    options = options || {};

                    for (option in options) {
                        if (mappers[option]) {
                            mappers[option](params, options[option]);
                        } else {
                            params[option] = options[option];
                        }
                    }
                    return params;
                }
            }
        }
    });
})(jQuery);
