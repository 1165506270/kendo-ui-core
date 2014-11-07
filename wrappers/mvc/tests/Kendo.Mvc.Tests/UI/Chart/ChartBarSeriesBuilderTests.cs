namespace Kendo.Mvc.UI.Tests.Chart
{
    using Kendo.Mvc.UI;
    using Kendo.Mvc.UI.Fluent;
    using System;
    using Xunit;

    public class ChartBarSeriesBuilderTests
    {
        protected IChartBarSeries series;
        protected ChartBarSeriesBuilder<SalesData> builder;
        private readonly Func<object, object> nullFunc;

        public ChartBarSeriesBuilderTests()
        {
            var chart = ChartTestHelper.CreateChart<SalesData>();
            series = new ChartBarSeries<SalesData, decimal>(s => s.RepSales, null);
            builder = new ChartBarSeriesBuilder<SalesData>(series);
            nullFunc = (o) => null;
        }

        [Fact]
        public void Name_should_set_name()
        {
            builder.Name("Series");
            series.Name.ShouldEqual("Series");
        }

        [Fact]
        public void Opacity_should_set_opacity()
        {
            builder.Opacity(0.5);
            series.Opacity.ShouldEqual(0.5);
        }

        [Fact]
        public void Opacity_should_return_builder()
        {
            builder.Opacity(0.5).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Color_sets_background()
        {
            builder.Color("Blue");
            series.Color.ShouldEqual("Blue");
        }

        [Fact]
        public void Color_returns_builder()
        {
            builder.Color("Blue");
            series.Color.ShouldEqual("Blue");
        }

        [Fact]
        public void Color_handler_sets_background_handler()
        {
            builder.ColorHandler("Foo");
            series.ColorHandler.HandlerName.ShouldEqual("Foo");
        }

        [Fact]
        public void Color_handler_returns_builder()
        {
            builder.ColorHandler("Foo").ShouldEqual(builder);
        }

        [Fact]
        public void Color_handler_sets_background_delegate()
        {
            builder.ColorHandler(nullFunc);
            series.ColorHandler.TemplateDelegate.ShouldEqual(nullFunc);
        }

        [Fact]
        public void Color_handler_delegate_returns_builder()
        {
            builder.ColorHandler(nullFunc).ShouldEqual(builder);
        }

        [Fact]
        public void NegativeColor_should_set_negative_color()
        {
            builder.NegativeColor("Blue");
            series.NegativeColor.ShouldEqual("Blue");
        }

        [Fact]
        public void NegativeColor_should_return_builder()
        {
            builder.NegativeColor("Blue").ShouldBeSameAs(builder);
        }

        [Fact]
        public void Tooltip_should_set_visibility()
        {
            builder.Tooltip(true);
            series.Tooltip.Visible.Value.ShouldBeTrue();
        }

        [Fact]
        public void Tooltip_should_return_builder()
        {
            builder.Tooltip(true).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Tooltip_with_builder_should_configure_tooltip()
        {
            builder.Tooltip(tooltip => { tooltip.Visible(true); });
            series.Tooltip.Visible.Value.ShouldBeTrue();
        }

        [Fact]
        public void Tooltip_with_builder_should_return_builder()
        {
            builder.Tooltip(legend => { }).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Axis_should_set_axisName()
        {
            builder.Axis("Secondary");
            series.Axis.ShouldEqual("Secondary");
        }

        [Fact]
        public void Axis_should_return_builder()
        {
            builder.Axis("Secondary").ShouldBeSameAs(builder);
        }

        [Fact]
        public void CategoryAxis_should_set_axisName()
        {
            builder.CategoryAxis("Secondary");
            series.CategoryAxis.ShouldEqual("Secondary");
        }

        [Fact]
        public void CategoryAxis_should_return_builder()
        {
            builder.CategoryAxis("Secondary").ShouldBeSameAs(builder);
        }

        [Fact]
        public void Stack_should_set_Stacked()
        {
            builder.Stack(true);
            series.Stacked.Value.ShouldBeTrue();
        }

        [Fact]
        public void Stack_should_return_builder()
        {
            builder.Stack(true).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Stack_should_set_StackGroup()
        {
            builder.Stack("Female");
            series.StackGroup.ShouldEqual("Female");
        }

        [Fact]
        public void Stack_name_should_return_builder()
        {
            builder.Stack("Female").ShouldBeSameAs(builder);
        }

        [Fact]
        public void Stack_should_set_StackType()
        {
            builder.Stack(ChartStackType.Stack100);
            series.StackType.ShouldEqual(ChartStackType.Stack100);
        }

        [Fact]
        public void Stack_should_set_StackType_and_StackGroup()
        {
            builder.Stack(ChartStackType.Stack100, "Foo");
            series.StackGroup.ShouldEqual("Foo");
        }

        [Fact]
        public void Stack_type_should_return_builder()
        {
            builder.Stack(ChartStackType.Stack100).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Aggregate_should_set_Aggregate()
        {
            builder.Aggregate(ChartSeriesAggregate.Max);
            series.Aggregate.ShouldEqual(ChartSeriesAggregate.Max);
        }

        [Fact]
        public void Aggregate_should_return_builder()
        {
            builder.Aggregate(ChartSeriesAggregate.Max).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Aggregate_should_set_Aggregate_handler_name()
        {
            builder.Aggregate("foo");
            series.AggregateHandler.HandlerName.ShouldEqual("foo");
        }

        [Fact]
        public void Aggregate_handler_name_should_return_builder()
        {
            builder.Aggregate("foo").ShouldBeSameAs(builder);
        }

        [Fact]
        public void Aggregate_should_set_Aggregate_template()
        {
            builder.Aggregate(nullFunc);
            series.AggregateHandler.TemplateDelegate.ShouldEqual(nullFunc);
        }

        [Fact]
        public void Aggregate_template_should_return_builder()
        {
            builder.Aggregate(nullFunc).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Gap_should_set_gap()
        {
            builder.Gap(1);
            series.Gap.ShouldEqual(1);
        }

        [Fact]
        public void Spacing_should_set_spacing()
        {
            builder.Spacing(1);
            series.Spacing.ShouldEqual(1);
        }

        [Fact]
        public void Labels_should_set_labels_visibility()
        {
            builder.Labels(true);
            series.Labels.Visible.ShouldEqual(true);
        }

        [Fact]
        public void Labels_should_return_builder()
        {
            builder.Labels(labels => { }).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Border_sets_width_and_color()
        {
            builder.Border(1, "red", ChartDashType.Dot);
            series.Border.Color.ShouldEqual("red");
            series.Border.Width.ShouldEqual(1);
            series.Border.DashType.ShouldEqual(ChartDashType.Dot);
        }

        [Fact]
        public void Border_builder_should_configure_border()
        {
            builder.Border(b => b.Opacity(0.5));
            series.Border.Opacity.ShouldEqual(0.5);
        }

        [Fact]
        public void Border_builder_should_return_builder()
        {
            builder.Border(b => b.Opacity(0.5)).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Overlay_should_set_overlay()
        {
            builder.Overlay(ChartBarSeriesOverlay.None);
            series.Overlay.ShouldEqual(ChartBarSeriesOverlay.None);
        }

        [Fact]
        public void Overlay_should_return_builder()
        {
            builder.Overlay(ChartBarSeriesOverlay.None).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Highlight_should_configure_Highlight()
        {
            builder.Highlight(highlight => highlight.Visible(false));
            series.Highlight.Visible.ShouldEqual(false);
        }

        [Fact]
        public void Highlight_should_return_builder()
        {
            builder.Highlight(highlight => highlight.Visible(false)).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Highlight_should_set_visible()
        {
            builder.Highlight(false);
            series.Highlight.Visible.ShouldEqual(false);
        }

        [Fact]
        public void Highlight_with_bool_should_return_builder()
        {
            builder.Highlight(false).ShouldBeSameAs(builder);
        }

        [Fact]
        public void ErrorBars_should_configure_errorBars()
        {
            builder.ErrorBars(e => e.Value(1.1).Color("Red"));
            series.ErrorBars.Value.ShouldEqual(1.1);
            series.ErrorBars.Color.ShouldEqual("Red");
        }

        [Fact]
        public void ErrorBars_should_return_builder()
        {
            builder.ErrorBars(e => e.Value(1)).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Field_should_set_member()
        {
            builder.Field("Value");
            series.Member.ShouldEqual("Value");
        }

        [Fact]
        public void Field_should_return_builder()
        {
            builder.Field("Value").ShouldBeSameAs(builder);
        }

        [Fact]
        public void CategoryField_should_set_category_member()
        {
            builder.CategoryField("Category");
            series.CategoryMember.ShouldEqual("Category");
        }

        [Fact]
        public void CategoryField_should_return_builder()
        {
            builder.CategoryField("Category").ShouldBeSameAs(builder);
        }

        [Fact]
        public void ColorField_should_set_color_member()
        {
            builder.ColorField("Color");
            series.ColorMember.ShouldEqual("Color");
        }

        [Fact]
        public void ColorField_should_return_builder()
        {
            builder.ColorField("Color").ShouldBeSameAs(builder);
        }

        [Fact]
        public void NoteTextField_should_set_note_text_member()
        {
            builder.NoteTextField("NoteText");
            series.NoteTextMember.ShouldEqual("NoteText");
        }

        [Fact]
        public void NoteTextField_should_return_builder()
        {
            builder.NoteTextField("NoteText").ShouldBeSameAs(builder);
        }

        [Fact]
        public void ZIndex_should_set_zIndex()
        {
            builder.ZIndex(5);
            series.ZIndex.ShouldEqual(5);
        }

        [Fact]
        public void ZIndex_should_return_builder()
        {
            builder.ZIndex(5).ShouldBeSameAs(builder);
        }
    }
}
