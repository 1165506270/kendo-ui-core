namespace Kendo.Mvc.UI
{
    using Kendo.Mvc.UI.Html;
    using Kendo.Mvc.Infrastructure;

    using System;
    using System.IO;
    using System.Linq;
    using System.Web.Mvc;
    using System.Globalization;
    using System.Collections.Generic;

    public class TimePicker : DatePickerBase
    {
        public TimePicker(ViewContext viewContext, IJavaScriptInitializer initializer, ViewDataDictionary viewData)
            : base(viewContext, initializer, viewData)
        {
            Format = CultureInfo.CurrentCulture.DateTimeFormat.ShortTimePattern;

            Min = DateTime.Today;
            Max = DateTime.Today;

            Interval = 30;

            Dates = new List<DateTime>();
        }

        public List<DateTime> Dates 
        { 
            get; 
            set; 
        }

        public int Interval
        {
            get;
            set;
        }

        public override void WriteInitializationScript(TextWriter writer)
        {
            var options = new Dictionary<string, object>(ClientEvents);

            var animation = Animation.ToJson();

            if (animation.Keys.Any())
            {
                options["animation"] = animation["animation"];
            }
            
            options["format"] = Format;

            if (ParseFormats.Any())
            {
                options["parseFormats"] = ParseFormats;
            }

            options["min"] = Min;
            options["max"] = Max;
            options["interval"] = Interval;

            if (Dates.Any())
            {
                options["dates"] = Dates;
            }

            writer.Write(Initializer.Initialize(Id, "TimePicker", options));

            base.WriteInitializationScript(writer);
        }

        protected override void WriteHtml(System.Web.UI.HtmlTextWriter writer)
        {
            DatePickerHtmlBuilderBase renderer = new DatePickerHtmlBuilderBase(this, "time");

            renderer.Build().WriteTo(writer);

            base.WriteHtml(writer);
        }
    }
}
