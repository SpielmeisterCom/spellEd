Ext.define('Spelled.controller.Assets', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.view.asset.ColorField',
		'Spelled.view.asset.Iframe',
		'Spelled.view.asset.Form',
		'Spelled.view.asset.FolderPicker',
		'Spelled.view.asset.create.Create',
		'Spelled.view.asset.create.Texture',
		'Spelled.view.asset.create.SpriteSheet',
		'Spelled.view.asset.create.Animation',
		'Spelled.view.asset.create.Font',
		'Spelled.view.asset.create.KeyToActionMap',
		'Spelled.view.asset.create.KeyFrameAnimation',
		'Spelled.view.asset.edit.Edit',
		'Spelled.view.asset.inspector.Config',
		'Spelled.view.asset.create.Domvas',
		'Spelled.view.asset.create.2dTileMap',


		'Spelled.store.asset.Types',
		'Spelled.store.asset.Textures',
		'Spelled.store.asset.Sounds',
		'Spelled.store.asset.Fonts',
		'Spelled.store.asset.SpriteSheets',
		'Spelled.store.asset.Animations',
		'Spelled.store.asset.ActionKeys',
		'Spelled.store.template.component.KeyFrameComponents',
		'Spelled.store.asset.KeyFrameAnimations',
		'Spelled.store.asset.KeyToActionMappings',
		'Spelled.store.asset.InterpolationFunctions',
		'Spelled.store.asset.Assets',

		'Spelled.model.Asset'
	],

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
		'asset.create.KeyFrameAnimation',
		'asset.create.2dTileMap',
		'asset.edit.Edit',
		'asset.inspector.Config',
		'asset.create.Domvas'
    ],

    stores: [
        'asset.Types',
        'asset.Textures',
        'asset.Sounds',
		'asset.Fonts',
		'asset.SpriteSheets',
		'asset.Animations',
		'asset.ActionKeys',
		'template.component.KeyFrameComponents',
		'asset.KeyFrameAnimations',
		'asset.KeyToActionMappings',
		'asset.InterpolationFunctions',
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
			selector: '#SceneEditor'
		},
		{
			ref : 'Navigator',
			selector: '#LibraryTree'
		}
    ],

    init: function() {
	    var me = this

        this.control({
			'createasset combobox[name="type"]': {
				select: this.showAdditionalConfiguration
			},
			'editasset field' : {
				change: this.editAssetHelper
			},
			'editasset gridpanel': {
				edit : this.editGrid
			},
			'keyframeanimationconfig > tool-documentation, keytoactionconfig > tool-documentation, spritesheetconfig > tool-documentation, animationassetconfig > tool-documentation, textappearanceconfig > tool-documentation': {
				showDocumentation: this.showDocumentation
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
			'keytoactionconfig, keyframeanimationconfig': {
				editclick: this.showKeyMappingContextMenu
			},
			'keytoactionconfig gridpanel, keyframeanimationconfig gridpanel': {
				itemcontextmenu: this.showKeyMappingContextMenu
			},
			'keytoactionconfig button[action="addKeyMapping"]': {
				click: this.addKeyMapping
			},
			'keyframeanimationconfig button[action="addFrame"]': {
				click: this.addFrame
			},
			'keyframeanimationconfig treepanel': {
				select : this.showKeyFramesFromAttribute
			},
			'domvasassetconfig': {
				domvasedit: this.showDomvasPreview
			}
        })

		this.application.on({
			'assetbeforeclose': this.checkIfAssetIsDirty,
			'removekeymapping': this.removeKeyMapping,
			'assettabchange'  : this.assetTabChange,
			'assetselect'     : this.showConfigHelper,
			'assetdblclick'   : this.showEditHelper,
			'assetcontextmenu': this.showListContextMenu,
			savemodel         : this.globalSaveModelHelper,
			scope: this
		})

	    // initializing the engine message bus
	    this.assetMessageBus = Ext.create(
		    'Spelled.MessageBus',
		    {
			    handlers : {
				    //tilemap editor initialized
				    'wm.initialized' : function( sourceId, payload ) {
					    me.assetMessageBus.flushQueue( sourceId )
				    },

				    //tilemap editor has changed data
				    'wm.save' : function( sourceId, payload ) {
					    var cmp = Ext.getCmp( sourceId ),
						    form = cmp.up('form'),
						    record = form.getRecord()

					    record.set("tileLayerData", payload.tileLayerData)
					   // record.set("collisionLayerData", payload.collisionLayerData)
					    record.setDirty()

+			            me.setAssetConfigFromForm( form, record )
					    me.fireEvent( 'assetchange', record )
				    }
			    }
		    }
	    )

	    window.addEventListener(
		    'message',
		    Ext.bind( this.assetMessageBus.receive, this.assetMessageBus ),
		    false
	    )
    },

	globalSaveModelHelper: function( model ) {
		if( model.get( 'type') === 'asset' && model.get( 'subtype' ) === 'font' ) {
			var id = this.application.generateFileIdFromObject( model.data )
			this.saveFontMap( id,  model.get( 'config' ) )
		}
	},

	checkIfAssetIsDirty: function( panel ) {
		var asset = panel.getRecord()

		if( asset.dirty ) {
			var callback = function( button ) {
				if ( button === 'yes') panel.destroy()
			}

			this.application.dirtySaveAlert( asset, callback )
			return false
		} else {
			panel.destroy()
		}
	},

	showDomvasPreview: function( view, content ) {
		var iframe = view.down( 'container[name="aceDomvasPreview"]' )

		iframe.el.dom.contentWindow.document.body.innerHTML = content
	},

	assetTabChange: function( tabPanel, newCard ) {
		var asset  = this.getAssetAssetsStore().findRecord( 'myAssetId', newCard.title )
		if( asset ) this.showConfig( asset )
	},

	removeKeyMapping: function( view, selectedRow ) {
		var asset = view.up( 'form' ).getRecord(),
			store = view.getStore()

		if( Ext.isObject( selectedRow ) ) store.remove( selectedRow )
		else store.removeAt( selectedRow )

		if( asset ) asset.setDirty()
	},

	showKeyMappingContextMenu: function( view, row, column, index, e, options ) {
		this.application.fireEvent( 'showkeymappingcontextmenu', view, row, column, index, e, options )
	},

	addToGrid: function( grid, object ) {
		var asset = grid.up( 'form' ).getRecord(),
			store = grid.getStore()

		store.add( object )
		grid.reconfigure( store )

		if( asset ) asset.setDirty()
	},

	addKeyMapping: function( button ) {
		var grid  = button.up( 'keytoactionconfig' ).down( 'gridpanel' )
		this.addToGrid( grid, { key: "LEFT_ARROW", action: "Default" } )
	},

	addFrame: function( button ) {
		var grid  = button.up( 'keyframeanimationconfig' ).down( 'gridpanel' )
		this.addToGrid( grid, { interpolation: "Linear", time: 0, value: 0 } )
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

	showEditHelper: function( id, node ) {
		if( node ) id = node.getId()

		var asset = this.getAssetAssetsStore().getById( id )
		this.showEdit( asset )
	},

	fieldRenderHelper: function( type, form, asset ) {
		var assetsCombo = form.down('combobox[name="assetId"]'),
			fileUpload  = form.down('filefield[name="asset"]'),
			spriteSheetConfig       = form.down('spritesheetconfig'),
			animationAssetConfig    = form.down('animationassetconfig'),
			textAssetConfig         = form.down('textappearanceconfig'),
			keyToActionMapConfig    = form.down('keytoactionconfig'),
			domvasassetconfig       = form.down('domvasassetconfig'),
			keyFrameAnimationConfig = form.down('keyframeanimationconfig'),
			tileMapConfig         = form.down('2dtilemapconfig')
		//Resetting defaults
		domvasassetconfig.hide()
		assetsCombo.hide()
		spriteSheetConfig.hide()
		animationAssetConfig.hide()
		textAssetConfig.hide()
		keyToActionMapConfig.hide()
		fileUpload.hide()
		keyFrameAnimationConfig.hide()
		tileMapConfig.hide()
		fileUpload.reset()
		assetsCombo.clearValue()


		switch( type ) {
			case "domvas":
				domvasassetconfig.show()

				var aceContainer = domvasassetconfig.down( 'container[name="aceDomvasContainer"]' ),
					Mode         = Ext.amdModules.aceModeHtml.Mode,
					editor       = Ext.amdModules.ace.edit( aceContainer.id ),
					session      = editor.getSession()

				domvasassetconfig.aceEditor = editor
				session.setMode( new Mode() )
				editor.setTheme( Ext.amdModules.aceThemePastelOnDark )

				if( !!asset ) {
					session.setValue( asset.get('config').html )
				}

				domvasassetconfig.startEdit()
				break
			case "animation":
				if( !!asset ) {
					form.getForm().setValues(
						{
							assetId  : asset.get( 'assetId' ),
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
			case "keyFrameAnimation":
				this.renderKeyFrameAnimationComponentsTree( keyFrameAnimationConfig )
				keyFrameAnimationConfig.show()

				if( !!asset ) {
					var config = asset.get('config')
					keyFrameAnimationConfig.down( 'numberfield[name="length"]' ).setValue( config.length )
					keyFrameAnimationConfig.asset = asset
					keyFrameAnimationConfig.keyFrameConfig = Ext.clone( config )
				} else {
					keyFrameAnimationConfig.keyFrameConfig = { animate: {} }
				}

				break
			case "2dTileMap":
				tileMapConfig.show()

				if( !!asset ) {
					var config = asset.get('config')


					form.getForm().setValues(
						{
							assetId: config.assetId,
							width : config.width,
							height: config.height
						}
					)

					this.updateTilemapEditorData( form, asset )

				}
				break
			default:
				fileUpload.show()
		}
	},

	updateTilemapEditorData: function ( form, asset ) {
		var config = asset.get('config'),
			tilemapEditorIframe = form.down('tilemapeditoriframe')

		//load data in the tilemap editor iframe
		this.assetMessageBus.send(
			tilemapEditorIframe.getId(),
			{
				type : "wm.load",
				payload: config
			}
		)

	},

	renderKeyFrameAnimationComponentsTree: function( view ) {
		var availableComponentsView = view.down( 'treepanel' ),
			templateComponentsStore = Ext.getStore( 'template.component.KeyFrameComponents'),
			rootNode = availableComponentsView.getStore().setRootNode( {
					text: 'Components',
					expanded: true
				}
			)

		templateComponentsStore.load({
				scope: this,
				callback: function() {
					this.application.getController('Components').appendComponentsAttributesOnTreeNode( rootNode, templateComponentsStore )
				}
			}
		)
	},

	getKeyFrameAnimationConfig: function( view ) {
		var config    = view.keyFrameConfig,
			newConfig = { animate: {} }

		Ext.Object.each(
			config.animate,
			function( key, component ) {

				var tmpConfig = {}
				newConfig.animate[ key ] = tmpConfig

				Ext.Object.each(
					component,
					function( key, attribute ) {
						if( attribute.tmpStore ) {
							var keyFrames = []
							tmpConfig[ key ] = {}
							tmpConfig[ key ].keyFrames = keyFrames
							attribute.tmpStore.each(
								function( item ) {
									var cloned        = Ext.clone( item.data ),
										value         = item.get( 'value'),
										interpolation = item.get('interpolation')

									cloned.value = Ext.decode( item.get( 'value'), true ) || item.get( 'value')
									if( !interpolation || Ext.Array.contains( [ "Linear" ], interpolation ) ) delete cloned.interpolation

									keyFrames.push( cloned )
								}
							)
						} else if( attribute.keyFrames ) {
							tmpConfig[ key ] = {}
							tmpConfig[ key ].keyFrames = attribute.keyFrames
						}

						if( Ext.isEmpty( tmpConfig[ key ].keyFrames ) ) delete tmpConfig[ key ]
					}
				)

				if( Ext.isEmpty( Ext.Object.getKeys( newConfig.animate[ key ] ) ) ) delete newConfig.animate[ key ]
			}
		)

		return newConfig
	},

	createKeyFrameComponentConfig: function( config, component ) {
		component.getAttributes().each(
			function( attribute ) {
				if( config[ attribute.get( 'name' ) ] ) return

				config[ attribute.get( 'name' ) ] = {
					keyFrames: []
				}
			}
		)
	},

	showKeyFramesFromAttribute: function( selectionModel, node ) {
		var configPanel   = selectionModel.view.up( 'keyframeanimationconfig' ),
			grid          = configPanel.down( 'gridpanel' ),
			parentId      = node.get( 'parentId' ),
			attributeName = node.get( 'text'),
			config        = configPanel.keyFrameConfig


		if( node.isLeaf() ) {
			var component   = this.getTemplateComponentKeyFrameComponentsStore().getById( parentId ),
				componentId = component.getFullName(),
				data        = [],
				xtype       = Ext.getStore( 'template.component.AttributeTypes' ).findRecord( 'name',component.getAttributeByName( attributeName ).get('type') ).get('type')

			var componentConfig = config.animate[ componentId ]

			if( !componentConfig ) componentConfig = config.animate[ componentId ] = {}

			if( configPanel.asset ){
				data = configPanel.asset.getKeyFrameFromComponentAttribute( componentId, attributeName )

				data = Ext.Array.map(
					data,
					function( item ) {
						var converted = Ext.clone( item )
						if( !converted.interpolation ) converted.interpolation = "Linear"
						converted.value = this.application.getController( 'Components' ).convertValueForGrid( item.value )
						return converted
					},
					this
				)
			}

			var column = Ext.create('Ext.grid.column.Column', {
				header: 'value',
				width: 120,
				dataIndex: 'value',
				editor: {
					xtype: xtype
				}
			})
			grid.headerCt.remove( grid.down( 'gridcolumn[dataIndex="value"]' ), true )
			grid.headerCt.insert( 1, column)
			grid.getView().refresh()

			this.createKeyFrameComponentConfig( componentConfig, component )

			var store = componentConfig[ attributeName ].tmpStore || Ext.create( 'Ext.data.Store',{
					fields: [ 'time','value','interpolation' ],
					data: data,
					sorters: { property: 'time', direction : 'ASC' }
				}
			)

			componentConfig[ attributeName ].tmpStore = store
			grid.reconfigure( store )
			grid.show()
		} else {
			grid.hide()
		}
	},

	showEdit: function( asset ) {
		var assetEditor = this.getAssetEditor(),
			title       = asset.getFullName(),
			foundTab    = this.application.findActiveTabByTitle( assetEditor, title )

		if( foundTab )
			return foundTab

		var view = Ext.widget( 'editasset', { title: title } )

		this.fieldRenderHelper( asset.get('subtype'), view, asset )
		view.loadRecord( asset )

		//TODO: enable changing file
		view.down('filefield').hide()

		this.addAssetPreview( view, asset )

		this.application.createTab( assetEditor, view )
	},

	editAssetHelper: function( field, value, oldValue ) {
		if( !oldValue ) return
		this.editAsset( field )
	},

	editGrid: function( editor, e ) {
		this.editAsset( editor.grid )
	},

	editAsset: function( button ) {
		var form   = button.up('form'),
			record = form.getRecord()

		if( record ) {
			this.setAssetConfigFromForm( form, record )

			this.application.fireEvent( 'assetchange', record )

			if (record.get("subtype") == "2dTileMap") {
				this.updateTilemapEditorData( form, record )
			}
		}
	},

	showConfigHelper: function( tree, node ) {
		var inspectorPanel = this.getRightPanel()

		if( !node.isLeaf() ) return

		var asset = this.getAssetAssetsStore().getById( node.getId() )
		inspectorPanel.removeAll()
		this.showConfig( asset )
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
				view.add( { xtype: 'image', margin: 20, src: '/' + asset.getFilePath( this.application.getActiveProject().get('name') )} )
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

	setAssetConfigFromForm: function( form, asset ) {
		var values    = form.getForm().getValues(),
			config    = {}

		switch( asset.get( 'subtype' ) ) {
			case 'font':
				var result = this.createFontMap( values )
				config.charset    = result.charset
				config.baseline   = result.baseline

				Ext.copyTo( config, values, 'fontFamily,fontSize,fontStyle,color,outline,outlineColor,spacing' )
				asset.set( 'file', asset.get( 'name' ) + ".png" )
				break
			case 'keyToActionMap':
				config = this.getKeyMappings( form )
				break
			case 'domvas':
				var aceEditor = form.down( 'domvasassetconfig' ).aceEditor
				config.html = aceEditor.getSession().getValue()
				break
			case 'animation':
				asset.set( 'assetId', values.assetId )
				config.type     = values.animationType
				config.duration = values.duration
				config.frameIds = values.frameIds.split( "," )
				break
			case 'spriteSheet':
				Ext.copyTo( config, values, 'textureWidth,textureHeight,frameWidth,frameHeight' )
				break
			case 'keyFrameAnimation':
				config = this.getKeyFrameAnimationConfig( form.down( 'keyframeanimationconfig' ) )
				config.length = parseInt( values.length )
				break
			case '2dTileMap':
				asset.set( 'assetId', values.assetId )
				Ext.copyTo( config, values, 'width,height' )
				config.tileLayerData = asset.get("tileLayerData")
			// 	config.collisionLayerData = asset.get("collisionLayerData")
				break
		}

		if( !Ext.isEmpty( config ) ) asset.set( 'config', config )
	},

	saveFontMap: function( id, values ) {
		var result = this.createFontMap( values )
		this.saveBase64AssetFile( id + ".png", result.imageDataUrl )
	},

	saveAsset: function( form, asset ) {
		var fileField = form.down( 'filefield'),
			window    = form.up( 'window'),
			me        = this,
			id        = this.application.generateFileIdFromObject( asset.data )

		this.setAssetConfigFromForm( form, asset )

		if( asset.get( 'subtype' ) === 'font' ) {
			this.saveFontMap( id,  form.getForm().getValues() )
		}

		var successCallback = Ext.bind( function( result) {
			this.successCallback( result )
		},this)

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
					asset.save({ success: successCallback })
				};
			})( file )

			reader.readAsDataURL( file )
		} else {
			asset.save({ success: successCallback })
		}

		window.close()
	},

    createAsset: function( button ) {
        var form    = button.up('form').getForm(),
            window  = button.up( 'window' ),
			values  = form.getValues(),
			Asset   = this.getAssetModel(),
			content = {
				name: values.name,
				namespace: ( values.namespace === 'root' ) ? '' : values.namespace.substring( 5 ),
				subtype: values.type
			},
			id      = this.application.generateFileIdFromObject( content )

		if( form.isValid() ){
			content.id = id + ".json"
			var asset = Asset.create( content )
			this.saveAsset( button.up('form'), asset )
        }
    },

	successCallback : function( result ) {
		this.refreshStoresAndTreeStores()
	},

	saveBase64AssetFile: function( filePath, content ) {
		Spelled.StorageActions.create( {
			id: filePath,
			encoding: 'base64',
			content: content.replace(/^data:image\/\w+;base64,/, "")
		})
	},

	removeAsset: function( assetId ) {
        var asset       = this.getAssetAssetsStore().getById( assetId ),
			assetEditor = this.getAssetEditor()

		this.application.closeOpenedTabs( assetEditor, asset.getFullName() )

		asset.destroy(
			{
				callback: this.refreshStores,
				scope: this
			}
		)
    },

    showCreateAsset: function( button ) {
        var view        = Ext.widget( 'createasset' ),
			assetsCombo = view.down('combobox[name="type"]'),
			assetType   = button.type

		view.show()

		assetsCombo.setValue( assetType )

		this.fieldRenderHelper( assetType, view )
    },

    addAssetPreview: function( view, asset ) {
		var subtype = asset.get('subtype'),
			iframe  = {
				tag : 'iframe',
				src: '/' + asset.getFilePath( this.application.getActiveProject().get('name') ),
				border: '0',
				frameborder: '0',
				height: '80%'
			},
			errorTag = {
				tag: 'h1',
				cls: "no-animation-text",
				html: 'Animation preview is not available.'
			}

		if( subtype !== 'keyToActionMap' && subtype !== 'font' && subtype !== 'keyFrameAnimation' && subtype !== '2dTileMap') {
			var preview = Ext.widget( 'assetiframe', {
				autoEl: ( subtype === 'animation' ) ? errorTag : iframe
			} )

			view.add( preview )
		}
    },

	refreshStoresAndTreeStores: function( callback ) {
		this.refreshStores( callback )
	},

    refreshStores: function( callback ) {
		this.getAssetAssetsStore().load( {
			callback: callback
		})
    }
});
