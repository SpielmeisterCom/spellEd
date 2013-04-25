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
//						{
//							dataIndex: 'type',
//							width: 25,
//							renderer: function( value, style, record ) {
//								style.tdCls += value + " library-img-icon"
//
//								var css = ( record.get( 'static' ) ) ? 'linked-icon' : ""
//
//								return "<img src='" + Ext.BLANK_IMAGE_URL + "' class='" + css +"'/>"
//							}
//						},
						{
							xtype: 'treecolumn',
							text: 'Dynamic library items', dataIndex: 'libraryId', flex: 1
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

		var record              = this.record,
			staticDependencies  = record.getCalculatedDependencies(),
			dynamicDependencies = Ext.Array.difference( record.getDependencies(), staticDependencies ),
			rootNode            = record.createDependencyNode(),
			libraryStore        = Ext.getStore( 'Library' )

		Spelled.Converter.addAdditionalInfoToDependencyNode( rootNode, true )

		for ( var j = 0, l = dynamicDependencies.length; j < l; j++ ) {
			var libraryId = dynamicDependencies[ j ],
				item      = libraryStore.findLibraryItemByLibraryId( libraryId )

			if( !item ) {
				//Remove dependency which could not be resolved
				Ext.Array.remove( record.get( 'dependencies' ), libraryId )
				continue
			}

			var	node = item.createDependencyNode()

			rootNode.children.push( node )
			Spelled.Converter.addAdditionalInfoToDependencyNode( node )
		}

		rootNode.expanded = true
		this.down( 'treepanel' ).setRootNode( rootNode )
	}
})
