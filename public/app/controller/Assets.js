Ext.define('Spelled.controller.Assets', {
    extend: 'Ext.app.Controller',

    views: [
        'asset.Navigator',
        'asset.Editor',
        'asset.TreeList',
        'asset.Iframe',
        'asset.Upload',
        'asset.FolderPicker',
		'asset.create.Texture',
		'asset.create.SpriteSheet',
		'asset.create.Animation',
		'asset.inspector.Config'
    ],

    stores: [
        'asset.Tree',
        'asset.Types',
        'asset.FoldersTree',
        'asset.Textures',
        'asset.Sounds',
		'asset.SpriteSheets',
		'asset.Animations',
		'asset.Assets'
    ],

    models: [
        'Asset'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        },
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		}
    ],

    init: function() {
        this.control({
			'createasset > form > combobox[name="type"]': {
				select: this.showAdditionalConfiguration
			},
            'assetsnavigator': {
                activate: this.showAssets
            },
            'assetstreelist': {
				select:          this.showConfigHelper,
                itemdblclick:    this.openAsset,
                itemcontextmenu: this.showListContextMenu,
				editclick:	     this.showListContextMenu,
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

	showConfigHelper: function( tree, node ) {
		var inspectorPanel = this.getRightPanel(),
			Asset          = this.getModel('Asset')

		inspectorPanel.removeAll()

		if( !node.isLeaf() ) return

		Asset.load(
			node.getId(),
			{
				scope: this,
				success: function( asset ) {
					this.showConfig( asset )
				}
			}
		)
	},

	showConfig: function( asset ) {
		var inspectorPanel = this.getRightPanel(),
			View           = this.getAssetInspectorConfigView()

		var view = new View()
		view.loadRecord( asset )

		inspectorPanel.setTitle( 'Asset information of "' + asset.get('name') +'"' )
		inspectorPanel.add( view )
	},

	showAdditionalConfiguration: function( combo, records ) {
		var form        = combo.up('form'),
			assetsCombo = form.down('combobox[name="assetId"]'),
			fileUpload  = form.down('filefield[name="asset"]'),
			spriteSheetConfig    = form.down('spritesheetconfig'),
			animationassetconfig = form.down('animationassetconfig')

		//Resetting defaults
		assetsCombo.hide()
		spriteSheetConfig.hide()
		animationassetconfig.hide()
		fileUpload.hide()
		fileUpload.reset()
		assetsCombo.clearValue()


		switch( combo.getValue() ) {
			case "animation":
				assetsCombo.show()
				animationassetconfig.show()
				break
			case "spriteSheet":
				spriteSheetConfig.show()
			default:
				fileUpload.show()
		}

	},

    showListContextMenu: function( view, record, item, index, e, options ) {
        this.application.getController('Menu').showAssetsListContextMenu( e )
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
        var Asset = this.getModel('Asset'),
			assetEditor = Ext.getCmp('AssetEditor')

		this.application.closeOpenedTabs( assetEditor, assetId )

        Asset.load(
            assetId,
            {
                scope: this,
                success: function( asset ) {
                    asset.destroy()
                    this.refreshStores()
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
        if( !record.isLeaf() ) return

        var assetEditor = Ext.getCmp('AssetEditor'),
            title     = record.getId()

        var Asset = this.getAssetModel()

        var foundTab = this.application.findActiveTabByTitle( assetEditor, title )

        if( foundTab )
            return foundTab

        Asset.load( record.getId() , {
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
		this.getAssetAssetsStore().load()
    },

    showAssets : function( ) {
		this.application.hideMainPanels()
		this.getRightPanel().show()

        this.loadTrees()

        Ext.getCmp('AssetEditor').show()
    }
});