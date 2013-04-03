
package com.kendoui.taglib.sparkline;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class SeriesItemLabelsTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        SeriesItemTag parent = (SeriesItemTag)findParentWithClass(SeriesItemTag.class);


        parent.setLabels(this);

//<< doEndTag

        return super.doEndTag();
    }

    @Override
    public void initialize() {
//>> initialize
//<< initialize

        super.initialize();
    }

    @Override
    public void destroy() {
//>> destroy
//<< destroy

        super.destroy();
    }

//>> Attributes

    public static String tagName() {
        return "sparkline-seriesItem-labels";
    }

    public void setBorder(com.kendoui.taglib.sparkline.SeriesItemLabelsBorderTag value) {
        setProperty("border", value);
    }

    public void setBackground(SeriesItemLabelsBackgroundFunctionTag value) {
        setEvent("background", value.getBody());
    }

    public void setColor(SeriesItemLabelsColorFunctionTag value) {
        setEvent("color", value.getBody());
    }

    public void setFont(SeriesItemLabelsFontFunctionTag value) {
        setEvent("font", value.getBody());
    }

    public void setFormat(SeriesItemLabelsFormatFunctionTag value) {
        setEvent("format", value.getBody());
    }

    public void setPosition(SeriesItemLabelsPositionFunctionTag value) {
        setEvent("position", value.getBody());
    }

    public void setTemplate(SeriesItemLabelsTemplateFunctionTag value) {
        setEvent("template", value.getBody());
    }

    public void setVisible(SeriesItemLabelsVisibleFunctionTag value) {
        setEvent("visible", value.getBody());
    }

    public String getAlign() {
        return (String)getProperty("align");
    }

    public void setAlign(String value) {
        setProperty("align", value);
    }

    public String getBackground() {
        return (String)getProperty("background");
    }

    public void setBackground(String value) {
        setProperty("background", value);
    }

    public String getColor() {
        return (String)getProperty("color");
    }

    public void setColor(String value) {
        setProperty("color", value);
    }

    public float getDistance() {
        return (float)getProperty("distance");
    }

    public void setDistance(float value) {
        setProperty("distance", value);
    }

    public String getFont() {
        return (String)getProperty("font");
    }

    public void setFont(String value) {
        setProperty("font", value);
    }

    public String getFormat() {
        return (String)getProperty("format");
    }

    public void setFormat(String value) {
        setProperty("format", value);
    }

    public Object getMargin() {
        return (Object)getProperty("margin");
    }

    public void setMargin(Object value) {
        setProperty("margin", value);
    }

    public Object getPadding() {
        return (Object)getProperty("padding");
    }

    public void setPadding(Object value) {
        setProperty("padding", value);
    }

    public String getPosition() {
        return (String)getProperty("position");
    }

    public void setPosition(String value) {
        setProperty("position", value);
    }

    public String getTemplate() {
        return (String)getProperty("template");
    }

    public void setTemplate(String value) {
        setProperty("template", value);
    }

    public boolean getVisible() {
        return (boolean)getProperty("visible");
    }

    public void setVisible(boolean value) {
        setProperty("visible", value);
    }

//<< Attributes

}
