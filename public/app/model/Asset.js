Ext.define('Spelled.model.Asset', {
    extend: 'Ext.data.Model',
	requires: [
		'proxy.storageaction',
		'Spelled.data.writer.Asset',
		'Spelled.data.reader.Asset'
	],

	docString: '#!/guide/asset',

	mixins: ['Spelled.base.model.Model'],

	sortOrder: 999,

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset'
		},
		writer: 'asset',
		reader: 'asset'
	},

    fields: [
		{ name: 'type', type: 'string', defaultValue: 'asset' },
		'subtype',
		{ name: 'namespace', type: 'string', defaultValue: '' },
		{ name: 'readonly', type: 'boolean', defaultValue: false },
		'name'
    ],

	listeners: {
		dirty: function() {
			this.needToCalcCependency()
		}
	},

	isReadonly: function() {
		return ( this.get('readonly') === true )
	},

	setDirty: function() {
		this.fireDirtyEvent()
		this.callParent()
	},

	getCalculatedDependencies: function() {
		var ids = []

		if( this.get( 'assetId' ) ) {
			var myAssetId = Spelled.Converter.internalAssetIdToMyAssetId( this.get( 'assetId' ) )

			if( myAssetId ) {
				ids.push( myAssetId )

				var asset = Ext.getStore( 'Library').findLibraryItemByLibraryId( myAssetId )
				if( asset ) Ext.Array.push( ids, asset.getDependencies() )
			}
		}

		return ids
	},

	createDependencyNode: function() {
		var children = [],
			node     = { libraryId: this.getFullName(), children: children, iconCls: this.iconCls }

		if( this.get( 'assetId' ) ) {
			var myAssetId = Spelled.Converter.internalAssetIdToMyAssetId( this.get( 'assetId' ) )

			if( myAssetId ) {
				var asset = Ext.getStore( 'Library').findLibraryItemByLibraryId( myAssetId )
				if( asset ) children.push( asset.getDependencyNode() )
			}
		}

		return node
	},

	destroy: function( options ) {
		this.removeResource()

		this.callParent( arguments )
	},

	removeResource: function() {
		if( this.getFile() ) Spelled.StorageActions.destroy({ id: this.getAbsoluteFilePath() } )
	},

	removeLocalizedResource: function( language, extension ) {
		var filePath = Spelled.Converter.getLocalizedFilePath( this.getAbsoluteFilePath(), extension, language )

		if( filePath ) Spelled.StorageActions.destroy({ id: filePath } )
	},

	createTreeNode: function( node ) {
		return node.appendChild(
			node.createNode( {
				text   : this.get( 'name' ),
				cls    : this.get( 'subtype' ),
				sortOrder : this.sortOrder,
				libraryId : this.getFullName(),
				iconCls: this.iconCls,
				leaf   : true,
				id     : this.getId()
			} )
		)
	},

	setFile: function( filePath ) {
		this.set( 'file', filePath )
	},

	setLocalizedFileInfo: function(  extension, language ) {
		var localization = this.get( 'localization' ) || {}

		localization[ language ] = extension

		this.set( 'localization', localization )
	},

	getFile: function() {
		return this.get( 'file' )
	},

	getFullName: function() {
		return this.get( 'myAssetId' )
	},

	constructor: function() {
		var object  = arguments[0] || arguments[2],
			assetId = this.generateIdentifier( object )

		this.callParent( arguments )

		var type = this.raw.subtype || this.data.subtype
		this.insertMetaData( 'asset.Types', type )

		this.set( 'myAssetId', assetId)
		this.set( 'internalAssetId', type + ":" + assetId)
	},

	getAbsoluteFilePath: function() {
		return this.getId().replace( ".json", "." + this.getFile().split( "." ).pop() )
	},

    getFilePath: function( projectName, language, qualityLevel ) {
		var filePath = Spelled.Converter.toWorkspaceUrl( projectName + "/library/" + this.get( 'namespace').split( "." ).join( "/" ) + "/" + this.getFile() )

		var newFilePath = filePath

		if( this.get( 'localized' ) && language && language != 'default' ) {
			var localization = this.get( 'localization'),
				extension    = localization[ language ]

			newFilePath = Spelled.Converter.getLocalizedFilePath( filePath, extension, language )
		} else {
			newFilePath = filePath
		}

		if( qualityLevel && this.get( 'qualityLevels' ) ) {
			newFilePath = Spelled.Converter.getQualityFilePath( newFilePath, qualityLevel )
		}

		return newFilePath
    },

    toSpellEngineMessageFormat: function() {
        var data    = this.getData(),
            payload = Ext.amdModules.assetConverter.toEngineFormat( data )

        Ext.copyTo( payload, data, 'name,namespace' )

        return payload
    }
});