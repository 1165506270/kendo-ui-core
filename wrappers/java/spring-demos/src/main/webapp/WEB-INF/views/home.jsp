<%@taglib prefix="kendo" uri="http://www.kendoui.com/jsp/tags"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Home</title>
        <link href="http://cdn.kendostatic.com/2012.2.710/styles/kendo.common.min.css" rel="stylesheet" />
        <link href="http://cdn.kendostatic.com/2012.2.710/styles/kendo.default.min.css" rel="stylesheet" />
        <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
        <script src="http://cdn.kendostatic.com/2012.2.710/js/kendo.all.min.js"></script>
    </head>
    <body>
        <h1>Hello world!</h1>
        <p>The time on the server is ${serverTime}.</p>
        
        <kendo:window name="myWindow">
        	<strong>Window Content</strong>
        	
        	<kendo:autoComplete name="myAutoComplete" dataTextField="Name">
        	    <kendo:dataSource type="odata" serverFiltering="true">
        	    	<kendo:transport>
        	    		<kendo:read url="http://odata.netflix.com/Catalog/Titles"></kendo:read>
        	    	</kendo:transport>
        	    </kendo:dataSource>
            </kendo:autoComplete>
        	
        </kendo:window>
        
        <kendo:panelBar name="myPanelBar">        	
        	<kendo:panelBarItem text="Item with content">
        		<strong>Item Contents</strong>
        	</kendo:panelBarItem>
        	<kendo:panelBarItem text="Item with children">
        		<kendo:panelBarItem text="Child with content">
        			<strong>Child Contents</strong>
        		</kendo:panelBarItem>
        		<kendo:panelBarItem text="Child with children">
        			<kendo:panelBarItem text="Child 1" />
        			<kendo:panelBarItem text="Child 2" />
        		</kendo:panelBarItem>
        	</kendo:panelBarItem>
        </kendo:panelBar>
    </body>
</html>