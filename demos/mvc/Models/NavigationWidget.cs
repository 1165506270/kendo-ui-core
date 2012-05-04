﻿using System;
using System.Linq;

namespace Kendo.Models
{
    public class NavigationWidget
    {
        public string Name { get; set; }
        public string Text { get; set; }
        public string Documentation { get; set; }
        public string ThumbnailUrl { get; set; }
        public string SpriteCssClass { get; set; }
        public bool Tablet { get; set; }
        public bool Expanded { get; set; }
        public NavigationExample[] Items { get; set; }
    }
}
