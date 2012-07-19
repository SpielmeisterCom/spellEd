Ext.define('Spelled.controller.Assets', {
    extend: 'Ext.app.Controller',

    views: [
        'asset.Navigator',
        'asset.Editor',
        'asset.TreeList',
        'asset.Iframe',
        'asset.Form',
        'asset.FolderPicker',
		'asset.create.Create',
		'asset.create.Texture',
		'asset.create.SpriteSheet',
		'asset.create.Animation',
		'asset.edit.Edit',
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
			'createasset combobox[name="type"]': {
				select: this.showAdditionalConfiguration
			},
			'editasset button[action="editAsset"]' : {
				click: this.editAsset
			},
			'spritesheetconfig > tool-documentation, animationassetconfig > tool-documentation': {
				showDocumentation: this.showDocumentation
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
            'assetstreelist button[action="showCreateAsset"]' : {
                click: this.showCreateAsset
            },
            'createasset button[action="createAsset"]' : {
                click: this.createAsset
            }
        })
    },

	showDocumentation: function( docString ) {
		this.application.showDocumentation( docString )
	},

	showEditHelper: function( id ) {
		var Asset = this.getModel('Asset')

		Asset.load(
			id,
			{
				scope: this,
				success: function( asset ) {
					this.showEdit( asset )
				}
			}
		)
	},

	fieldRenderHelper: function( type, form, asset ) {
		var assetsCombo = form.down('combobox[name="assetId"]'),
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


		switch( type ) {
			case "animation":
				if( !!asset ) {
					form.getForm().setValues(
						{
							looped   : asset.get('config').looped,
							duration : asset.get('config').duration,
							frameIds : asset.get('config').frameIds
						}
					)
				}

				assetsCombo.show()
				animationassetconfig.show()
				break
			case "spriteSheet":
				if( !!asset ) {
					form.getForm().setValues(
						{
							textureWidth  : asset.get('config').textureWidth,
							textureHeight : asset.get('config').textureHeight,
							frameWidth    : asset.get('config').frameWidth,
							frameHeight   : asset.get('config').frameHeight
						}
					)
				}

				spriteSheetConfig.show()
			default:
				fileUpload.show()
		}
	},

	showEdit: function( asset ) {
		var view = Ext.widget( 'editasset' ),
			form = view.down( 'form' )

		this.fieldRenderHelper( asset.get('type'), form, asset )
		form.loadRecord( asset )

		//TODO: enable changing file
		form.down('filefield').hide()

		view.show()
	},

	editAsset: function( button ) {
		var form    = button.up('form').getForm(),
			window  = button.up( 'window' ),
			record  = form.getRecord(),
			values  = form.getValues()

		record.set( 'config', values)

		record.save()

		window.close()
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

	showAdditionalConfiguration: function( combo ) {
		var form        = combo.up('form')

		this.fieldRenderHelper( combo.getValue(), form )
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



                                this.refreshStoresAndTreeStores( true )

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
        var view = Ext.widget( 'createasset' )
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

	refreshStoresAndTreeStores: function( force ) {
		this.loadTrees( force )
		this.refreshStores()
	},

	loadTrees: function( force ) {
		if( !this.treeLoaded || force === true ) {
			this.getAssetTreeStore().load()
			this.treeLoaded = true
		}

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