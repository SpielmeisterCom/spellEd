Ext.define('Spelled.view.component.Properties', {
    extend: 'Spelled.abstract.grid.property.Grid',

    alias : 'widget.componentproperties',

    title: 'Component Configuration',

	margin: '0 0 5 0',
	collapsible: true,
	titleCollapse: true,

	hideHeaders: true,
	deferRowRender: false,

	initComponent: function() {
		var me = this

		me.tools = [
			{
				type: 'gear',
				handler: Ext.bind( me.onGearClick, me )
			},
			{
				xtype: 'tool-documentation'
			}
		]

		this.callParent(arguments)
	},

	onGearClick: function( event ) {
		this.fireEvent( 'propertycontextmenu', this, event )
	}
});