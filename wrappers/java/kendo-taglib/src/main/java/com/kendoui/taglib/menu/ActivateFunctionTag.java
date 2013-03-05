
package com.kendoui.taglib.menu;

import com.kendoui.taglib.FunctionTag;

import com.kendoui.taglib.MenuTag;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ActivateFunctionTag extends FunctionTag /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        MenuTag parent = (MenuTag)findParentWithClass(MenuTag.class);


        parent.setActivate(this);

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
