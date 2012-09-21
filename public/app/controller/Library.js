Ext.define('Spelled.controller.Library', {
    extend: 'Ext.app.Controller',

	TYPE_ASSET    : 1,
	TYPE_TEMPLATE : 2,
	TYPE_SCRIPT   : 3,

    views: [
        'library.Navigator',
        'library.TabPanel',
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
			selector: '#LibraryTabPanel'
		},
		{
			ref : 'Navigator',
			selector: '#LibraryTree'
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
			'librarytabpanel': {
				tabchange: this.dispatchLibraryTabChange
			},
			'librarytabpanel tab': {
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
		}

	},

	dispatchLibraryTabBeforeClose: function( tab ) {
		var panel = this.application.findTabByTitle( this.getLibraryTabPanel(), tab.text )
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

	showLibrary : function( ) {
		this.application.hideMainPanels()
		this.getRightPanel().show()
//		this.getRightPanel().add( this.getDefaultDocumentation() )

//		this.loadTrees()

//		if( this.getTemplatesTree().getSelectionModel().getSelection().length > 0 ){
//			this.showConfig( this.getTemplatesTree(), this.getTemplatesTree().getSelectionModel().getSelection()[0] )
//		}

		this.getLibraryTabPanel().show()
	}

});