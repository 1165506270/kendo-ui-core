namespace Kendo.Mvc.UI.Tests
{
    using System.Linq;
    using System.Web;
    using Moq;
    using Xunit;

    public class GridColumnBaseTests
    {
        private readonly Grid<Customer> grid;
        private readonly Mock<GridColumnBase<Customer>> column;

        public GridColumnBaseTests()
        {
            grid = GridTestHelper.CreateGrid<Customer>();
            column = new Mock<GridColumnBase<Customer>>(grid)
            {
                CallBase = true
            };
        }

        [Fact]
        public void Should_set_header_title()
        {
            const string title = "title";

            column.Setup(c => c.Title).Returns(title);

            var cell = column.Object.CreateHeaderBuilder().CreateCell();
            var span = GetSpan(cell);
            span.InnerHtml.ShouldEqual(title);
        }

        [Fact]
        public void Should_not_encode_html_in_title()
        {
            const string title = "<strong>Title</strong>";
            
            column.SetupGet(c => c.Title).Returns(title);

            var cell = column.Object.CreateHeaderBuilder().CreateCell();
            var span = GetSpan(cell);
            span.InnerHtml.ShouldEqual(title);
        }

        [Fact]
        public void Should_set_nbsp_if_title_is_null()
        {
            string title = null;
            
            column.SetupGet(c => c.Title).Returns(title);

            var cell = column.Object.CreateHeaderBuilder().CreateCell();
            var span = GetSpan(cell);
            span.InnerHtml.ShouldEqual("&nbsp;");
        }

        [Fact]
        public void Should_set_nbsp_if_title_is_empty_string()
        {
            string title = string.Empty;
            
            column.SetupGet(c => c.Title).Returns(title);

            var cell = column.Object.CreateHeaderBuilder().CreateCell();
            var span = GetSpan(cell);
            span.InnerHtml.ShouldEqual("&nbsp;");
        }

        [Fact]
        public void ClientTemplate_should_decode_encoded_values()
        {
            column.Object.ClientTemplate = HttpUtility.UrlEncode("#=baz#");

            var json = column.Object.ToJson();

            json["template"].ShouldEqual("#=baz#");
        }

        [Fact]
        public void Should_serialize_encoded_false()
        {
            column.Object.Encoded = false;

            var json = column.Object.ToJson();

            json["encoded"].ShouldEqual(false);
        }

        [Fact]
        public void Should_serialize_locked_true()
        {
            column.Object.Locked = true;

            var json = column.Object.ToJson();

            json["locked"].ShouldEqual(true);
        }

        [Fact]
        public void Should_not_serialize_locked_false()
        {
            column.Object.Locked = false;

            var json = column.Object.ToJson();

            json.ContainsKey("locked").ShouldBeFalse();
        }

        [Fact]
        public void Should_not_serialize_lockable_true()
        {
            column.Object.Lockable = true;

            var json = column.Object.ToJson();

            json.ContainsKey("lockable").ShouldBeFalse();
        }

        [Fact]
        public void Should_serialize_lockable_false()
        {
            column.Object.Lockable = false;

            var json = column.Object.ToJson();

            json["lockable"].ShouldEqual(false);
        }

        private IHtmlNode GetSpan(IHtmlNode cell)
        {
            return cell.Children[0];
        }
    }
}