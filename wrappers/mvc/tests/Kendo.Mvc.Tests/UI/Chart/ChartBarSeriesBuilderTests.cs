namespace Kendo.Mvc.UI.Tests.Chart
{
    using Kendo.Mvc.UI;
    using Kendo.Mvc.UI.Fluent;
    using Xunit;

    public class ChartBarSeriesBuilderTests
        : ChartSeriesBuilderBaseTests<IChartBarSeries, ChartBarSeriesBuilder<SalesData>>
    {
        public ChartBarSeriesBuilderTests()
        {
            var chart = ChartTestHelper.CreateChart<SalesData>();
            series = new ChartBarSeries<SalesData, decimal>(chart, s => s.RepSales, null);
            builder = new ChartBarSeriesBuilder<SalesData>(series);
        }

        [Fact]
        public void Stack_should_set_Stacked()
        {
            builder.Stack(true);
            series.Stacked.ShouldBeTrue();
        }

        [Fact]
        public void Stack_should_return_builder()
        {
            builder.Stack(true).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Stack_should_set_StackName()
        {
            builder.Stack("Female");
            series.StackName.ShouldEqual("Female");
        }

        [Fact]
        public void Stack_name_should_return_builder()
        {
            builder.Stack("Female").ShouldBeSameAs(builder);
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
    }
}