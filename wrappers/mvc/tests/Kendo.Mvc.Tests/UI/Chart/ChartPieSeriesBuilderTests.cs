namespace Kendo.Mvc.UI.Tests.Chart
{
    using Kendo.Mvc.UI;
    using Kendo.Mvc.UI.Fluent;
    using Xunit;

    public class ChartPieSeriesBuilderTests
    {
        private readonly ChartPieSeries<SalesData, decimal> series;
        private readonly ChartPieSeriesBuilder<SalesData> builder;

        public ChartPieSeriesBuilderTests()
        {
            var chart = ChartTestHelper.CreateChart<SalesData>();
            series = new ChartPieSeries<SalesData, decimal>(s => s.RepSales, s => s.RepName, null, null, null);
            builder = new ChartPieSeriesBuilder<SalesData>(series);
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
        public void Padding_should_set_Padding()
        {
            builder.Padding(80);
            series.Padding.ShouldEqual(80);
        }

        [Fact]
        public void StartAngle_should_set_StartAngle()
        {
            builder.StartAngle(1);
            series.StartAngle.ShouldEqual(1);
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
            builder.Overlay(ChartPieSeriesOverlay.None);
            series.Overlay.ShouldEqual(ChartPieSeriesOverlay.None);
        }

        [Fact]
        public void Overlay_should_return_builder()
        {
            builder.Overlay(ChartPieSeriesOverlay.None).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Connectors_should_set_connectors_color()
        {
            builder.Connectors(c => c.Color("red"));
            series.Connectors.Color.ShouldEqual("red");
        }

        [Fact]
        public void Connectors_should_return_builder()
        {
            builder.Connectors(c => { }).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Highlight_with_builder_should_configure_highlight()
        {
            builder.Highlight(highlight => { highlight.Border(1); });
            series.Highlight.Border.Width.ShouldEqual(1);
        }

        [Fact]
        public void Highlight_with_builder_should_return_builder()
        {
            builder.Highlight(highlight => { }).ShouldBeSameAs(builder);
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
        public void ExplodeField_should_set_explode_member()
        {
            builder.ExplodeField("Explode");
            series.ExplodeMember.ShouldEqual("Explode");
        }

        [Fact]
        public void ExplodeField_should_return_builder()
        {
            builder.ExplodeField("Explode").ShouldBeSameAs(builder);
        }

        [Fact]
        public void VisibleInLegendField_should_set_visibleInLegend_member()
        {
            builder.VisibleInLegendField("VisibleInLegend");
            series.VisibleInLegendMember.ShouldEqual("VisibleInLegend");
        }

        [Fact]
        public void VisibleInLegendField_should_return_builder()
        {
            builder.VisibleInLegendField("VisibleInLegend").ShouldBeSameAs(builder);
        }
    }
}