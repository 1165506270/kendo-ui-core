﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace Kendo.Models
{
    public static class StyleGroups
    {
        public static readonly IList<string> All = new string[]
        {
#if DEBUG
            "web/kendo.common.less",
            "web/kendo.rtl.css",
            "web/kendo.default.less",
            "dataviz/kendo.dataviz.css",
            "dataviz/kendo.dataviz.default.css"
#else
            "kendo.common.min.css",
            "kendo.rtl.min.css",
            "kendo.default.min.css",
            "kendo.dataviz.min.css",
            "kendo.dataviz.default.min.css"
#endif
        };

        public static readonly IList<string> Metro = new string[]
        {
#if DEBUG
            "web/kendo.common.less",
            "web/kendo.rtl.css",
            "web/kendo.metro.less",
            "dataviz/kendo.dataviz.css",
            "dataviz/kendo.dataviz.metro.css"
#else
            "kendo.common.min.css",
            "kendo.rtl.min.css",
            "kendo.metro.min.css",
            "kendo.dataviz.min.css",
            "kendo.dataviz.metro.min.css"
#endif
        };

        public static readonly IList<string> Simulator = new string[]
        {
#if DEBUG
            "web/kendo.common.less",
            "web/kendo.black.less"
#else
            "kendo.common.min.css",
            "kendo.black.min.css"
#endif
        };

        public static readonly IList<string> Mobile = new string[]
        {
#if DEBUG
            "web/kendo.common.less",
            "web/kendo.default.less",
            "mobile/kendo.mobile.all.less"
#else
            "kendo.common.min.css",
            "kendo.default.min.css",
            "kendo.mobile.all.min.css"
#endif
        };

        public static readonly IList<string> Bootstrap = new string[]
        {
#if DEBUG
            "web/kendo.common-bootstrap.less",
            "web/kendo.bootstrap.less",
            "dataviz/kendo.dataviz.css",
            "dataviz/kendo.dataviz.bootstrap.css"
#else
            "kendo.common-bootstrap.min.css",
            "kendo.bootstrap.min.css",
            "kendo.dataviz.min.css",
            "kendo.dataviz.bootstrap.min.css"
#endif
        };
    }
}
