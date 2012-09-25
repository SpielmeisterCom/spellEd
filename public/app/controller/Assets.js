Ext.define('Spelled.controller.Assets', {
    extend: 'Ext.app.Controller',

    views: [
		'asset.ColorField',
        'asset.Iframe',
        'asset.Form',
        'asset.FolderPicker',
		'asset.create.Create',
		'asset.create.Texture',
		'asset.create.SpriteSheet',
		'asset.create.Animation',
		'asset.create.Font',
		'asset.create.KeyToActionMap',
		'asset.edit.Edit',
		'asset.inspector.Config'
    ],

    stores: [
        'asset.Types',
        'asset.Textures',
        'asset.Sounds',
		'asset.Fonts',
		'asset.SpriteSheets',
		'asset.Animations',
		'asset.ActionKeys',
		'asset.KeyToActionMappings',
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
		},
		{
			ref : 'AssetEditor',
			selector: '#LibraryTabPanel'
		},
		{
			ref : 'Navigator',
			selector: '#LibraryTree'
		},
    ],

    init: function() {
        this.control({
			'createasset combobox[name="type"]': {
				select: this.showAdditionalConfiguration
			},
			'editasset button[action="editAsset"]' : {
				click: this.editAsset
			},
			'keytoactionconfig > tool-documentation, spritesheetconfig > tool-documentation, animationassetconfig > tool-documentation, textappearanceconfig > tool-documentation': {
				showDocumentation: this.showDocumentation
			},
            'AssetEditor': {
                dragover: this.dropAsset
            },
            'librarytreelist button[action="showCreateAsset"]' : {
                click: this.showCreateAsset
            },
            'createasset button[action="createAsset"]' : {
                click: this.createAsset
            },
		    'textappearanceconfig field' : {
				change: this.refreshFontPreview
			},
			'keytoactionconfig': {
				editclick:         this.showKeyMappingContextMenu
			},
			'keytoactionconfig gridpanel': {
				itemcontextmenu:   this.showKeyMappingContextMenu
			},
			'keytoactionconfig button[action="addKeyMapping"]': {
				click: this.addKeyMapping
			}
        })

		this.application.on({
			'removekeymapping': this.removeKeyMapping,
			'assettabchange'  : this.assetTabChange,
			'assetselect'     : this.showConfigHelper,
			'assetdblclick'   : this.openAsset,
			'assetcontextmenu': this.showListContextMenu,
			scope: this
		})
    },

	assetTabChange: function( tabPanel, newCard ) {
		var asset  = this.getAssetAssetsStore().getById( newCard.title )
		if( asset ) this.showConfig( asset )
	},

	removeKeyMapping: function( view, selectedRow ) {
		var store = view.getStore()
		if( Ext.isObject( selectedRow ) ) store.remove( selectedRow )
		else store.removeAt( selectedRow )
	},

	showKeyMappingContextMenu: function( view, row, column, index, e, options ) {
		this.application.fireEvent( 'showkeymappingcontextmenu', view, row, column, index, e, options )
	},

	addKeyMapping: function( button ) {
		var grid  = button.up( 'keytoactionconfig' ).down( 'gridpanel' ),
			store = grid.getStore()

		store.add( { key: "LEFT_ARROW", action: "Default" } )
		grid.reconfigure( store )
	},

	refreshFontPreview: function( field ) {
		var form       = field.up( 'form' ),
			imageField = form.down( 'image' ),
			values     = form.getValues()

		imageField.setSrc( this.createFontMap( values, true ).imageDataUrl )
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
			animationAssetConfig = form.down('animationassetconfig'),
			textAssetConfig      = form.down('textappearanceconfig'),
			keyToActionMapConfig = form.down('keytoactionconfig')
		//Resetting defaults
		assetsCombo.hide()
		spriteSheetConfig.hide()
		animationAssetConfig.hide()
		textAssetConfig.hide()
		keyToActionMapConfig.hide()
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
				animationAssetConfig.show()
				break
			case "font":
				this.refreshFontPreview( assetsCombo )

				if( !!asset ) {
					form.getForm().setValues(
						{
							spacing      : asset.get('config').spacing,
							fontFamily   : asset.get('config').fontFamily,
							fontSize     : asset.get('config').fontSize,
							fontStyle    : asset.get('config').fontStyle,
							color        : asset.get('config').color,
							outline      : asset.get('config').outline,
							outlineColor : asset.get('config').outlineColor
						}
					)
				}

				textAssetConfig.show()
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
				fileUpload.show()
				break
			case "keyToActionMap":
				keyToActionMapConfig.show()
				if( !!asset ) {
					var grid   = keyToActionMapConfig.down('gridpanel'),
						store  = grid.getStore(),
						config = asset.get('config')

					store.removeAll()
					Ext.Object.each(
						config,
						function( key, value, myself ) {
							store.add( { key: key, action: value } )
						}
					)

					keyToActionMapConfig.down('gridpanel').reconfigure( store )
				}

				break
			default:
				fileUpload.show()
		}
	},

	showEdit: function( asset ) {
		var view = Ext.widget( 'editasset' ),
			form = view.down( 'form' )

		this.fieldRenderHelper( asset.get('subtype'), form, asset )
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

		if( !!values.fontFamily && record.get( 'subtype' ) === 'font') {
			var result        = this.createFontMap( values )
			values.fontCanvas = result.imageDataUrl
			values.charset    = Ext.encode( result.charset )
			values.baseline   = result.baseline
		}

		if( record.get( 'subtype' ) === 'keyToActionMap' ) record.set( 'config', this.getKeyMappings( window ) )
		else record.set( 'config', values )

		record.save()

		window.close()
	},

	showConfigHelper: function( tree, node ) {
		var inspectorPanel = this.getRightPanel(),
			Asset          = this.getModel('Asset')

		inspectorPanel.removeAll()
		inspectorPanel.add( this.getDefaultDocumentation() )

		if( !node.isLeaf() ) return

		Asset.load(
			node.getId(),
			{
				scope: this,
				success: function( asset ) {
					inspectorPanel.removeAll()
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
		switch( asset.get('subtype') ) {
			case 'animation':
				view.docString = '#!/guide/asset_type_2d_animated_appearance'
				break
			case 'spriteSheet':
				view.docString = '#!/guide/asset_type_sprite_sheet'
				break
			case 'appearance':
				view.docString = '#!/guide/asset_type_2d_static_appearance'
				break
			case 'text':
				view.docString = '#!/guide/asset_type_text_appearance'
				break
			case 'keyToActionMap':
				view.docString = '#!/guide/asset_type_key_to_action_map'
				break
		}

		inspectorPanel.add( view )
	},

	showAdditionalConfiguration: function( combo ) {
		var form = combo.up('form')
		assetfolderpicker = form.down( 'assetfolderpicker' )
		assetfolderpicker.getStore().setRootNode( this.application.getActiveProject().get('name') )
		this.fieldRenderHelper( combo.getValue(), form )
	},

    showListContextMenu: function( view, record, item, index, e, options ) {
        this.application.getController('Menu').showAssetsListContextMenu( e )
    },

	createFontMap: function( values, debug ) {
		var fontGenerator = Ext.amdModules.createFontGenerator()

		var settings = {
			font         : values.fontFamily,
			size         : parseInt( values.fontSize ),
			style        : values.fontStyle,
			spacing      : parseInt( values.spacing ),
			color        : values.color,
			outlineColor : values.outlineColor,
			outline      : parseInt( values.outline )
		}

		return fontGenerator.create( settings, debug )
	},

	getKeyMappings: function( window ) {
		var grid  = window.down( 'grid' ),
			store = grid.getStore(),
			keyToActionMappings = {}

		store.each(	function( item ) { keyToActionMappings[ item.get( 'key' ) ] = item.get( 'action' ) } )
		return keyToActionMappings
	},

    createAsset: function( button ) {
        var form    = button.up('form').getForm(),
            window  = button.up( 'window' ),
			fileField = window.down( 'filefield'),
			values  = form.getValues(),
			Asset   = this.getAssetModel(),
			me      = this,
			content = {
				name: values.name,
				namespace: ( values.folder === 'root' ) ? '' : values.folder,
				subtype: values.type
			},
			config  = {},
			id      = this.application.generateFileIdFromObject( content )

		if( form.isValid() ){
			content.id = id + ".json"
			var asset = Asset.create( content )

			if( values.type === "font" ) {
				var result = this.createFontMap( values )

				config.charset    = result.charset
				config.baseline   = result.baseline

				this.saveBase64AssetFile( id + ".png", result.imageDataUrl )
				asset.set( 'file', asset.get( 'name' ) + ".png" )

			} else if( values.type === "keyToActionMap" ){
				config = this.getKeyMappings( window )
			}

			if( !Ext.isEmpty( config ) ) asset.set( 'config', config )

			var successCallback = function( result ) {
				Ext.Msg.alert('Success', 'Your asset "' + result.getFullName() + '" has been uploaded.')
				me.refreshStoresAndTreeStores( true )
				window.close()
			}

			if( fileField.isVisible() && fileField.isValid() ) {
				var reader = new FileReader(),
					file   = fileField.fileRawInput

				// Closure to capture the file information.
				reader.onload = (function(theFile) {
					return function( e ) {
						var result    = e.target.result,
							extension = "." + theFile.type.split( "/").pop()

						me.saveBase64AssetFile( id + extension, result )
						asset.set( 'file', asset.get( 'name' ) + extension )
						asset.save({ success: successCallback } )
					};
				})( file )

				reader.readAsDataURL( file )
			} else {
				asset.save({ success: successCallback } )
			}
        }
    },

	saveBase64AssetFile: function( filePath, content ) {
		Spelled.StorageActions.create( {
			id: filePath,
			encoding: 'base64',
			content: content.replace(/^data:image\/\w+;base64,/, "")
		})
	},

    dropAsset: function() {
        console.log( arguments )
        console.log( "Dropped item in asset editor" )

        e.stopPropagation()
        e.preventDefault()
    },

    removeAsset: function( assetId ) {
        var Asset       = this.getModel('Asset'),
			assetEditor = this.getAssetEditor()

		this.application.closeOpenedTabs( assetEditor, assetId )

        Asset.load(
            assetId,
            {
                scope: this,
                success: function( asset ) {
                    asset.destroy(
						{
							callback: this.refreshStores,
							scope: this
						}
					)
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

        var assetEditor = this.getAssetEditor(),
            title       = record.getId()

        var Asset = this.getAssetModel()

        var foundTab = this.application.findActiveTabByTitle( assetEditor, title )

        if( foundTab )
            return foundTab

        Asset.load( record.getId() , {
            scope: this,
			success: function( asset ) {
				var View    = this.getAssetIframeView(),
					iframe  = {
						tag : 'iframe',
						src: '/' + asset.getFilePath( this.application.getActiveProject().get('name') ),
						border: '0',
						frameborder: '0',
						scrolling: 'no'
					},
					errorTag = {
						tag: 'h1',
						cls: "no-animation-text",
						html: 'Animation preview is not available.'
					}

				var view = new View( {
					title: title,
					autoEl: ( asset.get('subtype') === 'animation' ) ? errorTag : iframe
				} )

				this.application.createTab( assetEditor, view )
			}
		})
    },

	refreshStoresAndTreeStores: function( force, callback ) {
		this.refreshStores( callback )
	},

    refreshStores: function( callback ) {
		this.getAssetAssetsStore().load( {
			callback: callback
		})
    },

	getDefaultDocumentation: function() {
		return  { xtype: 'label' , docString : '#!/guide/concepts_assets'}
	}
});
