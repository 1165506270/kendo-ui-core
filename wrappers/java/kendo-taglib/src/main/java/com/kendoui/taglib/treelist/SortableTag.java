
package com.kendoui.taglib.treelist;


import com.kendoui.taglib.BaseTag;



import com.kendoui.taglib.TreeListTag;




import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class SortableTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        TreeListTag parent = (TreeListTag)findParentWithClass(TreeListTag.class);


        parent.setSortable(this);

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
        return "treeList-sortable";
    }

    public boolean getAllowUnsort() {
        return (boolean)getProperty("allowUnsort");
    }

    public void setAllowUnsort(boolean value) {
        setProperty("allowUnsort", value);
    }

    public java.lang.String getMode() {
        return (java.lang.String)getProperty("mode");
    }

    public void setMode(java.lang.String value) {
        setProperty("mode", value);
    }

//<< Attributes

}
