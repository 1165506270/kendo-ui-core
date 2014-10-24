
package com.kendoui.taglib.treelist;


import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.TreeListTag;


import java.util.ArrayList;
import java.util.Map;
import java.util.List;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ColumnsTag extends BaseTag /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag
        TreeListTag parent = (TreeListTag)findParentWithClass(TreeListTag.class);


        parent.setColumns(this);
//<< doEndTag

        return super.doEndTag();
    }

    @Override
    public void initialize() {
//>> initialize

        columns = new ArrayList<Map<String, Object>>();

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

    private List<Map<String, Object>> columns;

    public List<Map<String, Object>> columns() {
        return columns;
    }

    public static String tagName() {
        return "treeList-columns";
    }

    public void addColumn(ColumnTag value) {
        columns.add(value.properties());
    }

//<< Attributes

}
