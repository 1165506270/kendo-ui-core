
package com.kendoui.taglib.dropdownlist;

import com.kendoui.taglib.FunctionTag;

import com.kendoui.taglib.DropDownListTag;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class FilteringFunctionTag extends FunctionTag /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        DropDownListTag parent = (DropDownListTag)findParentWithClass(DropDownListTag.class);


        parent.setFiltering(this);

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
//<< Attributes

}
