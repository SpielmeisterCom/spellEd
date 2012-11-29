Ext.define('Spelled.controller.Assets', {
    extend: 'Ext.app.Controller',

	TYPE_TILE_MAP: '2dTileMap',
	TYPE_APPEARANCE: 'appearance',
	TYPE_SPRITE_SHEET: 'spriteSheet',
	TYPE_ANIMATION: 'animation',
	TYPE_KEY_FRAME_ANIMATION: 'keyFrameAnimation',
	TYPE_FONT: 'font',
	TYPE_SOUND: 'sound',
	TYPE_KEY_TO_ACTION: 'keyToActionMap',

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
		'Spelled.abstract.field.AssetId',


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

	messageBus: {},

    init: function() {
        this.control({
			'editasset': {
				assetdeeplink: this.assetDeepLink
			},
			'editasset field' : {
				change: this.editAssetHelper
			},
			'editasset filefield': {
				filechanged: this.updateAssetFile
			},
			'editasset gridpanel': {
				edit : this.editGrid
			},
			'assetform tool-documentation, editasset tool-documentation': {
				showDocumentation: this.showDocumentation
			},
            'librarymenu button[action="showCreateAsset"]' : {
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

		this.application.engineMessageBus.addHandler( {
			'spelled.debug.library.updateAsset' : Ext.bind( this.handleUpdateAssetMessage, this )
		})

		this.application.on({
			'spellfinishedloading': this.sendAssetPreviewMessages,
			'assetbeforeclose': this.checkIfAssetIsDirty,
			'removekeymapping': this.removeKeyMapping,
			'assettabchange'  : this.assetTabChange,
			'assetselect'     : this.showConfigHelper,
			'assetdblclick'   : this.showEditHelper,
			'assetcontextmenu': this.showListContextMenu,
			'savemodel'       : this.postProcessAsset,
			'renameasset'     : this.renameAsset,
			scope: this
		})
    },

	renameAsset: function( asset, newName, oldName ) {
		if( Spelled.Compare.isEqual( newName, oldName ) ) return



	},

	sendAssetPreviewMessages: function( targetId ) {
		if( !this.messageBus[ targetId ] ) return

		Ext.each(
			this.messageBus[ targetId ],
			function( message ) {
				this.application.sendDebugMessage( targetId, message.type, message.payload )
			},
			this
		)

		delete this.messageBus[ targetId ]
	},

	handleUpdateAssetMessage: function( iFrameId, payload ) {
		var asset = this.getAssetAssetsStore().findRecord( 'internalAssetId', payload.id )

		if( asset ) {
			this.updateAsset( asset.get( 'myAssetId' ), payload.config )
		}
	},

	assetDeepLink: function( internalAssetId ) {
		var record = this.getAssetAssetsStore().findRecord( 'internalAssetId', internalAssetId ),
			tree   = this.getNavigator()

		if( record ) {
			var node = tree.getStore().getById( record.getId() )

			if( node ) this.application.fireEvent( 'assetdblclick', tree, node )
		}
	},

	updateAssetFile: function( fileField ) {
		var form  = fileField.up( 'form' ),
			asset = form.getForm().getRecord(),
			me    = this,
			tree  = this.getNavigator()

		var callback = function() {
			var iframe = fileField.up( 'panel' ).down( 'assetiframe' ),
				node   = me.application.getLastSelectedNode( tree )

			if( tree.isVisible() && node && node.getId() === asset.getId() ) {
				me.application.selectNode( tree, node )
			}

			iframe.load()
		}

		this.saveFileUploadFromAsset( fileField, asset, callback )

		fileField.clearFileUpload()
	},

    refreshAssetPreview: function( iframe, asset, value ) {
		var entityConfig = iframe.up( 'editasset' ).entity

		asset.set( 'assetId', value )

		this.application.sendDebugMessage(
			iframe.getId(),
			"component.update",
			{
				entityId    : entityConfig.getId(),
				componentId : "spell.component.2d.graphics.animatedAppearance",
				config      : { assetId: asset.get( 'assetId' ) }
			}
		)
    },

	updateAsset: function( assetId, config ) {
		var asset = this.getAssetAssetsStore().findRecord( 'myAssetId', assetId )

		if( asset ) {
			asset.set( 'config', config )
			this.application.fireEvent( 'assetchange', asset )
		}
	},

	postProcessAsset: function( model ) {
		if( model.get( 'type') === 'asset' && model.get( 'subtype' ) === this.TYPE_FONT ) {
			var id = this.application.generateFileIdFromObject( model.data )
			this.saveFontMap( id,  model.get( 'config' ) )
		}

		//TODO: remove this workaround for tilemaps
		if( model.get( 'type') === 'asset' && model.get( 'subtype' ) === this.TYPE_TILE_MAP ) {
			this.sliceTileMapData( model )
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
			case this.TYPE_ANIMATION:
				this.addAnimationForm( fieldSet, asset )
				break
			case this.TYPE_FONT:
				this.addFontForm( fieldSet, asset )
				break
			case this.TYPE_SPRITE_SHEET:
				this.addSpriteSheetForm( fieldSet, asset )
				break
			case this.TYPE_KEY_TO_ACTION:
				this.addKeyToActionMapForm( fieldSet, asset )
				break
			case this.TYPE_KEY_FRAME_ANIMATION:
				this.addKeyFrameAnimationForm( fieldSet, asset )
				break
			case this.TYPE_TILE_MAP:
				this.add2dTileMapForm( fieldSet, asset )
				break
			case this.TYPE_APPEARANCE:
				this.addTextureForm( fieldSet, asset )
				break
			case this.TYPE_SOUND:
				this.addSoundForm( fieldSet, asset )
				break
		}
	},

	add2dTileMapForm: function( fieldSet, asset ) {
		fieldSet.add( { xtype: '2dtilemapconfig', edit: !!asset } )

		if( !!asset ) {
			var config = asset.get('config')

			fieldSet.getForm().setValues(
				{
					tileMapAssetId: asset.get('assetId'),
					width : parseInt( config['width'], 10 ),
					height: parseInt( config['height'], 10 )
				}
			)
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
		fieldSet.add( { xtype: 'animationassetconfig', edit: !!asset } )

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
					frameHeight   : asset.get('config').frameHeight,
					innerPadding  : asset.get('config').innerPadding
				}
			)
		}
	},

	addTextureForm: function( fieldSet, asset ) {
		fieldSet.add( { xtype: 'textureasset' } )
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


		this.addAssetPreview( view, asset )

		this.application.createTab( assetEditor, view )
	},

	editAssetHelper: function( field, value, oldValue ) {
		if( Ext.isEmpty( oldValue ) ) return
		this.editAsset( field )
	},

	editGrid: function( editor, e ) {
		this.editAsset( editor.grid )
	},

	editAsset: function( button ) {
		var form   = button.up('form'),
			record = form.getRecord(),
			iframe = button.up( 'editasset' ).down( 'assetiframe' )

		if( record ) {
			this.setAssetConfigFromForm( form, record )

			this.application.fireEvent( 'assetchange', record )

            if( iframe)
				this.application.sendDebugMessage( iframe.getId(), "library.updateAsset", { definition: record.toSpellEngineMessageFormat() } )
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
		//TODO: refactor
		switch( asset.get('subtype') ) {
			case this.TYPE_ANIMATION:
				view.docString = '#!/guide/asset_type_2d_animated_appearance'
				break
			case this.TYPE_SPRITE_SHEET:
				view.docString = '#!/guide/asset_type_sprite_sheet'
				break
			case this.TYPE_APPEARANCE:
				view.docString = '#!/guide/asset_type_2d_static_appearance'
				view.add( { xtype: 'image', margin: 20, src: '/' + asset.getFilePath( this.application.getActiveProject().get('name') )} )
				break
			case this.TYPE_FONT:
				view.docString = '#!/guide/asset_type_text_appearance'
				break
			case this.TYPE_KEY_TO_ACTION:
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
			case this.TYPE_FONT:
				var result = this.createFontMap( values )
				config.charset    = result.charset
				config.baseline   = result.baseline

				Ext.copyTo( config, values, 'fontFamily,fontSize,fontStyle,color,outline,outlineColor,spacing' )
				asset.set( 'file', asset.get( 'name' ) + ".png" )
				break
			case this.TYPE_KEY_TO_ACTION:
				config = this.getKeyMappings( form )
				break
			case 'domvas':
				var aceEditor = form.down( 'domvasassetconfig' ).aceEditor
				config.html = aceEditor.getSession().getValue()
				break
			case this.TYPE_ANIMATION:
				asset.set( 'assetId', values.assetId )
				config.type     = values.animationType
				config.duration = values.duration
				config.frameIds = values.frameIds.split( "," )
				break
			case this.TYPE_SPRITE_SHEET:
				config.textureWidth     = parseInt( values.textureWidth, 10 )
				config.textureHeight    = parseInt( values.textureHeight, 10 )
				config.frameWidth       = parseInt( values.frameWidth, 10 )
				config.frameHeight      = parseInt( values.frameHeight, 10 )
				config.innerPadding     = parseInt( values.innerPadding, 10 )
				break
			case this.TYPE_KEY_FRAME_ANIMATION:
                asset.set( 'assetId', values.assetId )
				config = this.getKeyFrameAnimationConfig( form.down( 'keyframeanimationconfig' ) )
				config.length = parseInt( values.length )
				break
			case this.TYPE_TILE_MAP:
				asset.set( 'assetId', values.tileMapAssetId )
				config['width']  = parseInt( values.width, 10 )
				config['height'] = parseInt( values.height, 10 )
				config.tileLayerData = this.getMergedTileMapDataDimensions( asset, config )
				break
		}

		if( !Ext.isEmpty( config ) ) asset.set( 'config', config )
	},

	saveFontMap: function( id, values ) {
		var result = this.createFontMap( values )
		this.saveBase64AssetFile( id + ".png", result.imageDataUrl )
	},

	saveAsset: function( form, asset ) {
		var fileField = form.down( 'assetfilefield' ),
			window    = form.up( 'window' ),
			id        = this.application.generateFileIdFromObject( asset.data ),
			type      = asset.get( 'subtype' )

		this.setAssetConfigFromForm( form, asset )

		if( type === this.TYPE_FONT ) {
			this.saveFontMap( id,  form.getForm().getValues() )
		}

		var successCallback = Ext.bind( function( result) {
			this.successCallback( result )
		},this)

		if( fileField && fileField.isValid() ) {
			this.saveFileUploadFromAsset( fileField, asset, successCallback )
		} else {
			asset.save({ success: successCallback })
		}

		window.close()
	},

	getMergedTileMapDataDimensions: function( asset, config ) {
		var data   = asset.get( 'config').tileLayerData || [],
			height = config['height'],
			width  = config['width']

		for( var y = 0; y < height; y++ ) {
			data[y] = data[ y ] || []
			for( var x = 0; x < width; x++ ) {
				data[y][x] = data[ y ] [ x ] || null
			}
		}

		return data
	},

	sliceTileMapData: function( asset ) {
		var config = asset.get( 'config'),
			data   = config.tileLayerData,
			height = config['height'],
			width  = config['width'],
			slice  = Ext.Array.slice

		for( var y = 0; y < height; y++ ) {
			data[y] = slice( data[y], 0, width )
		}

		config.tileLayerData = slice( data, 0, height )
		asset.save()
	},

	saveFileUploadFromAsset: function( fileField, asset, callback ) {
		var me     = this,
			id     = this.application.generateFileIdFromObject( asset.data ),
			reader = new FileReader(),
			file   = fileField.fileRawInput

		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function( e ) {
				var result    = e.target.result,
					extension = "." + theFile.type.split( "/").pop()

				me.saveBase64AssetFile( id + extension, result )
				asset.set( 'file', asset.get( 'name' ) + extension )
				asset.save({ success: callback })
			}
		})( file )
		reader.readAsDataURL( file )
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

		this.application.fireEvent( 'selectnamespacefrombutton', view, button )
    },

    addAssetPreview: function( view, asset ) {
		var project      = this.application.getActiveProject(),
			entityConfig = Ext.create( 'Spelled.model.config.Entity', { name: "asset" }),
			components   = entityConfig.getComponents(),
			subType      = asset.get('subtype')

		view.entity = entityConfig

		components.add( [
			{ templateId: "spell.component.2d.transform" },
			{ templateId: "spell.component.visualObject" }
		])

		switch( subType ) {
			case this.TYPE_APPEARANCE:
			case this.TYPE_SPRITE_SHEET:
				view.add( { xtype: 'assetiframe', src: '/' + asset.getFilePath( project.get('name') ) } )
				break
            case this.TYPE_KEY_FRAME_ANIMATION:
			case this.TYPE_ANIMATION:
			case this.TYPE_TILE_MAP:
				var preview = Ext.widget( 'assetiframe', { src: '/' + project.get( 'name' ) + '/public/spellEdShim.html' } )

				if( subType === this.TYPE_TILE_MAP )
					this.tileMapPreviewHelper( preview, asset, entityConfig )
				else
					this.animationPreviewHelper( preview, asset, entityConfig )

				view.add( preview )
				break
		}
    },

	animationPreviewHelper: function( container, asset, entity ) {
		var components = entity.getComponents()

        if( asset.get('subtype') === this.TYPE_KEY_FRAME_ANIMATION ){
            var previewAsset = this.getAssetAssetsStore().findRecord( 'internalAssetId', asset.get( 'assetId' )),
                componentId  = 'spell.component.2d.graphics.appearance',
                config       = {}

            if( previewAsset ) {
                switch( previewAsset.get( 'subtype' ) ) {
                    case this.TYPE_ANIMATION:
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

		this.initSpellEngineAssetIFrame( container, entity )

		var cameraSystem = Ext.getStore( 'template.Systems').getByTemplateId( 'spell.system.debug.camera' )
		this.messageBus[ container.getId() ] = [
			{
				type: "system.update",
				payload: {
					executionGroupId: 'update',
					definition: Ext.amdModules.systemConverter.toEngineFormat( cameraSystem.getData( true ), { includeNamespace: true } ),
					systemConfig: {
						active: true,
						deactivatedPlugins: ['entityMover']
					},
					systemId: cameraSystem.getFullName()
				}
			}
		]
	},

	tileMapPreviewHelper: function( container, asset, entity ) {
		var components = entity.getComponents()

		components.add({
				templateId: "spell.component.2d.graphics.tilemap",
				config:{ assetId: asset.get( 'internalAssetId' ) } }
		)

		this.initSpellEngineAssetIFrame( container, entity )

		var cameraSystem = Ext.getStore( 'template.Systems').getByTemplateId( 'spell.system.debug.camera' )
		this.messageBus[ container.getId() ] = [
			{
				type: "system.update",
				payload: {
					executionGroupId: 'update',
					definition: Ext.amdModules.systemConverter.toEngineFormat( cameraSystem.getData( true ), { includeNamespace: true } ),
					systemConfig: {
						active: true,
						selectedEntityId:   entity.get( 'id' ),
						deactivatedPlugins: ['entityMover']
					},
					systemId: cameraSystem.getFullName()
				}
			}
		]
	},

	initSpellEngineAssetIFrame: function( container, entity ) {
		entity.getComponents().each(
			function( component ) {
				component.set( 'additional', true )
			}
		)

		this.application.sendDebugMessage(
			container.getId(),
			'runtimeModule.start',
			this.application.getController( 'templates.Entities' ).createEntityPreviewItem( entity )
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
