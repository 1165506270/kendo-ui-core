namespace Kendo.Mvc.UI
{
    using Kendo.Mvc.Infrastructure;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class DatePickerBase : WidgetBase, IPicker
    {
        public DatePickerBase(ViewContext viewContext, IJavaScriptInitializer initializer, ViewDataDictionary viewData)
            : base(viewContext, initializer, viewData)
        {
            ParseFormats = new List<string>();
            
            Animation = new PopupAnimation();
            
            Value = null;
            Enabled = true;
        }

        public PopupAnimation Animation
        {
            get;
            private set;
        }
                
        public string Format
        {
            get;
            set;
        }

        public List<string> ParseFormats
        {
            get;
            set;
        }

        public DateTime? Value
        {
            get;
            set;
        }

        public DateTime Min
        {
            get;
            set;
        }

        public DateTime Max
        {
            get;
            set;
        }

        public bool Enabled
        {
            get;
            set;
        }
    }
}