﻿namespace Kendo.Mvc.UI.Fluent.Tests
{
    using Kendo.Mvc.UI;
    using Kendo.Mvc.UI.Tests;
    using Xunit;

    public class ReadOnlyAjaxDataSourceBuilderTests
    {
        private readonly DataSource dataSource;
        private readonly ReadOnlyAjaxDataSourceBuilder<Customer> builder;

        public ReadOnlyAjaxDataSourceBuilderTests()
        {
            dataSource = new DataSource();
            builder = new ReadOnlyAjaxDataSourceBuilder<Customer>(dataSource, TestHelper.CreateViewContext(), new UrlGenerator());
        }
#if !MVC3
        [Fact]
        public void Webapi_should_return_readonly_webapi_datasource_builder()
        {
            builder.WebApi().ShouldBeType(typeof(ReadOnlyWebApiDataSourceBuilder<Customer>));
        }
#endif
    }
}
