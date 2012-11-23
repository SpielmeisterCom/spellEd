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

		this.attachDeepLink()

		this.callParent(arguments)
	},

	checkIfDeepLinkClick: function( grid, td, cellIndex, record, tr, rowIndex, e ) {
		var name = record.get( 'name'),
			link = this.propertyDeepLinked[ name ]

		if( cellIndex === 0 && link ){
			this.fireEvent( 'propertydeeplinkclick', name, link, record )
		}
	},

	attachDeepLink: function() {
		var propertyNames = this.propertyNames = {}

		this.addEvents( 'propertydeeplinkclick' )
		this.addListener( 'cellclick', this.checkIfDeepLinkClick, this )

		Ext.Object.each(
			this.propertyDeepLinked,
			function( key, value ) {
				propertyNames[ key ] = key + " <img src='/images/icons/deep_link.png' class='linkedProperty'/>"
			}
		)
	},

	onGearClick: function( event ) {
		this.fireEvent( 'propertycontextmenu', this, event )
	}
});