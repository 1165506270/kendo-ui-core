namespace Kendo.Mvc.UI.Tests.Chart
{
    using System;
    using Kendo.Mvc.UI;
    using Kendo.Mvc.UI.Fluent;
    using Xunit;

    public class ChartMarkersBuilderTests
    {
        private readonly ChartMarkers markers;
        private readonly ChartMarkersBuilder builder;
        private readonly Func<object, object> nullFunc;

        public ChartMarkersBuilderTests()
        {
            markers = new ChartMarkers();
            builder = new ChartMarkersBuilder(markers);
            nullFunc = (o) => null;
        }

        [Fact]
        public void Visible_sets_Visible()
        {
            builder.Visible(false);
            markers.Visible.Value.ShouldBeFalse();
        }

        [Fact]
        public void Type_sets_type()
        {
            builder.Type(ChartMarkerShape.Square);
            markers.Type.ShouldEqual(ChartMarkerShape.Square);
        }

        [Fact]
        public void Size_sets_size()
        {
            builder.Size(10);
            markers.Size.ShouldEqual(10);
        }

        [Fact]
        public void Background_sets_background()
        {
            builder.Background("Blue");
            markers.Background.ShouldEqual("Blue");
        }

        [Fact]
        public void Background_returns_builder()
        {
            builder.Background("Blue");
            markers.Background.ShouldEqual("Blue");
        }

        [Fact]
        public void Background_handler_sets_background_handler()
        {
            builder.BackgroundHandler("Foo");
            markers.BackgroundHandler.HandlerName.ShouldEqual("Foo");
        }

        [Fact]
        public void Background_handler_returns_builder()
        {
            builder.BackgroundHandler("Foo").ShouldEqual(builder);
        }

        [Fact]
        public void Background_handler_sets_background_delegate()
        {
            builder.BackgroundHandler(nullFunc);
            markers.BackgroundHandler.TemplateDelegate.ShouldEqual(nullFunc);
        }

        [Fact]
        public void Background_handler_delegate_returns_builder()
        {
            builder.BackgroundHandler(nullFunc).ShouldEqual(builder);
        }

        [Fact]
        public void Border_sets_width_and_color()
        {
            builder.Border(1, "red", ChartDashType.Dot);
            markers.Border.Color.ShouldEqual("red");
            markers.Border.Width.ShouldEqual(1);
            markers.Border.DashType.ShouldEqual(ChartDashType.Dot);
        }

        [Fact]
        public void Border_builder_should_configure_border()
        {
            builder.Border(b => b.Opacity(0.5));
            markers.Border.Opacity.ShouldEqual(0.5);
        }

        [Fact]
        public void Border_builder_should_return_builder()
        {
            builder.Border(b => b.Opacity(0.5)).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Rotation_sets_rotation()
        {
            builder.Rotation(45);
            markers.Rotation.ShouldEqual(45);
        }

        [Fact]
        public void Rotation_should_return_builder()
        {
            builder.Rotation(45).ShouldBeSameAs(builder);
        }
    }
}