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
		'Spelled.view.asset.create.FileField',
		'Spelled.view.asset.create.Sound',


		'Spelled.store.asset.Types',
		'Spelled.store.asset.Textures',
		'Spelled.store.asset.Sounds',
		'Spelled.store.asset.Fonts',
		'Spelled.store.asset.SpriteSheets',
		'Spelled.store.asset.Animations',
		'Spelled.store.asset.ActionKeys',
		'Spelled.store.template.component.KeyFrameComponents',
		'Spelled.store.asset.KeyFrameAnimations',
        'Spelled.store.asset.KeyFrameAnimationPreviews',
		'Spelled.store.asset.KeyToActionMappings',
		'Spelled.store.asset.InterpolationFunctions',
		'Spelled.store.asset.Assets',
		'Spelled.store.asset.Tilemaps',

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
		'asset.create.Sound',
		'asset.edit.Edit',
		'asset.inspector.Config',
		'asset.create.Domvas',
		'asset.create.FileField'
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
        'asset.KeyFrameAnimationPreviews',
		'asset.KeyToActionMappings',
		'asset.InterpolationFunctions',
	    'asset.Tilemaps',
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
			'editasset field' : {
				change: this.editAssetHelper
			},
			'editasset gridpanel': {
				edit : this.editGrid
			},
			'assetform tool-documentation, editasset tool-documentation': {
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
            'keyframeanimationconfig': {
				refreshassetpreview: this.refreshAssetPreview
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

			            me.setAssetConfigFromForm( form, record )
					    me.application.fireEvent( 'assetchange', record )
				    }
			    }
		    }
	    )

		this.application.engineMessageBus.addHandler(
			{
				'spelled.asset.update' : function( sourceId, payload ) {
					var assetId     = payload.id,
						config      = payload.config

					me.updateAsset( assetId, config )
				}
			}
		)

	    window.addEventListener(
		    'message',
		    Ext.bind( this.assetMessageBus.receive, this.assetMessageBus ),
		    false
	    )
    },

    refreshAssetPreview: function( iframe, asset, value ) {
		asset.set( 'assetId', value )
        this.animationPreviewHelper( iframe, asset )
    },

	updateAsset: function( assetId, config ) {
		var asset = this.getAssetAssetsStore().findRecord( 'myAssetId', assetId )

		if( asset ) {
			asset.set( 'config', config )
			this.application.fireEvent( 'assetchange', asset )
		}
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

	fieldRenderHelper: function( type, fieldSet, asset ) {
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
				this.addAnimationForm( fieldSet, asset )
				break
			case "font":
				this.addFontForm( fieldSet, asset )
				break
			case "spriteSheet":
				this.addSpriteSheetForm( fieldSet, asset )
				break
			case "keyToActionMap":
				this.addKeyToActionMapForm( fieldSet, asset )
				break
			case "keyFrameAnimation":
				this.addKeyFrameAnimationForm( fieldSet, asset )
				break
			case "2dTileMap":
				this.add2dTileMapForm( fieldSet, asset )
				break
			case 'appearance':
				this.addTextureForm( fieldSet, asset )
				break
			case 'sound':
				this.addSoundForm( fieldSet, asset )
				break
		}
	},

	add2dTileMapForm: function( fieldSet, asset ) {
		fieldSet.add( { xtype: '2dtilemapconfig' } )

		if( !!asset ) {
			var config = asset.get('config')

			fieldSet.getForm().setValues(
				{
					tileMapAssetId: asset.get('assetId'),
					width : config.width,
					height: config.height
				}
			)

			this.updateTilemapEditorData( fieldSet, asset )
		}
	},

	addKeyToActionMapForm: function( fieldSet, asset ) {
		var keyToActionMapConfig = fieldSet.add( { xtype: 'keytoactionconfig' } )

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
	},

	addSoundForm: function( fieldSet, asset ) {
		fieldSet.add( { xtype: 'soundasset' } )
	},

	addFontForm: function( fieldSet, asset ) {
		fieldSet.add( { xtype: 'textappearanceconfig' } )

		this.refreshFontPreview( fieldSet.down( 'combobox[name="fontFamily"]' ) )

		if( !!asset ) {
			fieldSet.getForm().setValues(
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
	},

	addKeyFrameAnimationForm: function( fieldSet, asset ) {
		var keyFrameAnimationConfig = fieldSet.add( { xtype: 'keyframeanimationconfig' } )
		this.renderKeyFrameAnimationComponentsTree( keyFrameAnimationConfig )

		if( !!asset ) {
			var config = asset.get('config')
			keyFrameAnimationConfig.down( 'numberfield[name="length"]' ).setValue( config.length )
			keyFrameAnimationConfig.down( 'assetidproperty').setValue( asset.get( 'assetId' ) )
			keyFrameAnimationConfig.asset = asset
			keyFrameAnimationConfig.keyFrameConfig = Ext.clone( config )
		} else {
			keyFrameAnimationConfig.keyFrameConfig = { animate: {} }
		}
	},

	addAnimationForm: function( fieldSet, asset ) {
		fieldSet.add( { xtype: 'animationassetconfig' } )

		if( !!asset ) {
			fieldSet.getForm().setValues(
				{
					assetId  : asset.get( 'assetId' ),
					duration : asset.get('config').duration,
					frameIds : asset.get('config').frameIds
				}
			)
		}
	},

	addSpriteSheetForm: function( fieldSet, asset ) {
		fieldSet.add( {xtype: 'spritesheetconfig' } )

		if( !!asset ) {
			fieldSet.getForm().setValues(
				{
					textureWidth  : asset.get('config').textureWidth,
					textureHeight : asset.get('config').textureHeight,
					frameWidth    : asset.get('config').frameWidth,
					frameHeight   : asset.get('config').frameHeight
				}
			)
		}
	},

	addTextureForm: function( fieldSet, asset ) {
		fieldSet.add( { xtype: 'textureasset' } )
	},

	updateTilemapEditorData: function ( form, asset ) {
		var config = asset.get('config'),
			tilemapEditorIframe = form.down('tilemapeditoriframe'),
			assetsStore = this.getAssetAssetsStore(),
			spriteSheetFullName = asset.get('assetId'),
			spriteSheetAsset = null


		var index = assetsStore.findBy( function( record ) {
			return ( 'spriteSheet:' + record.getFullName() === spriteSheetFullName )
		})

		if( index > -1 ) {
			spriteSheetAsset = assetsStore.getAt( index )

			var wmConfig = Ext.copyTo({}, spriteSheetAsset.get('config'), 'frameHeight,frameWidth')
			Ext.copyTo(wmConfig, config, 'width,height,tileLayerData')

			wmConfig.path = spriteSheetAsset.getFilePath( this.application.getActiveProject().get( 'name' ) )

			//load data in the tilemap editor iframe
			this.assetMessageBus.send(
				tilemapEditorIframe.getId(),
				{
					type : "wm.load",
					payload: wmConfig
				}
			)
		}
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
						converted.value = Spelled.Converter.convertValueForGrid( item.value )
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
		if( view.down('filefield') ) view.down('filefield').hide()

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

            var iframe = button.up( 'editasset' ).down( 'assetiframe' )
            if( iframe)
                this.application.sendChange( iframe.getId(), "library.updateAsset", { definition: record.toSpellEngineMessageFormat() } )

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
                asset.set( 'assetId', values.assetId )
				config = this.getKeyFrameAnimationConfig( form.down( 'keyframeanimationconfig' ) )
				config.length = parseInt( values.length )
				break
			case '2dTileMap':
				asset.set( 'assetId', values.tileMapAssetId )
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
		var fileField = form.down( 'assetfilefield'),
			window    = form.up( 'window'),
			me        = this,
			id        = this.application.generateFileIdFromObject( asset.data ),
			type      = asset.get( 'subtype' )

		this.setAssetConfigFromForm( form, asset )

		if( type === 'font' ) {
			this.saveFontMap( id,  form.getForm().getValues() )
		}

		var successCallback = Ext.bind( function( result) {
			this.successCallback( result )
		},this)

		if( fileField && fileField.isValid() ) {
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
			content: content.replace(/^data:[A-Za-z0-9\/]*;base64,/, "")
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
			assetsCombo = view.down('hidden[name="type"]'),
			assetType   = button.type

		assetsCombo.setValue( assetType )

		this.fieldRenderHelper( assetType, view.down( 'fieldset' ) )

		view.show()
    },

    addAssetPreview: function( view, asset ) {
		var project = this.application.getActiveProject()

		switch( asset.get('subtype') ) {
			case 'appearance':
			case 'spriteSheet':
				view.add( Ext.widget( 'assetiframe', { src: '/' + asset.getFilePath( project.get('name') ) } ) )
				break
            case 'keyFrameAnimation':
			case 'animation':
				var preview = Ext.widget( 'assetiframe', { src: '/' + project.get( 'name' ) + '/public/spellEdShim.html' } )

				this.animationPreviewHelper( preview, asset )

				view.add( preview )
				break
		}
    },

	animationPreviewHelper: function( container, asset ) {
		var entityConfig = Ext.create( 'Spelled.model.config.Entity', { name: "asset" }),
            components   = entityConfig.getComponents()

        components.add( [
            { templateId: "spell.component.2d.transform" },
            { templateId: "spell.component.visualObject" }
		])

        if( asset.get('subtype') === 'keyFrameAnimation' ){
            var previewAsset = this.getAssetAssetsStore().findRecord( 'internalAssetId', asset.get( 'assetId' )),
                componentId  = 'spell.component.2d.graphics.appearance',
                config       = {}

            if( previewAsset ) {
                switch( previewAsset.get( 'subtype' ) ) {
                    case 'animation':
                        componentId   = 'spell.component.2d.graphics.animatedAppearance'
                        break
                }

                config.assetId = previewAsset.get( 'internalAssetId' )
            }

            components.add([{
                templateId: "spell.component.animation.keyFrameAnimation",
                config:{ assetId: asset.get( 'internalAssetId' ) }
            },{
                templateId: componentId,
                config: config
            }])

        } else {
            components.add({
                templateId: "spell.component.2d.graphics.animatedAppearance",
                config:{ assetId: asset.get( 'internalAssetId' ) } }
            )
        }

        components.each(
			function( component ) {
				component.set( 'additional', true )
			}
		)

		this.application.engineMessageBus.send(
			container.getId(),
			{
				type : 'spelled.debug.runtimeModule.start',
				payload : this.application.getController( 'templates.Entities' ).createEntityPreviewItem( entityConfig )
			}
		)
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
