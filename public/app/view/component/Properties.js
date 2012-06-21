Ext.define('Spelled.view.component.Properties', {
    extend: 'Ext.grid.property.Grid',

    alias : 'widget.componentproperties',

    title: 'Component Configuration',

	margin: '0 0 5 0',
	collapsible: true,
	titleCollapse: true,

	hideHeaders: true,

	tools: [
		{
			type:'help',
			tooltip: 'Get Help',
			handler: function( event, toolEl, panel ){
				Ext.Msg.alert( 'Status', 'Not Implemented');
			}
		}
	],

    customEditors: {
        //TODO: when a assigned asset gets removed, the field will disappear
        assetId: 'assetidproperty'
    }
});