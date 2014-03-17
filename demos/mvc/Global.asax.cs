﻿using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Routing;

namespace Kendo
{
    public class SpaViewEngine : RazorViewEngine
    {
        public SpaViewEngine()
        {
            var viewLocations =  new[] { "~/Views/web/spa/{0}.cshtml" };

            this.PartialViewLocationFormats = viewLocations;
            this.ViewLocationFormats = viewLocations;
        }
    }

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            var suiteConstraint = new { suite = "(web|dataviz|mobile)" };

            routes.MapRoute(
                "AsyncUpload",
                "web/upload/{action}",
                new { controller = "Upload" },
                new { action = "(save|remove|submit)" }
            );

            routes.MapRoute(
                "Bootstrap",
                "bootstrap",
                new { controller = "Integration", action = "Bootstrap" }
            );

            routes.MapRoute(
                "Sushi",
                "sushi",
                new { controller = "Integration", action = "Sushi" }
            );

            routes.MapRoute(
                "WebSushi",
                "websushi",
                new { controller = "Spa", action = "Sushi" }
            );

            routes.MapRoute(
                "Aeroviewr",
                "aeroviewr",
                new { controller = "Spa", action = "Aeroviewr" }
            );

            routes.MapRoute(
                "AeroviewrCallback",
                "aeroviewr/callback.html",
                new { controller = "Spa", action = "AeroviewrCallback" }
            );

            routes.MapRoute(
                "Simulator",
                "mobile/simulator",
                new { controller = "Integration", action = "Simulator" }
            );

            routes.MapRoute(
                "MobileDeviceIndex",
                "mobile/m/index.html",
                new { controller = "MobileDevice", action = "Index" }
            );

            routes.MapRoute(
                "MobileApplication",
                "mobile/apps/{app}",
                new { controller = "MobileApps", action = "Index" }
            );

            routes.MapRoute(
                "MobileApplicationInstance",
                "mobile/apps/{app}/contents",
                new { controller = "MobileApps", action = "App" }
            );

            routes.MapRoute(
                "MobileDeviceExample",
                "mobile/m/{section}/{example}.html",
                new { controller = "MobileDevice", action = "Example" }
            );

           routes.MapRoute(
               "SectionIndex.html",
               "{suite}/index.html",
               new { controller = "Suite", action = "SectionIndex", section = "overview" },
               suiteConstraint
           );

            routes.MapRoute(
                "Suite",
                "{suite}/{section}/{example}.html",
                new { controller = "Suite", action = "Index" },
                suiteConstraint
            );

            routes.MapRoute(
                "SectionIndex",
                "{suite}/{section}",
                new { controller = "Suite", action = "SectionIndex", section = "overview" },
                suiteConstraint
            );

            routes.MapRoute(
                "Debug",
                "src/{assetType}/{*file}",
                new { controller = "Debug", action = "Resource" },
                new { assetType = "(js|styles)" }
            );

            routes.MapRoute(
                "ThemeBuilder",
                "themebuilder/{suite}.html",
                new { controller = "ThemeBuilder", action = "Index" }
            );

            routes.MapRoute(
                "ThemeBuilderIndex",
                "themebuilder",
                new { controller = "ThemeBuilder", action = "ThemeBuilderIndex" }
            );

            routes.MapRoute(
                "MobileThemeBuilder",
                "mobilethemebuilder/index.html",
                new { controller = "MobileThemeBuilder", action = "Index" }
            );

            routes.MapRoute(
                "MobileThemeBuilderIndex",
                "mobilethemebuilder",
                new { controller = "MobileThemeBuilder", action = "MobileThemeBuilderIndex" }
            );

            routes.MapRoute(
                "Default",
                "{controller}/{action}",
                new { controller = "Home", action = "Index" }
            );

            routes.MapRoute(
                "SourceView",
                "Source/SourceView",
                new { controller = "Source", action = "SourceView" }
            );
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
            ViewEngines.Engines.Add(new SpaViewEngine());
        }
    }
}
