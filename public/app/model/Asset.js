Ext.define('Spelled.model.Asset', {
    extend: 'Ext.data.Model',

	mixins: ['Spelled.abstract.model.Model'],

	sortOrder: 5,

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
		writer: {
			type: 'asset'
		}
	},

    fields: [
		{ name: 'type', type: 'string', defaultValue: 'asset' },
		'subtype',
		'file',
        'namespace',
		'config',
		'name'
    ],

	destroy: function( options ) {
		if( this.get( 'file' ) ) Spelled.StorageActions.destroy({ id: this.getAbsoluteFilePath() } )

		this.callParent( options )
	},

	createTreeNode: function( node ) {
		return node.appendChild(
			node.createNode( {
				text   : this.get( 'name' ),
				cls    : this.get( 'subtype' ),
				qtitle   : this.sortOrder,
				iconCls: this.iconCls,
				leaf   : true,
				id     : this.getId()
			} )
		)
	},

	getFullName: function() {
		return ( ( this.get('namespace').length > 0 ) ? this.get('namespace') +"."+ this.get('name') : this.get('name') )
	},

	constructor: function() {
		var object  = arguments[0] || arguments[2],
			assetId =this.generateIdentifier( object ),
			internalAssetId = object.subtype + ":" + assetId

		switch( object.subtype ) {
			case "spriteSheet":
				this.iconCls = "tree-asset-spritesheet-icon"
				break
			case "animation":
				this.iconCls = "tree-asset-2danimation-icon"
				break
			case "appearance":
				this.iconCls = "tree-asset-2dstaticappearance-icon"
				break
			case "font":
				this.iconCls = "tree-asset-2dtextappearance-icon"
				this.sortOrder = 6
				break
			case "sound":
				this.iconCls = "tree-asset-sound-icon"
				break
			case "keyToActionMap":
				this.iconCls = "tree-asset-keytoactionmap-icon"
				this.sortOrder = 5
				break
		}

		this.callParent( arguments )

		this.set( 'assetId', assetId)
		this.set( 'internalAssetId', internalAssetId)
	},

	getAbsoluteFilePath: function() {
		return this.getId().replace( ".json", "." + this.get( 'file' ).split( "." ).pop() )
	},

    getFilePath: function( projectName ) {
		return projectName + "/library/" + this.get( 'namespace').split( "." ).join( "/" ) + "/" + this.get( 'file' )
    }
});