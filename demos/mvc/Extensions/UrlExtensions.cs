﻿using System;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;
using System.Web.Hosting;

namespace Kendo.Extensions
{
    public static class UrlExtensions
    {
        public static string ContentOrEmpty(this UrlHelper url, string contentUrl)
        {
            if (string.IsNullOrEmpty(contentUrl))
            {
                return "";
            }

            return url.Content(contentUrl);
        }

        public static string Widget(this UrlHelper url, string widget)
        {
            return url.RouteUrl("Demo", new { section = widget, example="index" });
        }

        public static string Script(this UrlHelper url, string file)
        {
            return ResourceUrl(url, "js", file);
        }

        public static string Style(this UrlHelper url, string file)
        {
            return ResourceUrl(url, "styles", file);
        }

        private static string ResourceUrl(UrlHelper url, string assetType, string file)
        {
#if DEBUG
            return url.Content(string.Format("~/src/{0}/{1}", assetType, file));
#else
            if (IsAbsoluteUrl(file)) {
                return file;
            }

            return url.Content(string.Format("{0}/{1}/{2}",
                ConfigurationManager.AppSettings["CDN_ROOT"],
                assetType,
                file
            ));
#endif
        }

        private static bool IsAbsoluteUrl(string url)
        {
            Uri result;
            return Uri.TryCreate(url, UriKind.Absolute, out result);
        }
    }
}
