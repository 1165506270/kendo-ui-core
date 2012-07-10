namespace Kendo.Mvc.UI.Tests.Chart
{
    using System;
    using Kendo.Mvc.UI;
    using Kendo.Mvc.UI.Fluent;
    using Xunit;
    using System.Collections.Generic;

    public class ChartClientEventsBuilderTests
    {
        private readonly ChartEventBuilder builder;
        private readonly IDictionary<string, object> clientEvents;
        private readonly Action emptyAction;
        private readonly Func<object, object> nullFunc;
        private readonly string handlerName;

        public ChartClientEventsBuilderTests()
        {
            clientEvents = new Dictionary<string, object>();
            builder = new ChartEventBuilder(clientEvents);

            emptyAction = () => { };
            nullFunc = (o) => null;
            handlerName = "myHandler";
        }

        [Fact]
        public void DataBound_with_Func_should_set_InlineCodeBlock()
        {
            builder.DataBound(nullFunc);
            clientEvents["dataBound"].ShouldNotBeNull();
        }

        [Fact]
        public void DataBound_with_Func_should_return_builder()
        {
            builder.DataBound(nullFunc).ShouldBeType<ChartEventBuilder>();
        }

        [Fact]
        public void DataBound_with_string_should_set_HandlerName()
        {
            builder.DataBound(handlerName);
            ((ClientHandlerDescriptor) clientEvents["dataBound"]).HandlerName.ShouldEqual(handlerName);
        }

        [Fact]
        public void DataBound_with_string_should_return_builder()
        {
            builder.DataBound(handlerName).ShouldBeType<ChartEventBuilder>();
        }

        [Fact]
        public void SeriesClick_with_Func_should_set_InlineCodeBlock()
        {
            builder.SeriesClick(nullFunc);
            clientEvents["seriesClick"].ShouldNotBeNull();
        }

        [Fact]
        public void SeriesClick_with_Func_should_return_builder()
        {
            builder.SeriesClick(nullFunc).ShouldBeType<ChartEventBuilder>();
        }

        [Fact]
        public void SeriesClick_with_string_should_set_HandlerName()
        {
            builder.SeriesClick(handlerName);
            ((ClientHandlerDescriptor) clientEvents["seriesClick"]).HandlerName.ShouldEqual(handlerName);
        }

        [Fact]
        public void SeriesClick_with_string_should_return_builder()
        {
            builder.SeriesClick(handlerName).ShouldBeType<ChartEventBuilder>();
        }

        [Fact]
        public void SeriesHover_with_Func_should_set_InlineCodeBlock()
        {
            builder.SeriesHover(nullFunc);
            clientEvents["seriesHover"].ShouldNotBeNull();
        }

        [Fact]
        public void SeriesHover_with_Func_should_return_builder()
        {
            builder.SeriesHover(nullFunc).ShouldBeType<ChartEventBuilder>();
        }

        [Fact]
        public void SeriesHover_with_string_should_set_HandlerName()
        {
            builder.SeriesHover(handlerName);
            ((ClientHandlerDescriptor) clientEvents["seriesHover"]).HandlerName.ShouldEqual(handlerName);
        }

        [Fact]
        public void SeriesHover_with_string_should_return_builder()
        {
            builder.SeriesHover(handlerName).ShouldBeType<ChartEventBuilder>();
        }

        [Fact]
        public void AxisLabelClick_with_Func_should_set_InlineCodeBlock()
        {
            builder.AxisLabelClick(nullFunc);
            clientEvents["axisLabelClick"].ShouldNotBeNull();
        }

        [Fact]
        public void AxisLabelClick_with_Func_should_return_builder()
        {
            builder.AxisLabelClick(nullFunc).ShouldBeType<ChartEventBuilder>();
        }

        [Fact]
        public void AxisLabelClick_with_string_should_set_HandlerName()
        {
            builder.AxisLabelClick(handlerName);
            ((ClientHandlerDescriptor)clientEvents["axisLabelClick"]).HandlerName.ShouldEqual(handlerName);
        }

        [Fact]
        public void AxisLabelClick_with_string_should_return_builder()
        {
            builder.AxisLabelClick(handlerName).ShouldBeType<ChartEventBuilder>();
        }

        [Fact]
        public void PlotAreaClick_with_Func_should_set_InlineCodeBlock()
        {
            builder.PlotAreaClick(nullFunc);
            clientEvents["plotAreaClick"].ShouldNotBeNull();
        }

        [Fact]
        public void PlotAreaClick_with_Func_should_return_builder()
        {
            builder.PlotAreaClick(nullFunc).ShouldBeType<ChartEventBuilder>();
        }

        [Fact]
        public void PlotAreaClick_with_string_should_set_HandlerName()
        {
            builder.PlotAreaClick(handlerName);
            ((ClientHandlerDescriptor)clientEvents["plotAreaClick"]).HandlerName.ShouldEqual(handlerName);
        }

        [Fact]
        public void PlotAreaClick_with_string_should_return_builder()
        {
            builder.PlotAreaClick(handlerName).ShouldBeType<ChartEventBuilder>();
        }
    }
}
