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

		var store = Ext.getStore( 'project.Plugins' )

		var forms = []
		store.each(
			function( record ) {
				forms.push( me.createPluginForm( record ) )
			}
		)

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
						select: Ext.bind( me.togglePluginVisibility, me ),
						deselect: Ext.bind( me.togglePluginVisibility, me )
					}
				}, {
					region: 'center',
					layout: 'fit',
					flex: 3,
					xtype: 'container',
					name: 'plugincontainer',
					items: forms
				}
			]
		})

		this.callParent( arguments )
	},

	createPluginForm: function( record ){
		var fields    = Ext.clone( record.get( 'fields' ) ),
			getValues = record.get( 'getValues'),
			setValues = record.get( 'setValues' )

		fields.unshift( {
			xtype: 'checkbox',
			name: 'active',
			boxLabel: 'Active',
			inputValue: true,
			uncheckedValue: false
		} )

		var form = Ext.widget( 'form', {
			name: 'pluginform',
			layout: 'form',
			fieldDefaults: {
				labelWidth: 150
			},
			hidden: true,
			pluginId: record.get( 'name' ),
			items: fields
		} )

		if( Ext.isFunction( getValues ) ) {
			form.getValues = Ext.bind( getValues, form )
		}

		if( Ext.isFunction( setValues ) ) {
			form.getForm().setValues = Ext.bind( setValues, form )
		}

		this.fireEvent( 'fillpluginform', this, record, form )

		return form
	},

	togglePluginVisibility: function( rowModel, record ) {
		var form = this.down( 'form[pluginId="'+ record.get( 'name' ) +'"]' )

		form.setVisible( !form.isVisible() )
	},

	getPluginsConfig: function() {
		var container = this.down( 'container[name="plugincontainer"]' ),
			forms     = container.query( 'form' ),
			config    = {}

		Ext.Array.each(
			forms,
			function( form ) {
				config[ form.pluginId ] = form.getValues()
			}
		)

		return config
	}
})