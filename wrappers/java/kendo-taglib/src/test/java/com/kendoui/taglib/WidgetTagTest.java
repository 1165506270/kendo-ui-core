package com.kendoui.taglib;

import javax.servlet.jsp.JspWriter;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

import java.io.IOException;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.PageContext;

import org.junit.Before;
import org.junit.Test;

import com.kendoui.taglib.html.Element;

public class WidgetTagTest {
    private WidgetTagTestDouble tag;
    private PageContext pageContext;

    @Before
    public void setUp() throws IOException {
        tag = spy(new WidgetTagTestDouble());

        tag.setName("foo");

        JspWriter out = mock(JspWriter.class);

        when(out.append((String)anyObject())).thenReturn(out);

        pageContext = mock(PageContext.class);

        when(pageContext.getOut()).thenReturn(out);

        tag.setPageContext(pageContext);
    }

    @Test
    public void htmlReturnsElement() {
        assertTrue(tag.html() instanceof Element);
    }

    @Test
    public void htmlSetsTheIdAttributeToTheValueOfTheNameProperty() throws IOException {
        assertEquals(tag.html().outerHtml(), "<div id=\"foo\"></div>");
    }

    @Test
    public void doEndTagCallsHtmlAndScript() throws JspException {
        tag.doEndTag();

        verify(tag).html();
        verify(tag).script();
    }

    @Test
    public void scriptReturnsPluginInitializationStatement() throws IOException {
        tag.setFoo("foo");
        assertEquals("jQuery(function(){jQuery(\"#foo\").kendoFoo({\"foo\":\"foo\"});})", tag.script().html());
    }
}
