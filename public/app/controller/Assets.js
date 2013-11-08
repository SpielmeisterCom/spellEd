Ext.define('Spelled.controller.Assets', {
    extend: 'Ext.app.Controller',

	TYPE_TILE_MAP: '2dTileMap',
	TYPE_APPEARANCE: 'appearance',
	TYPE_SPRITE_SHEET: 'spriteSheet',
	TYPE_ANIMATION: 'animation',
	TYPE_KEY_FRAME_ANIMATION: 'keyFrameAnimation',
	TYPE_FONT: 'font',
	TYPE_SOUND: 'sound',
	TYPE_KEY_TO_ACTION: 'inputMap',
	TYPE_TRANSLATION: 'translation',

	requires: [
		'Spelled.view.asset.ColorField',
		'Spelled.view.asset.Iframe',
		'Spelled.view.asset.Form',
		'Spelled.view.asset.FolderPicker',
		'Spelled.view.asset.create.Create',
		'Spelled.view.asset.create.Appearance',
		'Spelled.view.asset.create.SpriteSheet',
		'Spelled.view.asset.create.Animation',
		'Spelled.view.asset.create.Font',
		'Spelled.view.asset.create.InputMap',
		'Spelled.view.asset.create.KeyFrameAnimation',
		'Spelled.view.asset.edit.Edit',
		'Spelled.view.asset.inspector.Config',
		'Spelled.view.asset.create.Domvas',
		'Spelled.view.asset.create.2dTileMap',
		'Spelled.view.asset.create.FileField',
		'Spelled.view.asset.create.Sound',
		'Spelled.base.field.AssetId',
		'Spelled.base.grid.column.Action',


		'Spelled.store.asset.Types',
		'Spelled.store.asset.Appearances',
		'Spelled.store.asset.Sounds',
		'Spelled.store.asset.Fonts',
		'Spelled.store.asset.SpriteSheets',
		'Spelled.store.asset.Animations',
		'Spelled.store.asset.ActionKeys',
		'Spelled.store.template.component.KeyFrameComponents',
		'Spelled.store.asset.KeyFrameAnimations',
        'Spelled.store.asset.KeyFrameAnimationPreviews',
		'Spelled.store.asset.InputMappings',
		'Spelled.store.asset.InterpolationFunctions',
		'Spelled.store.asset.Assets',
		'Spelled.store.asset.TileMaps',

		'Spelled.model.Asset',
		'Spelled.model.assets.Appearance',
		'Spelled.model.assets.Animation',
		'Spelled.model.assets.Font',
		'Spelled.model.assets.KeyFrameAnimation',
		'Spelled.model.assets.KeyMapping',
		'Spelled.model.assets.Sound',
		'Spelled.model.assets.SpriteSheet',
		'Spelled.model.assets.TileMap'
	],

    views: [
		'asset.ColorField',
        'asset.Iframe',
        'asset.Form',
        'asset.FolderPicker',
		'asset.create.Create',
		'asset.create.Appearance',
		'asset.create.SpriteSheet',
		'asset.create.Animation',
		'asset.create.Font',
		'asset.create.InputMap',
		'asset.create.KeyFrameAnimation',
		'asset.create.2dTileMap',
		'asset.create.Sound',
		'asset.edit.Edit',
		'asset.inspector.Config',
		'asset.create.Domvas',
		'asset.create.FileField'
    ],

    stores: [
        'asset.Appearances',
        'asset.Sounds',
		'asset.Fonts',
		'asset.SpriteSheets',
		'asset.Animations',
		'asset.KeyFrameAnimations',
		'asset.InputMappings',
	    'asset.TileMaps',

		'asset.ActionKeys',
		'asset.Types',
		'asset.InterpolationFunctions',
		'asset.KeyFrameAnimationPreviews',
		'template.component.KeyFrameComponents'
    ],

    models: [
        'Asset',
		'assets.Appearance',
		'assets.Animation',
		'assets.Font',
		'assets.KeyFrameAnimation',
		'assets.KeyMapping',
		'assets.Sound',
		'assets.SpriteSheet',
		'assets.TileMap'
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
			'keytoactionconfig gridpanel, keyframeanimationconfig gridpanel': {
				itemcontextmenu: this.showKeyMappingContextMenu,
				editclick: this.showKeyMappingContextMenu
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
			},
			'localizedfilefield': {
				localizechange: this.addLocalizationFileFields,
				updatepreview: this.updateLocalizationPreview
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
		var asset = this.getAssetByAssetId( payload.id )

		if( asset ) {
			this.updateAsset( asset.get( 'internalAssetId' ), payload.config )
		}
	},

	assetDeepLink: function( internalAssetId ) {
		var record = this.getAssetByAssetId( internalAssetId ),
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

			if( iframe ) iframe.load()
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
		var asset = this.getAssetByAssetId( assetId )

		if( asset ) {
			asset.set( config )
			this.application.fireEvent( 'assetchange', asset )
		}
	},

	postProcessAsset: function( model ) {
		if( model.get( 'type') === 'asset' && model.get( 'subtype' ) === this.TYPE_FONT ) {
			var id = this.application.generateFileIdFromObject( model.data )
			this.saveFontMap( id,  model.data )
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
		var form  = view.up( 'form'),
			asset = form.getRecord(),
			store = view.getStore()

		if( Ext.isObject( selectedRow ) ) store.remove( selectedRow )
		else store.removeAt( selectedRow )

		if( asset ) asset.setDirty()
		this.setAssetConfigFromForm( form, asset )
	},

	showKeyMappingContextMenu: function( view, row, column, index, e, options ) {
		this.application.fireEvent( 'showkeymappingcontextmenu', view, row, column, index, e, options )
	},

	addToGrid: function( grid, object ) {
		var form  = grid.up( 'form' ),
			asset = form.getRecord(),
			store = grid.getStore()

		store.add( object )
		grid.reconfigure( store )

		if( asset ) asset.setDirty()
		this.setAssetConfigFromForm( form, asset )
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

		if( form.isValid() ) imageField.setSrc( this.createFontMap( values, true ).imageDataUrl )
	},

	showDocumentation: function( docString ) {
		this.application.showDocumentation( docString )
	},

	showEditHelper: function( id, node ) {
		if( node ) id = node.getId()

		var asset = this.getAssetStoreByType( node.get( 'cls' ) ).getById( id )
		this.showEdit( asset )
	},

	fieldRenderHelper: function( type, fieldSet, asset ) {
		if( asset && asset.isReadonly() ) return

		var localized = asset && asset.get( 'localized' )

		switch( type ) {
			case this.TYPE_ANIMATION:
				fieldSet.add( { xtype: 'animationassetconfig' } )
				break
			case this.TYPE_FONT:
				this.addFontForm( fieldSet, asset )
				break
			case this.TYPE_SPRITE_SHEET:
				fieldSet.add( { xtype: 'spritesheetconfig', edit: !!asset } )
				break
			case this.TYPE_KEY_TO_ACTION:
				this.addInputMapForm( fieldSet, asset )
				break
			case this.TYPE_KEY_FRAME_ANIMATION:
				this.addKeyFrameAnimationForm( fieldSet, asset )
				break
			case this.TYPE_TILE_MAP:
				fieldSet.add( { xtype: '2dtilemapconfig', edit: !!asset } )
				break
			case this.TYPE_APPEARANCE:
				this.addLocalizationFileFields( fieldSet.add( { xtype: 'appearanceasset', edit: !!asset } ), localized )
				break
			case this.TYPE_SOUND:
				this.addLocalizationFileFields( fieldSet.add( { xtype: 'soundasset', edit: !!asset } ), localized )
				break
			case this.TYPE_TRANSLATION:
				if( asset ) fieldSet.add( { xtype: 'translationasset', asset: asset, project: this.application.getActiveProject() } )
				break
		}
	},

	addLocalizationFileFields: function( cmp, localized ) {
		var panel     = cmp.down( 'localizedfilefield'),
			project   = this.application.getActiveProject(),
			localized = !!localized

		panel.createLanguageTabs( localized, project.getSupportedLanguages() )
	},

	addInputMapForm: function( fieldSet, asset ) {
		var inputMapConfig = fieldSet.add( { xtype: 'keytoactionconfig' } )

		if( !!asset ) {
			var grid   = inputMapConfig.down('gridpanel'),
				store  = grid.getStore(),
				config = asset.get( 'config' )

			store.removeAll()
			Ext.Object.each(
				config,
				function( key, value, myself ) {
					store.add( { key: key, action: value } )
				}
			)

			inputMapConfig.down('gridpanel').reconfigure( store )
		}
	},

	addFontForm: function( fieldSet, asset ) {
		fieldSet.add( { xtype: 'textappearanceconfig' } )
		this.refreshFontPreview( fieldSet.down( 'combobox[name="fontFamily"]' ) )
	},

	addKeyFrameAnimationForm: function( fieldSet, asset ) {
		var keyFrameAnimationConfig = fieldSet.add( { xtype: 'keyframeanimationconfig' } )
		this.renderKeyFrameAnimationComponentsTree( keyFrameAnimationConfig )

		if( !!asset ) {
			keyFrameAnimationConfig.asset = asset
			keyFrameAnimationConfig.keyFrameConfig = asset.get( 'animate' ) || {}
		} else {
			keyFrameAnimationConfig.keyFrameConfig = {}
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
					this.application.getController('Components').appendComponentsOnTreeNode( rootNode, templateComponentsStore, true, true )
				}
			}
		)
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

			var componentConfig = config[ componentId ]

			if( !componentConfig ) componentConfig = config[ componentId ] = {}

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

			grid.down( 'gridcolumn[dataIndex="value"]').setEditor( { xtype: xtype } )

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

		//TODO: find out why setValues is needed for showing for example the font form
		view.getForm().setValues( asset.data )
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
		var form          = button.up('form'),
			record        = form.getRecord(),
			previewIframe = button.up( 'editasset' ).down( 'assetiframe' )

		if( record && form.getForm().isValid() ) {
			this.setAssetConfigFromForm( form, record )

			this.application.fireEvent( 'assetchange', record, previewIframe )

			record.setDirty()
		}
	},

	getAssetModelByType: function( type ) {
		return this.getAssetStoreByType( type ).model
	},

	getAssetStoreByType: function( type ) {
		return Spelled.StoreHelper.getAssetStoreByType( type )
	},

	showConfigHelper: function( tree, node ) {
		if( !node.isLeaf() ) return

		var store = this.getAssetStoreByType( node.get( 'cls' ) ),
			asset = store.getById( node.getId() )

		this.showConfig( asset )
	},

	showConfig: function( asset ) {
		var inspectorPanel = this.getRightPanel(),
			View           = this.getAssetInspectorConfigView(),
			view           = new View(),
			project        = this.application.getActiveProject(),
			src            = asset.getFilePath( project.get('name'), project.getDefaultLanguageKey() )

		view.loadRecord( asset )

		inspectorPanel.setTitle( 'Asset information of "' + asset.get('name') +'"' )

		view.docString = asset.docString

		switch( asset.get('subtype') ) {
			case this.TYPE_APPEARANCE:
			case this.TYPE_SPRITE_SHEET:
			case this.TYPE_FONT:
				view.add( { xtype: 'image', margin: 20, src: src } )
				break
		}

		inspectorPanel.add( view )

		//TODO: workaround because extjs won't detect correctly fields which were initialized in the constructor
		view.down( 'displayfield[name="internalAssetId"]' ).setValue( asset.get( 'internalAssetId' ) )
	},

    showListContextMenu: function( view, record, item, index, e, options ) {
        this.application.getController('Menu').showAssetsListContextMenu( e )
    },

	createFontMap: function( values, debug ) {
		var fontGenerator = Ext.amdModules.createFontGenerator()

		var settings = {
			font         : values.fontFamily,
			size         : parseInt( values.fontSize, 10 ),
			style        : values.fontStyle,
			hSpacing     : parseInt( values.hSpacing, 10 ),
			vSpacing     : parseInt( values.vSpacing, 10 ),
			color        : values.color,
			outlineColor : values.outlineColor,
			outline      : parseInt( values.outline, 10 ),
			firstChar    : parseInt( values.firstChar, 10 ),
			lastChar     : parseInt( values.lastChar, 10 )
		}

		return fontGenerator.create( settings, debug )
	},

	setAssetConfigFromForm: function( form, asset ) {
		var values = form.getForm().getFieldValues()
		//no override of namespace
		delete values.namespace
		delete values.name

		switch( asset.get( 'subtype' ) ) {
			case this.TYPE_FONT:
				asset.setFontMapInfo( this.createFontMap( values ) )
				break
			case this.TYPE_KEY_TO_ACTION:
				asset.setKeyMappings( form.down( 'grid' ) )
				break
			case this.TYPE_KEY_FRAME_ANIMATION:
				asset.setKeyFrames( form.down( 'keyframeanimationconfig').keyFrameConfig )
				delete values.time
				delete values.value
				break
			case this.TYPE_TILE_MAP:
				asset.calculateTileLayerData()
				break
		}

		asset.set( values )
	},

	saveFontMap: function( id, values ) {
		var result = this.createFontMap( values )
		this.saveBase64AssetFile( id + ".png", result.imageDataUrl )
	},

	saveAsset: function( form, asset ) {
		var fileFields = Ext.ComponentQuery.query( 'assetfilefield', form ),
			window     = form.up( 'window' ),
			id         = this.application.generateFileIdFromObject( asset.data ),
			type       = asset.get( 'subtype'),
			store      = this.getAssetStoreByType( type )

		this.setAssetConfigFromForm( form, asset )

		if( type === this.TYPE_FONT ) {
			this.saveFontMap( id,  form.getForm().getValues() )
		}

		var successCallback = Ext.bind( function() {
			store.add( asset )
		},this)

		if( Ext.isArray( fileFields ) && fileFields.length > 0 ) {

			Ext.each(
				fileFields,
				function( fileField ) {
					if( fileField && fileField.isValid() )
						this.saveFileUploadFromAsset( fileField, asset, successCallback )
				},
				this
			)

		} else {
			asset.save({ success: successCallback })
		}

		window.close()
	},

	sliceTileMapData: function( asset ) {
		var data   = asset.get( 'tileLayerData' ),
			height = asset.get( 'height' ),
			width  = asset.get( 'width' ),
			slice  = Ext.Array.slice

		for( var y = 0; y < height; y++ ) {
			data[y] = slice( data[y], 0, width )
		}

		asset.set( 'tileLayerData',  slice( data, 0, height ) )
		asset.save()
	},

	saveFileUploadFromAsset: function( fileField, asset, callback ) {
		var me        = this,
			id        = this.application.generateFileIdFromObject( asset.data ),
			reader    = new FileReader(),
			file      = fileField.fileRawInput,
			name      = asset.get( 'name' ),
			localized = asset.get( 'localized'),
			isSound   = asset.isSound

		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function( e ) {
				var result    = e.target.result,
					extension = theFile.type.split( "/").pop()

				if( localized ) {
					var language      = fileField.getName(),
						localizations = asset.get( 'localization' )

					if( Ext.isObject( localizations ) && !isSound ) {
						asset.removeLocalizedResource( language, localizations[language] )
					}

					asset.setLocalizedFileInfo( extension, language )
					extension = Spelled.Converter.localizeExtension( language, extension )

				} else if( !isSound ) {
					asset.removeResource()
					asset.setFile( [ name , extension ].join( '.' ) )
				}

				me.saveBase64AssetFile( id + '.' + extension, result )
				asset.save({ success: callback })
			}
		})( file )
		reader.readAsDataURL( file )
	},

    createAsset: function( button ) {
        var form    = button.up('form').getForm(),
            window  = button.up( 'window' ),
			values  = form.getValues(),
			Asset   = this.getAssetModelByType( values.subtype ),
			store   = this.getAssetStoreByType( values.subtype ),
			content = {
				name: values.name,
				namespace: ( values.namespace === 'root' ) ? '' : values.namespace.substring( 5 )
			},
			id      = this.application.generateFileIdFromObject( content )

		if( form.isValid() ){
			content.id = id + ".json"
			var asset = Asset.create( content )

			store.add( asset )
			this.saveAsset( button.up('form'), asset )
        }
    },

	saveBase64AssetFile: function( filePath, content ) {
		Spelled.StorageActions.create( {
			id: filePath,
			encoding: 'base64',
			content: content.replace(/^data:[A-Za-z0-9\/]*;base64,/, "")
		})
	},

	removeAsset: function( assetId, type ) {
        var store       = this.getAssetStoreByType( type ),
			asset       = store.getById( assetId ),
			assetEditor = this.getAssetEditor()

		store.remove( asset )
		this.application.closeOpenedTabs( assetEditor, asset.getFullName() )

		asset.destroy()
    },

    showCreateAsset: function( button ) {
        var view        = Ext.widget( 'createasset' ),
			assetsCombo = view.down('hidden[name="subtype"]'),
			assetType   = button.type

		assetsCombo.setValue( assetType )

		this.fieldRenderHelper( assetType, view.down( 'fieldset' ) )

		view.show()

		this.application.fireEvent( 'selectnamespacefrombutton', view, button )
    },

	updateLocalizationPreview: function( container, asset, language ) {
		var project = this.application.getActiveProject(),
			src     = asset.getFilePath( project.get('name'), language )

		container.load( src )
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
			case this.TYPE_SPRITE_SHEET:
				view.add( { xtype: 'assetiframe', workspacePrefix: false, src: asset.getFilePath( project.get('name') ), height: '100%' } )
				break
            case this.TYPE_KEY_FRAME_ANIMATION:
			case this.TYPE_ANIMATION:
			case this.TYPE_TILE_MAP:
				var preview = Ext.widget( 'assetiframe', { src: project.get( 'name' ) + '/public/spellEdShim.html' } )

				if( subType === this.TYPE_TILE_MAP )
					this.tileMapPreviewHelper( preview, asset, entityConfig )
				else
					this.animationPreviewHelper( preview, asset, entityConfig )

				view.add( preview )
				break
		}
    },

	getAssetByAssetId: function( assetId ) {
		var myAssetId   = Spelled.Converter.internalAssetIdToMyAssetId( assetId )

		return Ext.getStore( 'Library' ).findLibraryItemByLibraryId( myAssetId )
	},

	animationPreviewHelper: function( container, asset, entity ) {
		var components = entity.getComponents()

        if( asset.get('subtype') === this.TYPE_KEY_FRAME_ANIMATION ){
            var previewAsset = this.getAssetByAssetId( asset.get( 'assetId' ) ),
                config       = { assetId: 'appearance:spell.defaultAppearance' }

            if( previewAsset ) {
                config.assetId = previewAsset.get( 'internalAssetId' )
            }

            components.add([{
                templateId: "spell.component.animation.keyFrameAnimation",
                config:{ assetId: asset.get( 'internalAssetId' ) }
            },{
                templateId: 'spell.component.2d.graphics.animatedAppearance',
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
						selectedEntityId: entity.get( 'id' ),
						deactivatedPlugins: ['entityMover']
					},
					systemId: cameraSystem.getFullName()
				}
			}
		]
	},

	initSpellEngineAssetIFrame: function( container, entity ) {
		var store        = this.getAssetKeyFrameAnimationPreviewsStore(),
			spriteSheets = this.getAssetSpriteSheetsStore().collect( 'myAssetId' )

		store.load(
			{
				scope: this,
				callback: function() {
					var dependencies = Ext.Array.merge( store.collect( 'myAssetId' ), spriteSheets ),
						config = this.application.getController( 'templates.Entities' ).createEntityPreviewItem( entity, dependencies)

					this.application.fireEvent( 'initentitypreviewruntime', container.getId(), config.applicationModule, config.cacheContent )
				}
			}
		)
	}
});
