namespace Kendo.Mvc.UI.Tests.Chart
{
    using Kendo.Mvc.UI;
    using Kendo.Mvc.UI.Fluent;
    using Xunit;

    public class ChartAreaSeriesBuilderTests
    {
        protected IChartAreaSeries series;
        protected ChartAreaSeriesBuilder<SalesData> builder;

        public ChartAreaSeriesBuilderTests()
        {
            var chart = ChartTestHelper.CreateChart<SalesData>();
            series = new ChartAreaSeries<SalesData, decimal>(s => s.RepSales);
            builder = new ChartAreaSeriesBuilder<SalesData>(series);
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
        public void Color_should_set_color()
        {
            builder.Color("Blue");
            series.Color.ShouldEqual("Blue");
        }

        [Fact]
        public void Color_should_return_builder()
        {
            builder.Color("Blue").ShouldBeSameAs(builder);
        }

        [Fact]
        public void Color_field_should_set_color_member()
        {
            builder.ColorField("Color");
            series.ColorMember.ShouldEqual("Color");
        }

        [Fact]
        public void Color_field_should_return_builder()
        {
            builder.ColorField("Color").ShouldBeSameAs(builder);
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
        public void Stack_should_set_Stacked()
        {
            builder.Stack(true);
            series.Stacked.Value.ShouldBeTrue();
        }

        [Fact]
        public void Stack_should_set_StackType()
        {
            builder.Stack(ChartStackType.Stack100);
            series.StackType.ShouldEqual(ChartStackType.Stack100);
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
        public void Line_should_set_line_color()
        {
            builder.Line(l => l.Color("lineColor"));
            series.Line.Color.ShouldEqual("lineColor");
        }

        [Fact]
        public void Line_should_set_line_opacity()
        {
            builder.Line(l => l.Opacity(0.33));
            series.Line.Opacity.ShouldEqual(0.33);
        }

        [Fact]
        public void Line_should_set_dash_width()
        {
            builder.Line(l => l.Width(9));
            series.Line.Width.ShouldEqual(9);
        }

        [Fact]
        public void Line_should_set_dash_type()
        {
            builder.Line(l => l.DashType(ChartDashType.Dash));
            series.Line.DashType.ShouldEqual(ChartDashType.Dash);
        }

        [Fact]
        public void Line_should_set_line_configuration()
        {
            builder.Line(2, "lineColor", ChartDashType.Dash, ChartAreaStyle.Step);
            series.Line.Color.ShouldEqual("lineColor");
            series.Line.Width.ShouldEqual(2);
            series.Line.DashType.ShouldEqual(ChartDashType.Dash);
            series.Line.Style.ShouldEqual(ChartAreaStyle.Step);
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
        public void Markers_should_set_markers_visibility()
        {
            builder.Markers(true);
            series.Markers.Visible.ShouldEqual(true);
        }

        [Fact]
        public void Markers_should_return_builder()
        {
            builder.Markers(labels => { }).ShouldBeSameAs(builder);
        }

        [Fact]
        public void MissingValues_should_set_missingValues()
        {
            builder.MissingValues(ChartAreaMissingValues.Interpolate);
            series.MissingValues.ShouldEqual(ChartAreaMissingValues.Interpolate);
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
    }
}
