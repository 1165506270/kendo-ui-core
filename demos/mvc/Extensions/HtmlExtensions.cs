﻿using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections.Generic;
using Kendo.Models;
using System.Collections.Specialized;
using System.Configuration;
using System.Text;

namespace Kendo.Extensions
{
    public static class HtmlExtensions
    {
        public static IHtmlString SuiteLink(this HtmlHelper html, string suite, string title = "", string cssClass = "")
        {
            title = string.IsNullOrEmpty(title) ? suite : title;

            suite = suite.ToLowerInvariant();

            var Url = new UrlHelper(html.ViewContext.RequestContext);

            var viewBag = html.ViewContext.Controller.ViewBag;

            var selectedClass = viewBag.Suite == suite ? " selected" : "";

            return html.Raw(
                string.Format("<a id=\"{0}\" class=\"{1}\" href=\"{2}\">{3}</a>",
                    suite,
                    (cssClass + selectedClass).Trim(),
                    Url.Suite(suite),
                    title
                )
            );
        }

        public static IHtmlString ActiveSuiteClass(this HtmlHelper html, string title)
        {
            if (html.ViewContext.HttpContext.Request.Path.Contains(title.ToLowerInvariant()))
            {
                return html.Raw(" class=\"active\"");
            }

            return html.Raw("");
        }
        
        public static IHtmlString ExampleLink(this HtmlHelper html, NavigationExample example, string suite)
        {
            var Url = new UrlHelper(html.ViewContext.RequestContext);

            var href = Url.Content("~/" + example.Url);

            href = Url.ApplyProduct(href);

            return html.Raw(string.Format("<a {0} {1} href=\"{2}\">{3}</a>",
                    example.New ? "class=\"new-example\"" : "",
                    example.External ? "rel=\"external\"" : "",
                    href,
                    example.Text
            ));
        }

        public static String CdnRoot(this HtmlHelper html)
        {
#if DEBUG
            return "http://cdn.kendostatic.com/2013.3.1324";
#else
            return ConfigurationManager.AppSettings["CDN_ROOT"];
#endif
        }

        public static String DojoRoot(this HtmlHelper html)
        {
#if DEBUG
            return "http://127.0.0.1:3000/";
#else
            return ConfigurationManager.AppSettings["DOJO_ROOT"];
#endif
        }

        public static IHtmlString WidgetLink(this HtmlHelper html, NavigationWidget widget)
        {
            var Url = new UrlHelper(html.ViewContext.RequestContext);

            var viewBag = html.ViewContext.Controller.ViewBag;

            var href = Url.Content("~/" + widget.Items[0].Url);

            href = Url.ApplyProduct(href);

            var className = "";


            if (widget.Text == "Theme Builder")
            {
                className = "theme-builder";
            }

            var text = widget.Text;
            if (widget.Tablet)
            {
                text += "(tablet)";
            }

            var target = "";

            StringBuilder a = new StringBuilder();

            a.Append("<a ");

            if (!string.IsNullOrEmpty(className))
            {
                a.AppendFormat("class=\"{0}\" ", className);
            }

            if (!string.IsNullOrEmpty(target))
            {
                a.AppendFormat("target=\"{0}\" ", target);
            }

            a.AppendFormat("href=\"{0}\">", href);
            a.Append(text);
            a.Append("</a>");

            if (widget.Pro)
            {
                a.Append("<span title=\"Available only in Kendo UI Professional\" class=\"pro-widget\"></span>");
            }
            
            if (widget.Beta)
            {
                a.Append("<span class=\"beta-widget\"></span>");
            }

            if (widget.New)
            {
                a.Append("<span class=\"new-widget\"></span>");
            }

            return html.Raw(a.ToString());
        }

        public static bool MergesWithNext(this HtmlHelper html, string category)
        {
            category = category.ToLower();

            return category.Contains("applications") || category.Contains("gauges") || category.Contains("financial") || category.Contains("geoviz");
        }

        public static string NavigationWrapperClass(this HtmlHelper html, string category)
        {
            var classNames = new List<string> { "floatWrap" };

            category = category.ToLower();

            if (category.Contains("ui") || category.Contains("dashboard"))
            {
                classNames.Add("wideCol");
            }
            else
            {
                classNames.Add("narrowCol");
            }

            if (category.Contains("application") || category.Contains("dashboard"))
            {
                classNames.Add("dashboards");
            }
            else if (category.Contains("themes"))
            {
                classNames.Add("custom-themes");
            }
            else if (category.Equals("framework"))
            {
                classNames.Add("framework");
            }
            else if (category.Contains("mobile widgets"))
            {
                classNames.Add("mobile-widgets");
            }
            else if (category.Contains("mobile framework"))
            {
                classNames.Add("mobile-framework");
            }
            else if (category.Contains("chart"))
            {
                classNames.Add("chart");
            }
            else if (category.Contains("gauges"))
            {
                classNames.Add("gauges");
            }
            else if (category.Contains("qr codes"))
            {
                classNames.Add("qrcodes");
            }
            else if (category.Contains("financial"))
            {
                classNames.Add("financial");
            }
            else if (category.Contains("geoviz"))
            {
                classNames.Add("geoviz");
            }

            return String.Join(" ", classNames);
        }
    }
}
