Ext.define('Spelled.view.library.Dependencies', {
    extend: 'Ext.container.Container',
    alias : 'widget.spelldependencies',

	layout: {
		type: 'vbox',
		align: 'center'
	},

	defaults: {
		flex: 1,
		width: '100%',
		hideHeaders: true
	},

	initComponent: function() {
		var me      = this

		Ext.applyIf( me, {
			items: [
				{
					name: 'dependencies',
					xtype: 'grid',
					listeners: {
						itemmouseenter : Ext.bind( me.actionColumnHandler, me, [ true ], 0 ),
						itemmouseleave : Ext.bind( me.actionColumnHandler, me, [ false ], 0 ),
						itemcontextmenu : Ext.bind( me.contextMenuHandler, me ),
						itemdblclick : Ext.bind( me.doubleClickHandler, me )
					},
					columns: [
						{
							dataIndex: 'type',
							width: 25,
							renderer: function( value, style, record ) {
								style.tdCls += value + " library-img-icon"

								var css = ( record.get( 'static' ) ) ? 'linked-icon' : ""

								return "<img src='" + Ext.BLANK_IMAGE_URL + "' class='" + css +"'/>"
							}
						},
						{
							text: 'Dynamic library items', dataIndex: 'libraryId', flex: 1
						},
						{
							xtype: 'actioncolumn',
							width: 30,
							icon: 'images/icons/wrench-arrow.png',
							iconCls: 'x-hidden edit-action-icon',
							handler: Ext.bind( me.handleEditClick, me )
						}
					],
					tbar: [
						{
							text: 'Add',
							icon: 'images/icons/add.png',
							menu: [
								{
									text: 'Single dependency', icon: 'images/icons/add.png',
									handler: Ext.bind( me.handleAddClick, me, [ false ] )
								},
								{
									text: 'Multiple dependencies', icon: 'images/icons/add.png',
									handler: Ext.bind( me.handleAddClick, me, [ true ] )
								}
							]
						},
						{
							xtype: 'libraryfilterbutton'
						}
					]
				}
			]
		})

		me.callParent( arguments )

		this.reconfigureStores()
	},

	doubleClickHandler: function( view, record ) {
		this.fireEvent( 'deepLink', record )
	},

	contextMenuHandler: function( view, record, item, index, e, eOpts ) {
		e.stopEvent()
		this.handleEditClick( view, null, null, null, e, record )
	},

	handleEditClick: function( view, rowIndex, colIndex, item, e, record ) {
		var isStatic = record.get( 'static' )

		if( isStatic ) {
			this.fireEvent( 'showStaticLibraryItemContextMenu', record, e )
		} else {
			this.fireEvent( 'showDynamicLibraryItemContextMenu', record, e)
		}
	},

	handleAddClick: function( multiple ) {
		this.fireEvent( 'showAddToLibrary', this, multiple )
	},

	actionColumnHandler: function( show, grid, record, item ) {
		if( show )
			this.fireEvent( 'showActionColumns', grid, record, item )
		else
			this.fireEvent( 'hideActionColumns', grid, record, item )
	},

	createStore: function( data ) {
		return Ext.create( 'Ext.data.Store', {
			fields: [ 'libraryId', 'id', 'type', 'sortOrder', 'static' ],
			sorters: [ 'sortOrder', 'libraryId' ],
			data: data
		})
	},

	reconfigureStores: function() {
		if( !this.record ) return

		var record              = this.record,
			staticDependencies  = record.getCalculatedDependencies(),
			dynamicDependencies = Ext.Array.difference( record.getDependencies(), staticDependencies ),
			store               = this.createStore( Spelled.Converter.libraryIdsToModels( staticDependencies )),
			filter              = this.down( 'libraryfilterbutton' )

		store.each(	function( item ) { item.set( 'static', true ) } )

		store.add( Spelled.Converter.libraryIdsToModels( dynamicDependencies ) )

		this.down( 'grid' ).reconfigure( store )

		filter.filterHandler()
	}
})
