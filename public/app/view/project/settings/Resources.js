Ext.define('Spelled.view.project.settings.Resources' ,{
	extend: 'Ext.panel.Panel',
	alias: 'widget.projectresources',

	title : 'Resources',
	layout: 'border',

	requires: [
		'Spelled.store.project.TizenResources',
		'Spelled.store.project.AndroidResources',
		'Spelled.store.project.IOSResources'
	],

	initComponent: function() {
		var me = this

		this.store = Ext.getStore( this.storeName )

		Ext.applyIf( this, {
			items: [
				{
					region: 'west',
					flex: 1,
					xtype: 'grid',
					name: 'resources',
					sortableColumns: false,
					columns: [
						{ width: '100%',text: 'Name',  dataIndex: 'name', menuDisabled: true }
					],
					store: this.store,
					listeners: {
						select: Ext.bind( me.toggleResourceVisibility, me ),
						deselect: Ext.bind( me.toggleResourceVisibility, me )
					}
				}, {
					region: 'center',
					layout: 'fit',
					flex: 3,
					xtype: 'container',
					name: 'resourcescontainer',
					items: [
					]
				}
			]
		})

		this.callParent( arguments )
	},


	toggleResourceVisibility: function( rowModel, record ) {
		var pluginContainer = this.down( 'container[name="resourcescontainer"]'),
			xtype           = record.get( 'xtype' ),
			config          = record.get( 'config' )

		var resourceWidget = Ext.widget( xtype, config )

		pluginContainer.removeAll( )
		pluginContainer.add( resourceWidget )
	},

	getValues: function() {
		return {}
	},

	setValues: function( values ) {

	}

})