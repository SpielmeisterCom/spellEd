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
						width: '100%'
					},
					items: [
						{
							name: 'static',
//							title: "Static library items",
							xtype: 'grid',
							columns: [
								{
									text: 'Static library items', dataIndex: 'id', flex: 1, hideable: false
								}
							]
						},
						{
							name: 'dynamic',
//							title: "Dynamic library items",
							xtype: 'grid',
							columns: [
								{
									text: 'Dynamic library items', dataIndex: 'id', flex: 1, hideable: false
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
									xtype: 'button', text: 'Add a dynamic library item', icon: 'images/icons/add.png',
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

	handleAddClick: function() {
		this.fireEvent( 'showAddToLibrary', this )
	},

	handleRemoveClick: function( gridView, rowIndex, colIndex, column, e, record ) {
		this.fireEvent( 'removeSceneLibraryItem', this, record.getId() )
	},

	createStore: function( data ) {
		return Ext.create( 'Ext.data.ArrayStore', {
			fields: [ 'id' ],
			sorters: [ 'id' ],
			data: Ext.Array.map( data, function( item ){ return [ item ] } )
		})
	},

	reconfigureStores: function( scene ) {
		var staticStore  = this.createStore( scene.getStaticLibraryIds() ),
			dynamicStore = this.createStore( scene.getDynamicLibraryIds() )

		this.down( 'grid[name="static"]' ).reconfigure( staticStore )
		this.down( 'grid[name="dynamic"]' ).reconfigure( dynamicStore )
	}
})
