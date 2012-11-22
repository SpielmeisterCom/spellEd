Ext.define('Spelled.controller.Library', {
    extend: 'Ext.app.Controller',
	requires: [
		'Spelled.view.library.Navigator',
		'Spelled.view.library.FolderPicker',
		'Spelled.view.library.TreeList',
		'Spelled.view.library.field.Name',
		'Spelled.view.library.folder.Create',
		'Spelled.view.library.menu.Buttons',
		'Spelled.view.library.menu.Context',

		'Spelled.store.Library',
		'Spelled.store.FoldersTree'
	],

	TYPE_ASSET        : 1,
	TYPE_TEMPLATE     : 2,
	TYPE_SCRIPT       : 3,
	TYPE_SCENE_SCRIPT : 4,

    views: [
        'library.Navigator',
		'library.FolderPicker',
		'library.TreeList',
		'library.folder.Create',
		'library.menu.Buttons',
		'library.menu.Context'
    ],

    stores: [
		'Library',
		'FoldersTree'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        },
		{
			ref : 'LibraryTabPanel',
			selector: '#SceneEditor'
		},
		{
			ref : 'Navigator',
			selector: '#Navigator'
		},
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref: 'LibraryTree',
			selector: '#LibraryTree'
		},
		{
			ref: 'Library',
			selector: '#Library'
		}
    ],

    init: function() {
        this.control({
			'componentproperties' :{
				propertydeeplinkclick: this.deepLinkComponentProperty
			},
			'librarynavigator': {
				activate: this.showLibrary
			},
			'sceneeditor tab,#SecondTabPanel tab': {
				beforeclose: this.dispatchLibraryTabBeforeClose
			},
			'librarymenu button[action="showCreateFolder"]' : {
				click: this.showCreateFolder
			},
			'createlibraryfolder button[action="createFolder"]': {
				click: this.createFolderHelper
			},
			'librarytreelist': {
				editclick       : this.dispatchLibraryNodeContextMenu,
				itemcontextmenu : this.dispatchLibraryNodeContextMenu,
				select          : this.dispatchLibraryNodeSelect,
				itemdblclick    : this.dispatchLibraryNodeDoubleClick,
				itemmouseenter  : this.application.showActionsOnLeaf,
				itemmouseleave  : this.application.hideActions
			},
			'librarycontextmenu [action="deleteFolder"]': {
				click: this.removeFolder
			}
        })

		this.application.on({
			selectnamespacefrombutton  : this.selectLibraryNamespace,
			buildnamespacenodes        : this.buildNamespaceNodes,
			removefromlibrary: this.removeFromLibrary,
			clearstores: this.clearStore,
			scope: this
		})
    },

	deepLinkComponentProperty: function( name, propertyMapping, property ) {
		var tree    = this.getLibraryTree(),
			store   = tree.getStore(),
			value   = property.get( 'value'),
			record  = undefined

		switch( propertyMapping.get( 'target' ) ) {
			case 'asset':
				record = this.getStore( 'asset.Assets' ).findRecord( 'internalAssetId', value )
				break
			case 'script':
				var scriptId = value.split( ':').pop()
				record = this.getStore( 'script.Scripts' ).findRecord( 'scriptId', scriptId )
				break
		}

		var node = store.getById( record.getId() )

		if( node ) {
			this.getNavigator().setActiveTab( this.getLibrary() )

			if( node ) {
				tree.selectPath( node.getPath() )
				tree.getSelectionModel().deselectAll()
				tree.getSelectionModel().select( node )
				this.dispatchLibraryNodeDoubleClick( tree, node )
			}
		}
	},

	removeFolder: function() {
		var node      = this.application.getLastSelectedNode( this.getLibraryTree() ),
			project   = this.application.getActiveProject(),
			namespace = node.getId().split('.')

		namespace.shift()

		Spelled.StorageActions.deleteFolder(
			{ projectName: project.get( 'name' ), namespace: namespace.join('.') },
			{ callback: function( arg1, response, success ){ if( success ) node.remove() } }
		)
	},

	selectLibraryNamespace: function( view, button ) {
		var contextMenu = button.up( 'librarycontextmenu' )

		if( !contextMenu || !contextMenu.ownerView ) return

		view.down( 'libraryfolderpicker' ).setValue( contextMenu.ownerView.namespace )
	},

	createFolder: function( path ) {
		var project = this.application.getActiveProject()

		Spelled.StorageActions.createNamespaceFolder(
			{ projectName: project.get( 'name' ), path: path },
			{
				callback: function(){ this.buildNamespaceNodes() },
				scope: this
			}
		)
	},

	hasLibraryItems: function( node ) {
		return node.findChildBy( function( node ) { return ( node.get( 'cls') != "folder" ) }, this, true )
	},

	showLibraryFolderContextMenu: function( node, e ) {
		var namespace = node.getId(),
			parts     = namespace.split( '.' )

		if( parts[1] === 'spell' ) return

		var view = this.application.getController( 'Menu' ).createAndShowView( this.getLibraryMenuContextView(), e, { namespace: namespace } )

		if( !this.hasLibraryItems( node ) ) view.down( '[action="deleteFolder"]' ).setVisible(true)
	},

	createFolderHelper: function( button ) {
		var form   = button.up( 'form' ),
			window = form.up( 'window' ),
			values = form.getForm().getValues(),
			parts  = values.namespace.split( '.' )

		parts.shift()
		parts.push( values.path )

		this.createFolder( parts.join( '.' ) )

		window.close()
	},

	showCreateFolder: function( button ) {
		var view = Ext.widget( 'createlibraryfolder' )

		this.application.fireEvent( 'selectnamespacefrombutton', view, button )
	},

	clearStore: function() {
		this.getLibraryStore().getRootNode().removeAll()
	},

	removeFromLibrary: function( node, callback ) {
		Ext.Msg.confirm(
			'Confirm remove',
			'Do you really want to delete "' + node.get( 'text' )+ '" from your library?' ,
			function( button ) {
				if ( button === 'yes' ) callback( node )
			},
			this
		)
	},

	getNodeType: function( node ) {
		var type = node.get( 'cls' )

		if( Ext.getStore( 'asset.Types' ).findRecord( 'type', type ) ) {
			return this.TYPE_ASSET

		} else if( Ext.getStore( 'template.Types' ).findRecord( 'type', type ) || type === this.application.getController( 'Templates' ).TYPE_ENTITY_COMPOSITE ) {
			return this.TYPE_TEMPLATE

		} else if( type === 'script' ) {
			return this.TYPE_SCRIPT
		}

		return type
	},

	getTabType: function( tab ) {
		var type = tab.getXType()

		if( type === 'assetiframe' || type === 'editasset' ) {
			return this.TYPE_ASSET

		} else if( type === 'systemtemplateedit' || type === 'componenttemplateedit' || type === 'entitytemplateedit' ) {
			return this.TYPE_TEMPLATE

		} else if( type === 'scripteditor' ) {
			return this.TYPE_SCRIPT
		} else if( type === 'scenescriptedit' ) {
			return this.TYPE_SCENE_SCRIPT
		}
		return type
	},

	dispatchLibraryTabBeforeClose: function( tab ) {
		var panel = this.application.findTabByTitle( tab.ownerCt.tabPanel, tab.text )
		if( !panel ) return true

		switch( this.getTabType( panel ) ) {
			case this.TYPE_ASSET:
				this.application.fireEvent( 'assetbeforeclose', panel )
				break
			case this.TYPE_TEMPLATE:
				this.application.fireEvent( 'templatebeforeclose', panel )
				break
			case this.TYPE_SCRIPT:
				this.application.fireEvent( 'scriptbeforeclose', panel )
				break
			case this.TYPE_SCENE_SCRIPT:
				this.application.fireEvent( 'scenescriptbeforeclose', panel )
				break
		}

		return false
	},

	dispatchLibraryNodeContextMenu: function( view, record, item, index, e, options ) {
		e.stopEvent()
		var node = ( Ext.isObject( record ) ) ? record : view.getStore().getAt( record )

		switch( this.getNodeType( node ) ) {
			case this.TYPE_ASSET:
				this.application.fireEvent( 'assetcontextmenu', view, record, item, index, e, options )
				break
			case this.TYPE_TEMPLATE:
				this.application.fireEvent( 'templatecontextmenu', view, record, item, index, e, options )
				break
			case this.TYPE_SCRIPT:
				this.application.fireEvent( 'scriptcontextmenu', view, record, item, index, e, options )
				break
			default:
				this.showLibraryFolderContextMenu( node, e )
		}
	},

	dispatchLibraryNodeSelect: function( tree, node ) {

		switch( this.getNodeType( node ) ) {
			case this.TYPE_ASSET:
				this.application.fireEvent( 'assetselect', tree, node )
				break
			case this.TYPE_TEMPLATE:
				this.application.fireEvent( 'templateselect', tree, node )
				break
			case this.TYPE_SCRIPT:
				this.application.fireEvent( 'scriptselect', tree, node )
				break
			default:
				this.getRightPanel().removeAll()
		}
	},

	dispatchLibraryNodeDoubleClick: function( tree, node ) {

		switch( this.getNodeType( node ) ) {
			case this.TYPE_ASSET:
				this.application.fireEvent( 'assetdblclick', tree, node )
				break
			case this.TYPE_TEMPLATE:
				this.application.fireEvent( 'templatedblclick', tree, node )
				break
			case this.TYPE_SCRIPT:
				this.application.fireEvent( 'scriptdblclick', tree, node )
				break
		}
	},

	buildNamespaceNodes: function() {
		var project      = this.application.getActiveProject(),
			store        = this.getLibraryStore(),
			rootNode     = store.getRootNode(),
			foldersStore = this.getFoldersTreeStore(),
			foldersRoot  = foldersStore.getRootNode()

		Spelled.StorageActions.getNamespaces(
			{ projectName: project.get('name') } ,
			function( results ) {
				Ext.Array.each(
					results,
					function( item ) {
						store.createParentNode( rootNode,  item.split( '.' ) )
						foldersStore.createParentNode( foldersRoot,  item.split( '.' ) )
					},
					store
				)
			}
		)
	},

	showLibrary : function() {
		var tree = this.getLibraryTree(),
			node = this.application.getLastSelectedNode( tree )

		this.getRightPanel().show()
		this.getRightPanel().removeAll()

		if( node && tree.getRootNode().findChild( 'id', node.getId(), true ) ) this.dispatchLibraryNodeSelect( tree, node )

		this.getLibraryTabPanel().show()
	}

});
