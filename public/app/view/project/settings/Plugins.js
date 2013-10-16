Ext.define('Spelled.view.project.settings.Plugins' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.projectplugins',

	requires: [
		'Spelled.store.project.Plugins'
	],

    title : 'Plugins',
	layout: 'border',

	initComponent: function() {
		var me = this

		Ext.applyIf( this, {
			items: [
				{
					region: 'west',
					flex: 1,
					xtype: 'grid',
					name: 'plugins',
					sortableColumns: false,
					columns: [
						{ width: '100%',text: 'Name',  dataIndex: 'name', menuDisabled: true }
					],
					store: 'project.Plugins',
					listeners: {
						select: Ext.bind( me.selectPlugin, me )
					}
				}, {
					region: 'center',
					layout: 'fit',
					flex:3,
					xtype: 'container',
					name: 'plugincontainer'
				}
			]
		})

		this.callParent( arguments )
	},

	selectPlugin: function( rowModel, record ) {
		var container = this.down( 'container[name="plugincontainer"]' )

		container.removeAll()

		var fields = Ext.clone( record.get( 'fields' ) )

		fields.unshift( {
			xtype: 'checkbox',
			name: 'active',
			boxLabel  : 'Active',
		} )

		var form = Ext.widget( 'form', {
			name: 'pluginform',
			items: fields
		} )

		container.add( form )

		this.fireEvent( 'pluginselected', this, record )
	}
})