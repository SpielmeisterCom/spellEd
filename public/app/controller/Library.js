Ext.define('Spelled.controller.Library', {
    extend: 'Ext.app.Controller',

	TYPE_ASSET    : 1,
	TYPE_TEMPLATE : 2,
	TYPE_SCRIPT   : 3,

    views: [
        'library.Navigator',
		'library.FolderPicker',
		'library.TreeList'
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
		}
    ],

    init: function() {
        this.control({
			'librarynavigator': {
				activate: this.showLibrary
			},
			'sceneeditor,#SecondTabPanel': {
				tabchange: this.dispatchLibraryTabChange
			},
			'sceneeditor tab,#SecondTabPanel tab': {
				beforeclose: this.dispatchLibraryTabBeforeClose
			},
			'librarytreelist': {
				editclick       : this.dispatchLibraryNodeContextMenu,
				itemcontextmenu : this.dispatchLibraryNodeContextMenu,
				itemdblclick    : this.dispatchLibraryNodeDoubleClick,
				itemmouseenter  : this.application.showActionsOnLeaf,
				itemmouseleave  : this.application.hideActions
			}
        })

		this.application.on({
			buildnamespacenodes: this.buildNamespaceNodes,
			removeFromLibrary: this.removeFromLibrary,
			clearstores: this.clearStore,
			scope : this
		})
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

		if( type === 'assetiframe' ) {
			return this.TYPE_ASSET

		} else if( type === 'systemtemplateedit' || type === 'componenttemplateedit' || type === 'entitytemplateedit' ) {
			return this.TYPE_TEMPLATE

		} else if( type === 'scripteditor' ) {
			return this.TYPE_SCRIPT
		}

		return type
	},

	dispatchLibraryTabChange: function( tabPanel, newCard ) {
		this.getRightPanel().removeAll()
		switch( this.getTabType( newCard ) ) {
			case this.TYPE_ASSET:
				this.application.fireEvent( 'assettabchange', tabPanel, newCard )
				break
			case this.TYPE_TEMPLATE:
				this.application.fireEvent( 'templatetabchange', tabPanel, newCard )
				break
			case this.TYPE_SCRIPT:
				this.application.fireEvent( 'scripttabchange', tabPanel, newCard )
				break
			default:
				this.application.fireEvent( 'scenetabchange' )
		}

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
		}

	},

	dispatchLibraryNodeDoubleClick: function( tree, node ) {

		switch( this.getNodeType( node ) ) {
			case this.TYPE_ASSET:
				this.application.fireEvent( 'assetdblclick', tree, node )
				this.application.fireEvent( 'assetselect', tree, node )
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
		this.getRightPanel().show()

		this.getLibraryTabPanel().show()
	}

});
