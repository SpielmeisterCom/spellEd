Ext.define('Spelled.view.scene.Properties', {
    extend: 'Ext.container.Container',
    alias : 'widget.sceneproperties',

	layout: {
		type: 'vbox',
		align: 'center'
	},

	defaults: {
		flex: 1,
		padding: 5,
		width: '100%'
	},

	initComponent: function() {
		var me = this

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'panel',

					title: 'Scene dependencies',

					layout: {
						type: 'vbox',
						align: 'center'
					},

					defaults: {
						flex: 1,
						width: '100%',
						hideHeaders: true
					},
					items: [
						{
							name: 'static',
							title: "Static library items",
							xtype: 'grid',
							columns: [
								this.createTypeColumn(),
								{
									text: 'Static library items', dataIndex: 'id', flex: 1
								}
							]
						},
						{
							name: 'dynamic',
							title: "Dynamic library items",
							xtype: 'grid',
							columns: [
								this.createTypeColumn(),
								{
									text: 'Dynamic library items', dataIndex: 'id', flex: 1
								},
								{
									xtype: 'actioncolumn',
									width: 30,
									icon: 'images/icons/delete.png',
									handler: Ext.bind( me.handleRemoveClick, me )
								}
							],
							tbar: [
								{
									xtype: 'button', text: 'Add dependency', icon: 'images/icons/add.png',
									handler: Ext.bind( me.handleAddClick, me )
								}
							]
						}
					]
				}
			]
		})

		me.callParent( arguments )
	},

	createTypeColumn: function() {
		return {
			dataIndex: 'type',
			width: 25,
			renderer: function( value ) {
				return "<img src='" + Ext.BLANK_IMAGE_URL + "' class='img-icon-padding " + value + "'/>"
			}
		}
	},

	handleAddClick: function() {
		this.fireEvent( 'showAddToLibrary', this )
	},

	handleRemoveClick: function( gridView, rowIndex, colIndex, column, e, record ) {
		this.fireEvent( 'removeSceneLibraryItem', this, record.getId() )
	},

	createStore: function( data ) {
		return Ext.create( 'Ext.data.Store', {
			fields: [ 'id', 'type', 'sortOrder' ],
			sorters: [ 'sortOrder' ],
			data: data
		})
	},

	reconfigureStores: function( scene ) {
		var staticStore  = this.createStore( Spelled.Converter.libraryIdsToModels( scene.getStaticLibraryIds() ) ),
			dynamicStore = this.createStore( Spelled.Converter.libraryIdsToModels( scene.getDynamicLibraryIds() ) )

		this.down( 'grid[name="static"]' ).reconfigure( staticStore )
		this.down( 'grid[name="dynamic"]' ).reconfigure( dynamicStore )
	}
})
