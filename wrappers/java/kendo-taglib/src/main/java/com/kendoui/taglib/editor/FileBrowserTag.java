
package com.kendoui.taglib.editor;


import com.kendoui.taglib.BaseTag;



import com.kendoui.taglib.EditorTag;




import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class FileBrowserTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        EditorTag parent = (EditorTag)findParentWithClass(EditorTag.class);


        parent.setFileBrowser(this);

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
        return "editor-fileBrowser";
    }

    public void setMessages(com.kendoui.taglib.editor.FileBrowserMessagesTag value) {
        setProperty("messages", value);
    }

    public void setSchema(com.kendoui.taglib.editor.FileBrowserSchemaTag value) {
        setProperty("schema", value);
    }

    public void setTransport(com.kendoui.taglib.editor.FileBrowserTransportTag value) {
        setProperty("transport", value);
    }

    public java.lang.String getFileTypes() {
        return (java.lang.String)getProperty("fileTypes");
    }

    public void setFileTypes(java.lang.String value) {
        setProperty("fileTypes", value);
    }

    public java.lang.String getPath() {
        return (java.lang.String)getProperty("path");
    }

    public void setPath(java.lang.String value) {
        setProperty("path", value);
    }

//<< Attributes

}
