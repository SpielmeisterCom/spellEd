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
					xtype: 'treepanel',
					animate: false,
					animCollapse: false,
					height: 300,

					hideHeaders: true,
					rootVisible: false,
					listeners: {
						itemmouseenter : Ext.bind( me.actionColumnHandler, me, [ true ], 0 ),
						itemmouseleave : Ext.bind( me.actionColumnHandler, me, [ false ], 0 ),
						itemcontextmenu : Ext.bind( me.contextMenuHandler, me ),
						itemdblclick : Ext.bind( me.doubleClickHandler, me )
					},
					fields: [ 'libraryId', 'isStatic' ],
					columns: [
						{
							xtype: 'treecolumn',
							text: 'Dynamic library items', dataIndex: 'libraryId', flex: 1,
							renderer: function( value, style, record ) {
								var css = ( record.get( 'isStatic' ) ) ? 'locked-icon' : ""
								return "<img src='" + Ext.BLANK_IMAGE_URL + "' class='" + css +"'/>" + value
							}
						},
						{
							xtype: 'actioncolumn',
							width: 30,
							icon: 'resources/images/icons/wrench-arrow.png',
							iconCls: 'x-hidden edit-action-icon',
							handler: Ext.bind( me.handleEditClick, me )
						}
					],
					tbar: [
						{
							text: 'Add',
							icon: 'resources/images/icons/add.png',
							menu: [
								{
									text: 'Single dependency', icon: 'resources/images/icons/add.png',
									handler: Ext.bind( me.handleAddClick, me, [ false ] )
								},
								{
									text: 'Multiple dependencies', icon: 'resources/images/icons/add.png',
									handler: Ext.bind( me.handleAddClick, me, [ true ] )
								}
							]
						}
					]
				}
			]
		})

		me.callParent( arguments )

		this.reconfigureStores()
	},

	doubleClickHandler: function( view, record ) {
		var found = Ext.getStore( 'Library' ).findLibraryItemByLibraryId( record.get( 'libraryId' ) )
		if( found ) this.fireEvent( 'deepLink', found )
	},

	contextMenuHandler: function( view, record, item, index, e, eOpts ) {
		e.stopEvent()
		this.handleEditClick( view, null, null, null, e, record )
	},

	handleEditClick: function( view, rowIndex, colIndex, item, e, record ) {
		var isStatic = record.get( 'isStatic' )

		if( record.get( 'libraryId' ) == 'Anonymous' ) return

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
		if( record.get( 'libraryId' ) == 'Anonymous' ) return

		if( show )
			this.fireEvent( 'showActionColumns', grid, record, item )
		else
			this.fireEvent( 'hideActionColumns', grid, record, item )
	},

	reconfigureStores: function() {
		if( !this.record ) return

		var me = this

		Ext.Msg.show({
			title: 'Please wait',
			msg: 'Calculating dependencies...',
			width: 300,
			modal: true,
			closable: false
		})

		setTimeout(
			function() {
				me.fireEvent( 'loaddependencies', me, me.record )
			},
			50
		)
	}
})
