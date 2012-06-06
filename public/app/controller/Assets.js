Ext.define('Spelled.controller.Assets', {
    extend: 'Ext.app.Controller',

    views: [
        'asset.Navigator',
        'asset.Editor',
        'asset.TreeList',
        'asset.Iframe',
        'asset.Upload',
        'asset.FolderPicker'
    ],

    stores: [
        'asset.Tree',
        'asset.Types',
        'asset.FoldersTree',
        'asset.Textures',
        'asset.Sounds'
    ],

    models: [
        'Asset'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    init: function() {
        this.control({
            'assetsnavigator': {
                activate: this.showAssets
            },
            'assetstreelist': {
                itemdblclick: this.openAsset,
                itemcontextmenu: this.showListContextMenu,
                deleteclick:     this.deleteAssetActionIconClick,
                itemmouseenter:  this.application.showActionsOnLeaf,
                itemmouseleave:  this.application.hideActions
            },
            'AssetEditor': {
                dragover: this.dropAsset
            },
            'asseteditor [action="showCreateAsset"]' : {
                click: this.showCreateAsset
            },
            'createasset button[action="createAsset"]' : {
                click: this.createAsset
            }
        })
    },

    deleteAssetActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        this.removeAsset( node.get( 'id' ) )
    },

    showListContextMenu: function( view, record, item, index, e, options ) {
        var menuController = this.application.getController('Menu')
        menuController.showAssetsListContextMenu( e )
    },

    createAsset: function( button ) {
        var form    = button.up('form').getForm(),
            window  = button.up( 'window' ),
            project = this.application.getActiveProject()

        if( form.isValid() ){

            form.submit(
                {
                    params: {
                        projectName: project.get('name')
                    },
                    waitMsg: 'Uploading your asset...',
                    success:
                        Ext.bind(
                            function( fp, o ) {
                                Ext.Msg.alert('Success', 'Your asset "' + o.result.data.name + '" has been uploaded.')

                                this.refreshStoresAndTreeStores()

                                window.close()
                            },
                            this
                        ),
                    failure: function( form, action ) {
                        Ext.Msg.alert('Failed', action.result)
                    }
                }
            )
        }
    },

    dropAsset: function() {
        console.log( arguments )
        console.log( "Dropped item in asset editor" )

        e.stopPropagation()
        e.preventDefault()
    },

    removeAsset: function( assetId ) {
        var Asset = this.getModel('Asset')

        Asset.load(
            assetId,
            {
                scope: this,
                success: function( asset ) {
                    asset.destroy()
                    this.refreshStoresAndTreeStores()
					this.loadTrees()
				}
            }
        )
    },

    showCreateAsset: function() {
        var View = this.getAssetUploadView()
        var view = new View( )
        view.show()
    },

    openAsset: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var assetEditor = Ext.getCmp('AssetEditor'),
            title     = record.internalId

        var Asset = this.getAssetModel()

        var foundTab = this.application.findActiveTabByTitle( assetEditor, title )

        if( foundTab )
            return foundTab

        Asset.load( record.internalId , {
            scope: this,
            success: function( asset ) {

                var View = this.getAssetIframeView()
                var view = new View( {
                    title: title,
                    autoEl: {
                        tag : 'iframe',
                        src: asset.getFilePath( this.application.getActiveProject().get('name') )
                    }
                } )

                this.application.createTab( assetEditor, view )
            }
        })
    },

	refreshStoresAndTreeStores: function() {
		this.loadTrees()
		this.refreshStores()
	},

    loadTrees: function() {
        this.getAssetTreeStore().load()
        this.getAssetFoldersTreeStore().load()
    },

    refreshStores: function() {
        this.getAssetTexturesStore().load()
        this.getAssetSoundsStore().load()
    },

    showAssets : function( ) {
		this.application.hideMainPanels()

        this.loadTrees()

        Ext.getCmp('AssetEditor').show()
    }
});