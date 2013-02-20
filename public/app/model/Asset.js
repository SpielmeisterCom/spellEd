Ext.define('Spelled.model.Asset', {
    extend: 'Ext.data.Model',
	requires: [
		'proxy.direct',
		'Spelled.data.writer.Asset',
		'Spelled.data.reader.Asset'
	],

	docString: '#!/guide/asset',

	mixins: ['Spelled.abstract.model.Model'],

	sortOrder: 999,

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
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
			this.updateDependencies()
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
			node     = { libraryId: this.getFullName(), children: children }

		if( this.get( 'assetId' ) ) {
			var myAssetId = Spelled.Converter.internalAssetIdToMyAssetId( this.get( 'assetId' ) )

			if( myAssetId ) {
				var asset = Ext.getStore( 'Library').findLibraryItemByLibraryId( myAssetId )
				if( asset ) children.push( asset.createDependencyNode() )
			}
		}

		return node
	},

	destroy: function( options ) {
		if( this.get( 'file' ) ) Spelled.StorageActions.destroy({ id: this.getAbsoluteFilePath() } )

		this.callParent( arguments )
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
		return this.getId().replace( ".json", "." + this.get( 'file' ).split( "." ).pop() )
	},

    getFilePath: function( projectName ) {
		return projectName + "/library/" + this.get( 'namespace').split( "." ).join( "/" ) + "/" + this.get( 'file' )
    },

    toSpellEngineMessageFormat: function() {
        var data    = this.getData(),
            payload = Ext.amdModules.assetConverter.toEngineFormat( data )

        Ext.copyTo( payload, data, 'name,namespace' )

        return payload
    }
});