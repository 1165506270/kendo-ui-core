
package com.kendoui.taglib.tabstrip;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.html.Div;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ItemTag extends  BaseTag  /* interfaces */implements Items/* interfaces */ {
    
    protected List<Map<String,Object>> items;
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        ItemsTag parent = (ItemsTag)findParentWithClass(ItemsTag.class);

        parent.addItem(this);

//<< doEndTag
        
        try {
            this.setProperty("content", getContent());
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return super.doEndTag();
    }
    
    public String getContent() throws IOException {
        String html = body();
        
        if (!html.isEmpty()) {               
            Div div = new Div();
            
            div.html(html);
            
            return div.outerHtml();
        }
        
        return "";
    }

    @Override
    public void initialize() {
//>> initialize
//<< initialize
        items = new ArrayList<Map<String,Object>>();
        super.initialize();
    }

    @Override
    public void destroy() {
//>> destroy
//<< destroy
        items = null;
        super.destroy();
    }
    
    public void setItems(ItemsTag value) {
        items = value.items();
    }

//>> Attributes
    public void setItems(ItemsTag value) {

        items = value.items();

    }

    public static String tagName() {
        return "tabStrip-item";
    }

    public String getContentUrl() {
        return (String)getProperty("contentUrl");
    }

    public void setContentUrl(String value) {
        setProperty("contentUrl", value);
    }

    public boolean getEnabled() {
        return (boolean)getProperty("enabled");
    }

    public void setEnabled(boolean value) {
        setProperty("enabled", value);
    }

    public String getImageUrl() {
        return (String)getProperty("imageUrl");
    }

    public void setImageUrl(String value) {
        setProperty("imageUrl", value);
    }

    public boolean getSelected() {
        return (boolean)getProperty("selected");
    }

    public void setSelected(boolean value) {
        setProperty("selected", value);
    }

    public String getSpriteCssClass() {
        return (String)getProperty("spriteCssClass");
    }

    public void setSpriteCssClass(String value) {
        setProperty("spriteCssClass", value);
    }

    public String getText() {
        return (String)getProperty("text");
    }

    public void setText(String value) {
        setProperty("text", value);
    }

//<< Attributes
  

}
